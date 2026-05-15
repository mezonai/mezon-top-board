import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { AppStatus } from '@domain/common/enum/appStatus';
import { App, AppVersion, Tag } from '@domain/entities';
import { CreateAppVersionRequest } from '@features/app-version/dtos/request';
import { GenericRepository } from '@libs/repository/genericRepository';
import { AppTranslationService } from '@features/app-translation/app-translation.service';

@Injectable()
export class AppVersionService {
  private readonly appRepository: GenericRepository<App>;
  private readonly appVersionRepository: GenericRepository<AppVersion>;
  private readonly tagRepository: GenericRepository<Tag>;
  constructor(
    private manager: EntityManager,
    private appTranslationService: AppTranslationService,
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
    const { id, createdAt, updatedAt, hasNewUpdate, tagIds, appTranslations, ...rest } = mergedData;
    const tags = await this.tagRepository.getRepository().findBy({ id: In(tagIds) });

    const newVersion = await this.appVersionRepository.create({
      ...rest,
      tags,
      version: nextVersion,
      status: AppStatus.PENDING,
    });

    if (appTranslations && appTranslations.length > 0) {
      await this.appTranslationService.createOrUpdateAppTranslations(
        appTranslations,
        null,
        newVersion.id
      );
    }

    return newVersion;
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
      relations: ['tags', 'socialLinks', 'app', 'appTranslations'],
    });
    if (!appVersion) throw new NotFoundException('AppVersion not found');

    const { id, createdAt, updatedAt, app, changelog, tags, socialLinks, appId, version, appTranslations, ...rest } = appVersion;

    const mezonApp = await this.appRepository.findOne({
      where: { id: appId },
      relations: ['tags', 'socialLinks', 'appTranslations'],
    });
    if (!mezonApp) throw new NotFoundException('App not found');

    Object.assign(mezonApp, rest);
    mezonApp.tags = tags;
    mezonApp.socialLinks = socialLinks;
    // TODO: will implement manual publish later
    mezonApp.status = AppStatus.PUBLISHED;
    mezonApp.hasNewUpdate = false;
    mezonApp.currentVersion = version;

    if (appTranslations) {
      const transDtos = appTranslations.map(t => ({
        language: t.language,
        name: t.name,
        headline: t.headline,
        description: t.description
      }));
      await this.appTranslationService.createOrUpdateAppTranslations(transDtos, mezonApp.id, null);
    }

    await this.appVersionRepository.update(versionId, { status: AppStatus.APPROVED });

    return await this.appRepository.getRepository().save(mezonApp);
  }

  async rejectVersion(versionId: string) {
    const version = await this.appVersionRepository.findOne({ where: { id: versionId } });
    if (!version) throw new NotFoundException('AppVersion not found');

    const app = await this.appRepository.findOne({ where: { id: version.appId } });
    if (!app) throw new NotFoundException('App not found');

    await this.appVersionRepository.update(versionId, { status: AppStatus.REJECTED });
    if (app.status === AppStatus.PENDING) {
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
