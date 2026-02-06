import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { AppTranslation } from "@domain/entities";
import { AppTranslationDto } from "@domain/common/dtos/appInfo.dto";
import { GenericRepository } from "@libs/repository/genericRepository";

@Injectable()
export class AppTranslationService {
    private readonly appTranslationRepository: GenericRepository<AppTranslation>;

    constructor(private manager: EntityManager) {
        this.appTranslationRepository = new GenericRepository(AppTranslation, manager);
    }

    async createOrUpdateAppTranslations(
        appTranslations: AppTranslationDto[],
        appId?: string,
        appVersionId?: string
    ) {
        if (appId) {
            await this.appTranslationRepository.getRepository().delete({ appId });
        }
        if (appVersionId) {
            await this.appTranslationRepository.getRepository().delete({ appVersionId });
        }

        const entities = appTranslations.map(t => this.appTranslationRepository.create({
            ...t,
            appId: appId || null,
            appVersionId: appVersionId || null
        }));

        return await Promise.all(entities);
    }
}