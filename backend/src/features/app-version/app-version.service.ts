import { Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, In } from 'typeorm';

import { AppStatus } from '@domain/common/enum/appStatus';
import { App, AppVersion, Tag } from '@domain/entities';

import { CreateAppVersionRequest } from '@features/app-version/dtos/request';

import { GenericRepository } from '@libs/repository/genericRepository';

@Injectable()
export class AppVersionService {
  private readonly appRepository: GenericRepository<App>;
  private readonly appVersionRepository: GenericRepository<AppVersion>;
  private readonly tagRepository: GenericRepository<Tag>;
  constructor(
    private manager: EntityManager
  ) {
    this.appRepository = new GenericRepository(App, manager);
    this.appVersionRepository = new GenericRepository(AppVersion, manager);
    this.tagRepository = new GenericRepository(Tag, manager);
  }

  async createVersion(versionData: CreateAppVersionRequest) {
    const app = await this.appRepository.findOne({ where: { id: versionData.appId } });
    if (!app) throw new NotFoundException('App not found for creating version');

    const latestVersion = await this.appVersionRepository.findOne({
      where: { appId: versionData.appId },
      order: { version: 'DESC' },
    });
    const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

    const mergedData = Object.assign(app, versionData);
    const { id, createdAt, updatedAt, hasNewUpdate, tagIds, ...rest } = mergedData
    const tags = await this.tagRepository.getRepository().findBy({ id: In(tagIds) })
    return await this.appVersionRepository.create({
      ...rest,
      tags,
      version: nextVersion,
      status: AppStatus.PENDING,
    });
  }

  async getVersionsByApp(appId: string) {
    return await this.appVersionRepository.find({
      where: { appId },
      order: { createdAt: 'DESC' },
    });
  }

  async approveVersion(versionId: string) {
    const appVersion = await this.appVersionRepository.findOne({
      where: { id: versionId },
      relations: ['tags', 'socialLinks', 'app'],
    });
    if (!appVersion) throw new NotFoundException('AppVersion not found');

    const { id, createdAt, updatedAt, app, changelog, tags, socialLinks, appId, version, ...rest } = appVersion;

    const mezonApp = await this.appRepository.findOne({
      where: { id: appId },
      relations: ['tags', 'socialLinks'],
    });
    if (!mezonApp) throw new NotFoundException('App not found');

    Object.assign(mezonApp, rest);
    mezonApp.tags = tags;
    mezonApp.socialLinks = socialLinks;
    mezonApp.status = AppStatus.APPROVED;
    mezonApp.hasNewUpdate = false;
    mezonApp.currentVersion = version;

    await this.appRepository.getRepository().save(mezonApp);

    await this.appVersionRepository.update(versionId, { status: AppStatus.APPROVED });

    return mezonApp;
  }

  async rejectVersion(versionId: string) {
    const version = await this.appVersionRepository.findOne({ where: { id: versionId } });
    if (!version) throw new NotFoundException('AppVersion not found');

    const app = await this.appRepository.findOne({ where: { id: version.appId } });
    if (!app) throw new NotFoundException('App not found');

    await this.appVersionRepository.update(versionId, { status: AppStatus.REJECTED });
    if (version.version === 1 || app.status === AppStatus.PENDING) {
      return await this.appRepository.update(version.appId, {
        status: AppStatus.REJECTED,
        hasNewUpdate: false,
      });
    }

    return await this.appRepository.update(version.appId, {
      hasNewUpdate: false,
    });
  }
}
