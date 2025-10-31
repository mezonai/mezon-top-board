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
    const app = await this.appRepository.findById(versionData.appId);
    if (!app) throw new NotFoundException('App not found for creating version');

    const mergedData = Object.assign(app, versionData);
    return await this.appVersionRepository.create(mergedData);
  }

  async getVersionsByApp(appId: string) {
    return await this.appVersionRepository.find({
      where: { appId },
      order: { createdAt: 'DESC' },
    });
  }

  async approveVersion(versionId: string) {
    const appVersion = await this.appVersionRepository.findById(versionId);
    if (!appVersion) throw new NotFoundException('AppVersion not found');

    const app = await this.appRepository.findById(appVersion.appId);
    if (!app) throw new NotFoundException('App not found for creating version');

    await this.appVersionRepository.update(versionId, { status: AppStatus.APPROVED });

    const mergedData = Object.assign(app, appVersion);
    return await this.appRepository.update(appVersion.appId, {
      ...mergedData,
      currentVersion: mergedData.version,
    });
  }

  async rejectVersion(versionId: string) {
    const version = await this.appVersionRepository.findById(versionId);
    if (!version) throw new NotFoundException('AppVersion not found');

    await this.appVersionRepository.update(versionId, { status: AppStatus.REJECTED });
    if (version.version === 1) {
      await this.appRepository.update(version.appId, { status: AppStatus.REJECTED });
    }

    return new Result({message: 'Version rejected successfully'});
  }
}
