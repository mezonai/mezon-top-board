import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { EntityManager, In } from "typeorm";

import { Role } from "@domain/common/enum/role";
import { Collection, CollectionApp } from "@domain/entities";
import { App } from "@domain/entities";
import { User } from "@domain/entities";
import { CollectionStatus } from "@domain/entities/schema/collection.entity";

import { GenericRepository } from "@libs/repository/genericRepository";

import {
    CreateCollectionDto,
    UpdateCollectionDto,
    SearchCollectionsDto, GetMyCollectionsQueryDto,
} from "./dtos/request";

@Injectable()
export class CollectionService {
    private readonly collectionRepo: GenericRepository<Collection>;
    private readonly collectionAppRepo: GenericRepository<CollectionApp>;
    private readonly appRepo: GenericRepository<App>;

    constructor(private readonly manager: EntityManager) {
        this.collectionRepo = new GenericRepository(Collection, manager);
        this.collectionAppRepo = new GenericRepository(CollectionApp, manager);
        this.appRepo = new GenericRepository(App, manager);
    }

    async create(userId: string, dto: CreateCollectionDto): Promise<Collection> {
        const { appIds, ...collectionData } = dto;

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
        const { pageNumber = 1, pageSize = 10, status } = query;

        const qb = this.collectionRepo
            .getRepository()
            .createQueryBuilder("collection")
            .leftJoinAndSelect("collection.collectionApps", "collectionApps")
            .leftJoinAndSelect("collectionApps.app", "app")
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
                "collectionApps",
                "collectionApps.app",
                "collectionApps.app.appTranslations",
                "collectionApps.app.tags",
            ],
            order: {
                collectionApps: {
                    order: "ASC",
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
            .leftJoinAndSelect("collection.collectionApps", "collectionApps")
            .loadRelationCountAndMap(
                "collection.appCount",
                "collection.collectionApps"
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

    private async setCollectionApps(
        collectionId: string,
        appIds: string[]
    ): Promise<void> {
        // Verify all apps exist and are published
        const apps = await this.appRepo.find({
            where: { id: In(appIds) },
        });

        if (apps.length !== appIds.length) {
            throw new BadRequestException("One or more apps not found");
        }

        // Delete existing relations
        await this.collectionAppRepo.getRepository().delete({ collectionId });

        // Create new relations with order
        const collectionApps = appIds.map((appId, index) => ({
            collectionId,
            appId,
            order: index,
        }));

        await this.collectionAppRepo.getRepository().save(collectionApps);
    }
}