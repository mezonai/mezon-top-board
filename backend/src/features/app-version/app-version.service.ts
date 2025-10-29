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

  async createVersion(versionData: CreateAppVersionRequest ) {
    const app = await this.appRepository.findOne({ where: { id: versionData.appId } });
    if (!app) throw new NotFoundException('App not found for creating version');
    return await this.appVersionRepository.create({
      ...versionData,
      featuredImage: versionData?.featuredImage ? versionData.featuredImage : app.featuredImage
    });
  }

  async getVersionsByApp(appId: string) {
    return await this.appVersionRepository.find({
      where: { appId },
      order: { createdAt: 'DESC' },
    });
  }

  async approveVersion(versionId: string, approverId: string) {
    const appVersion = await this.appVersionRepository.findOne({
      where: { id: versionId },
      relations: ['app'],
    });
    if (!appVersion) throw new NotFoundException('AppVersion not found');

    const app = appVersion.app;
    if (!app) throw new NotFoundException('App not found for version');
    const newApp = await this.appRepository.update(app.id, {
      //todo fixed
      ...appVersion,
      status: AppStatus.APPROVED,
    });
    await this.appVersionRepository.update(appVersion.id, {
      status: AppStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: approverId
    });

    return new Result({message: 'Version approved successfully', data: newApp});
  }

  async rejectVersion(versionId: string, remark?: string) {
    const version = await this.appVersionRepository.findOne({ where: { id: versionId } });
    if (!version) throw new NotFoundException('AppVersion not found');

    version.status = AppStatus.REJECTED;
    version.remark = remark;
    await this.appVersionRepository.update(version.id, version);
    return new Result({message: 'Version rejected successfully'});
  }
}
