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
    const { id, createdAt, updatedAt, ...rest } = mergedData;
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

    return await this.appRepository.update(appVersion.appId, {
      tags: appVersion.tags,
      socialLinks: appVersion.socialLinks,
      name: appVersion.name,
      status: appVersion.status,
      isAutoPublished: appVersion.isAutoPublished,
      headline: appVersion.headline,
      description: appVersion.description,
      prefix: appVersion.prefix,
      featuredImage: appVersion.featuredImage,
      supportUrl: appVersion.supportUrl,
      remark: appVersion.remark,
      pricingTag: appVersion.pricingTag,
      price: appVersion.price,
      currentVersion: appVersion.version,
    });
  }

  async rejectVersion(versionId: string) {
    const version = await this.appVersionRepository.findOne({ where: { id: versionId } });
    if (!version) throw new NotFoundException('AppVersion not found');

    version.status = AppStatus.REJECTED;
    await this.appVersionRepository.update(version.id, version);
    return new Result({message: 'Version rejected successfully'});
  }
}
