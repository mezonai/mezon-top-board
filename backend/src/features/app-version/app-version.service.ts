import { Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { Result } from '@domain/common/dtos/result.dto';
import { AppStatus } from '@domain/common/enum/appStatus';
import { App, AppVersion } from '@domain/entities';

import { CreateAppVersionRequest } from '@features/app-version/dtos/request';

import { GenericRepository } from '@libs/repository/genericRepository';

@Injectable()
export class AppVersionService {
  private readonly appRepository: GenericRepository<App>;
  private readonly appVersionRepository: GenericRepository<AppVersion>;
  constructor(
    private manager: EntityManager
  ) {
    this.appRepository = new GenericRepository(App, manager);
    this.appVersionRepository = new GenericRepository(AppVersion, manager);
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
    const { id, createdAt, updatedAt, hasNewUpdate, ...rest } = mergedData

    return await this.appVersionRepository.create({
      ...rest,
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
    });
    if (!appVersion) throw new NotFoundException('AppVersion not found');

    await this.appVersionRepository.update(versionId, { status: AppStatus.APPROVED });
    const { id, createdAt, updatedAt, app, changelog, appId, version, ...rest } = appVersion;
    if (rest.isAutoPublished) await this.appVersionRepository.update(versionId, { status: AppStatus.PUBLISHED });
    return await this.appRepository.update(appId, {
      ...rest,
      status: rest.isAutoPublished ? AppStatus.PUBLISHED : AppStatus.APPROVED,
      hasNewUpdate: false,
      currentVersion: version,
    });
  }

  async rejectVersion(versionId: string) {
    const appVersion = await this.appVersionRepository.findOne({ where: { id: versionId } });
    if (!appVersion) throw new NotFoundException('AppVersion not found');

    await this.appVersionRepository.update(versionId, { status: AppStatus.REJECTED });

    if (appVersion.version === 1) {
      await this.appRepository.update(appVersion.appId, { status: AppStatus.REJECTED });
    } else {
      await this.appRepository.update(appVersion.appId, { hasNewUpdate: false });
    }

    return new Result({message: 'Version rejected successfully'});
  }

  async publishVersion(versionId: string) {
    const appVersion = await this.appVersionRepository.findOne({ where: { id: versionId } });
    if (!appVersion) throw new NotFoundException('AppVersion not found');

    await this.appVersionRepository.update(versionId, { status: AppStatus.PUBLISHED });
    return await this.appRepository.update(appVersion.appId, { status: AppStatus.PUBLISHED, });
  }
}
