import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { User, App, UserFavorite } from "@domain/entities";
import { GenericRepository } from "@libs/repository/genericRepository";
import { ErrorMessages } from "@libs/constant/messages";
import { paginate } from "@libs/utils/paginate";
import { Result } from "@domain/common/dtos/result.dto";
import { GetFavoritesRequest } from "./dtos/request";

@Injectable()
export class FavoriteService {
    private readonly appRepository: GenericRepository<App>;
    private readonly userRepository: GenericRepository<User>;
    private readonly userFavoriteRepository: GenericRepository<UserFavorite>;

    constructor(private readonly manager: EntityManager) {
        this.appRepository = new GenericRepository(App, manager);
        this.userRepository = new GenericRepository(User, manager);
        this.userFavoriteRepository = new GenericRepository(UserFavorite, manager);
    }

    async getMyFavorites(userId: string, query: GetFavoritesRequest) {
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
            (entity) => entity
        );
    }

    async getFavoriteDetail(userId: string, appId: string) {
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

        return new Result({ data: app });
    }

    async addFavorite(userId: string, appId: string) {
        const app = await this.appRepository.findById(appId);
        if (!app) throw new NotFoundException(ErrorMessages.NOT_FOUND_MSG);

        const existing = await this.userFavoriteRepository.findOne({
            where: { userId, appId }
        });

        if (!existing) {
            await this.userFavoriteRepository.create({
                userId,
                appId
            });
        }

        return new Result({ message: "Added to favorites" });
    }

    async removeFavorite(userId: string, appId: string) {
        await this.userFavoriteRepository.getRepository().delete({
            userId,
            appId
        });

        return new Result({ message: "Removed from favorites" });
    }
}