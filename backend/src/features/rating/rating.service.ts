import { BadRequestException, Injectable } from "@nestjs/common";

import { EntityManager } from "typeorm";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Result } from "@domain/common/dtos/result.dto";
import { AppStatus } from "@domain/common/enum/appStatus";
import { App, Rating, User } from "@domain/entities";

import { ErrorMessages } from "@libs/constant/messages";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Mapper } from "@libs/utils/mapper";
import { paginate } from "@libs/utils/paginate";

import { CreateRatingRequest, GetAppRatingRequest, UpdateRatingRequest } from "./dtos/request";
import { CreateAppRatingResponse, GetAppRatingResponse } from "./dtos/response";

@Injectable()
export class RatingService {
    private readonly ratingRepository: GenericRepository<Rating>;
    private readonly mezonAppRepository: GenericRepository<App>;
    private readonly userRepository: GenericRepository<User>;

    constructor(private manager: EntityManager) {
        this.ratingRepository = new GenericRepository(Rating, manager);
        this.mezonAppRepository = new GenericRepository(App, manager);
        this.userRepository = new GenericRepository(User, manager);
    }

    async getAppRating(query: GetAppRatingRequest) {
        const mezonApp = await this.mezonAppRepository.findById(query.appId)
        if (!mezonApp || mezonApp.status !== AppStatus.PUBLISHED)
            throw new BadRequestException(ErrorMessages.INVALID_APP)

        return paginate<Rating, GetAppRatingResponse>(
            () => this.ratingRepository.findMany(
                {
                    ...query,
                    relations: ["user"],
                    where: () => ({ appId: query.appId })
                }),
            query.pageSize,
            query.pageNumber,
            (entity) => {
                return Mapper(GetAppRatingResponse, entity);
            },
        );
    }

    async createRating(userId: string, body: CreateRatingRequest) {
        const mezonApp = await this.mezonAppRepository.findById(body.appId)
        if (!mezonApp || mezonApp.status !== AppStatus.PUBLISHED)
            throw new BadRequestException(ErrorMessages.INVALID_APP)

        const user = await this.userRepository.findById(userId)
        if (!user)
            throw new BadRequestException(ErrorMessages.INVALID_USER)

        const rating = await this.ratingRepository.getRepository().findOne({ where: { appId: body.appId, userId } })
        if (rating)
            throw new BadRequestException(ErrorMessages.APP_RATING_LIMIT_REACHED)

    const newRating = await this.ratingRepository.create({ ...body, userId });
    newRating.user = user

    return Mapper(CreateAppRatingResponse, newRating);
  }

    async updateRating(userId: string, body: UpdateRatingRequest) {
        const user = await this.userRepository.findById(userId)
        if (!user)
            throw new BadRequestException(ErrorMessages.INVALID_USER)

        const rating = await this.ratingRepository.findById(body.id);
        if (rating.userId !== userId)
            throw new BadRequestException(ErrorMessages.APP_RATING_EDIT_RESTRICTION)

        await this.ratingRepository.update(body.id, { ...body, userId })
        return new Result()
    }

    async deleteRating(userId: string, body: RequestWithId) {
        console.log('userId', userId)
        const user = await this.userRepository.findById(userId)
        if (!user)
            throw new BadRequestException(ErrorMessages.INVALID_USER)

        const rating = await this.ratingRepository.findById(body.id);
        if (rating && rating.userId !== userId)
            throw new BadRequestException(ErrorMessages.APP_RATING_EDIT_RESTRICTION)

        await this.ratingRepository.softDelete(body.id)
        return new Result()
    }
}
