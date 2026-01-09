import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { App, FavoriteApp } from "@domain/entities";
import { GenericRepository } from "@libs/repository/genericRepository";
import { ErrorMessages } from "@libs/constant/messages";
import { paginate } from "@libs/utils/paginate";
import { Result } from "@domain/common/dtos/result.dto";
import { GetFavoritesAppRequest } from "./dtos/request";
import { FavoriteAppResponseDto } from "./dtos/response";
import { Mapper } from '@libs/utils/mapper';

@Injectable()
export class FavoriteAppService {
    private readonly appRepository: GenericRepository<App>;
    private readonly favoriteAppRepository: GenericRepository<FavoriteApp>;

    constructor(private readonly manager: EntityManager) {
        this.appRepository = new GenericRepository(App, manager);
        this.favoriteAppRepository = new GenericRepository(FavoriteApp, manager);
    }

    async getMyFavoriteApps(userId: string, query: GetFavoritesAppRequest) {
        const skip = (query.pageNumber - 1) * query.pageSize;
        const take = query.pageSize;

        const [data, total] = await this.appRepository.getRepository()
            .createQueryBuilder("app")
            .innerJoin("app.favorites", "favorite")
            .where("favorite.userId = :userId", { userId })
            .leftJoinAndSelect("app.owner", "owner")
            .leftJoinAndSelect("app.tags", "tags")
            .skip(skip)
            .take(take)
            .getManyAndCount();

        return paginate(
            [data, total],
            query.pageSize,
            query.pageNumber,
            (entity) => Mapper(FavoriteAppResponseDto, entity)
        );
    }

    async getFavoriteAppDetail(userId: string, appId: string) {
        const app = await this.appRepository.getRepository()
            .createQueryBuilder("app")
            .innerJoin("app.favorites", "favorite")
            .where("app.id = :appId", { appId })
            .andWhere("favorite.userId = :userId", { userId })
            .leftJoinAndSelect("app.owner", "owner")
            .leftJoinAndSelect("app.tags", "tags")
            .leftJoinAndSelect("app.socialLinks", "socialLinks")
            .getOne();

        if (!app) {
            throw new NotFoundException("Favorite bot not found or not in your list");
        }

        return new Result({ data: Mapper(FavoriteAppResponseDto, app) });
    }

    async addFavoriteApp(userId: string, appId: string) {
        const app = await this.appRepository.findById(appId);
        if (!app) throw new NotFoundException(ErrorMessages.NOT_FOUND_MSG);

        const existing = await this.favoriteAppRepository.findOne({
            where: { userId, appId }
        });

        if (!existing) {
            await this.favoriteAppRepository.create({
                userId,
                appId
            });
        }

        return new Result({ message: "Added to favorites" });
    }

    async removeFavoriteApp(userId: string, appId: string) {
        await this.favoriteAppRepository.getRepository().delete({
            userId,
            appId
        });

        return new Result({ message: "Removed from favorites" });
    }
}