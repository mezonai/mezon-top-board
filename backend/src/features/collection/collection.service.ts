import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { EntityManager, In } from "typeorm";

import { Role } from "@domain/common/enum/role";
import { Collection } from "@domain/entities";
import { App } from "@domain/entities";
import { User } from "@domain/entities";
import { CollectionStatus } from "@domain/common/enum/collectionStatus";

import { GenericRepository } from "@libs/repository/genericRepository";

import {
    CreateCollectionDto,
    UpdateCollectionDto,
    SearchCollectionsDto, GetMyCollectionsQueryDto,
} from "./dtos/request";

@Injectable()
export class CollectionService {
    private readonly collectionRepo: GenericRepository<Collection>;
    private readonly appRepo: GenericRepository<App>;

    constructor(private readonly manager: EntityManager) {
        this.collectionRepo = new GenericRepository(Collection, manager);
        this.appRepo = new GenericRepository(App, manager);
    }

    async create(userId: string, dto: CreateCollectionDto): Promise<Collection> {
        const { appIds, ...collectionData } = dto;

        if (appIds && appIds.length > 0) {
            await this.validateAppOwnership(appIds, userId);
        }

        const collection = await this.collectionRepo.create({
            ...collectionData,
            ownerId: userId,
        });

        if (appIds && appIds.length > 0) {
            await this.setCollectionApps(collection.id, appIds);
        }

        return this.findOne(collection.id, userId);
    }

    async findMyCollections(
        userId: string,
        query: GetMyCollectionsQueryDto
    ) {
        const { pageNumber, pageSize, status } = query;

        const qb = this.collectionRepo
            .getRepository()
            .createQueryBuilder("collection")
            .leftJoinAndSelect("collection.apps", "app")
            .leftJoinAndSelect("app.appTranslations", "translations")
            .where("collection.ownerId = :userId", { userId });

        if (status) {
            qb.andWhere("collection.status = :status", { status });
        }

        qb.orderBy("collection.createdAt", "DESC")
            .skip((pageNumber - 1) * pageSize)
            .take(pageSize);

        const [collections, total] = await qb.getManyAndCount();

        return { data: collections, total };
    }

    async findOne(id: string, userId?: string): Promise<Collection> {
        const collection = await this.collectionRepo.getRepository().findOne({
            where: { id },
            relations: [
                "owner",
                "apps",
                "apps.appTranslations",
                "apps.tags",
            ],
            order: {
                apps: {
                    createdAt: "ASC",
                },
            },
        });

        if (!collection) {
            throw new NotFoundException("Collection not found");
        }

        // If collection is private, only owner or admin can view
        if (collection.status === CollectionStatus.PRIVATE) {
            if (!userId) {
                throw new NotFoundException("Collection not found");
            }

            const user = await this.manager
                .getRepository(User)
                .findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException("Collection not found");
            }

            if (collection.ownerId !== userId && user.role !== Role.ADMIN) {
                throw new NotFoundException("Collection not found");
            }
        }

        return collection;
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateCollectionDto
    ): Promise<Collection> {
        const collection = await this.collectionRepo.findOne({
            where: { id },
            relations: ["owner"],
        });

        if (!collection) {
            throw new NotFoundException("Collection not found");
        }

        const user = await this.manager
            .getRepository(User)
            .findOne({ where: { id: userId } });

        if (!user) {
            throw new ForbiddenException("User not found");
        }

        if (collection.ownerId !== userId && user.role !== Role.ADMIN) {
            throw new ForbiddenException("You do not have permission to update this collection");
        }

        const { appIds, ...updateData } = dto;

        if (appIds !== undefined) {
            await this.validateAppOwnership(appIds, userId);
        }

        await this.collectionRepo.update(id, updateData);

        if (appIds !== undefined) {
            await this.setCollectionApps(id, appIds);
        }

        return this.findOne(id, userId);
    }

    async delete(id: string, userId: string): Promise<void> {
        const collection = await this.collectionRepo.findOne({
            where: { id },
            relations: ["owner"],
        });

        if (!collection) {
            throw new NotFoundException("Collection not found");
        }

        const user = await this.manager
            .getRepository(User)
            .findOne({ where: { id: userId } });

        if (!user) {
            throw new ForbiddenException("User not found");
        }

        if (collection.ownerId !== userId && user.role !== Role.ADMIN) {
            throw new ForbiddenException("You do not have permission to delete this collection");
        }

        await this.collectionRepo.softDelete(id);
    }

    async adminSearch(query: SearchCollectionsDto) {
        const { search, status, ownerId, pageNumber, pageSize } = query;

        const qb = this.collectionRepo
            .getRepository()
            .createQueryBuilder("collection")
            .leftJoinAndSelect("collection.owner", "owner")
            .leftJoinAndSelect("collection.apps", "apps")
            .loadRelationCountAndMap(
                "collection.appCount",
                "collection.apps"
            );

        if (search) {
            qb.andWhere("collection.title ILIKE :search", { search: `%${search}%` });
        }

        if (status) {
            qb.andWhere("collection.status = :status", { status });
        }

        if (ownerId) {
            qb.andWhere("collection.ownerId = :ownerId", { ownerId });
        }

        qb.orderBy("collection.createdAt", "DESC")
            .skip((pageNumber - 1) * pageSize)
            .take(pageSize);

        const [collections, total] = await qb.getManyAndCount();

        return { data: collections, total };
    }

    private async validateAppOwnership(appIds: string[], userId: string): Promise<void> {
        const user = await this.manager.getRepository(User).findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException("User not found");

        const apps = await this.appRepo.find({ where: { id: In(appIds) } });

        if (apps.length !== appIds.length) {
            const foundIds = apps.map((a) => a.id);
            const missingIds = appIds.filter((id) => !foundIds.includes(id));
            throw new BadRequestException(`Apps not found: ${missingIds.join(", ")}`);
        }

        if (user.role !== Role.ADMIN) {
            const notOwnedApps = apps.filter((app) => app.ownerId !== userId);
            if (notOwnedApps.length > 0) {
                throw new ForbiddenException(
                    `You can only add your own apps. Apps with IDs: ${notOwnedApps
                        .map((a) => a.id)
                        .join(", ")} are not yours.`
                );
            }
        }
    }

    private async setCollectionApps(collectionId: string, appIds: string[]): Promise<void> {
        const collection = await this.collectionRepo.findOne({
            where: { id: collectionId },
            relations: ["apps"],
        });
        if (!collection) return;

        const apps = await this.appRepo.find({
            where: appIds.map(id => ({ id })),
        });

        collection.apps = apps;
        await this.collectionRepo.getRepository().save(collection);
    }
}