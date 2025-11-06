import { BadRequestException, Injectable } from "@nestjs/common";

import { Brackets, EntityManager } from "typeorm";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Result } from "@domain/common/dtos/result.dto";
import { AppStatus } from "@domain/common/enum/appStatus";
import { SortField } from "@domain/common/enum/sortField";
import { SortOrder } from "@domain/common/enum/sortOder";
import { App, AppReviewHistory, AppVersion, Rating, User } from "@domain/entities";

import { AppVersionService } from "@features/app-version/app-version.service";

import { ErrorMessages, SuccessMessages } from "@libs/constant/messages";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Mapper } from "@libs/utils/mapper";
import { paginate } from "@libs/utils/paginate";

import {
  CreateAppReviewRequest,
  GetAppReviewRequest,
  SearchAppReviewRequest,
  UpdateAppReviewRequest,
} from "./dtos/request";
import { AppReviewResponse } from "./dtos/response";

@Injectable()
export class ReviewHistoryService {
  private readonly appRepository: GenericRepository<App>;
  private readonly appVersionRepository: GenericRepository<AppVersion>;
  private readonly appReviewRepository: GenericRepository<AppReviewHistory>;
  private readonly userRepository: GenericRepository<User>;
  private readonly ratingRepository: GenericRepository<Rating>;

  constructor(
    private manager: EntityManager,
    private readonly appVersionService: AppVersionService,
  ) {
    this.appRepository = new GenericRepository(App, manager);
    this.appVersionRepository = new GenericRepository(AppVersion, manager);
    this.appReviewRepository = new GenericRepository(AppReviewHistory, manager);
    this.userRepository = new GenericRepository(User, manager);
    this.ratingRepository = new GenericRepository(Rating, manager);
  }

  async createAppReview(reviewer: User, body: CreateAppReviewRequest) {
    const mezonApp = await this.appRepository.findById(body.appId);
    if (!mezonApp || mezonApp.hasNewUpdate === false) {
      throw new BadRequestException(ErrorMessages.INVALID_APP);
    }

    const mezonAppVersion = await this.appVersionRepository.findOne({
      where: { appId: body.appId, status: AppStatus.PENDING },
      order: { version: 'DESC' },
    });
    if (!mezonAppVersion) {
      throw new BadRequestException("No pending app version found");
    }

    if (body.isApproved) {
      await this.appVersionService.approveVersion(mezonAppVersion.id);
    } else {
      await this.appVersionService.rejectVersion(mezonAppVersion.id);
    }

    const data = await this.appReviewRepository.create({
      ...body,
      appVersionId: mezonAppVersion.id,
      reviewerId: reviewer.id,
    });
    return new Result({
      data: Mapper(AppReviewResponse, data),
    });
  }

  async updateAppReview(req: UpdateAppReviewRequest) {
    const review = await this.appReviewRepository.findById(req.id);
    if (!review) throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);

    await this.appReviewRepository.update(req.id, {
      remark: req.remark,
    });

    return new Result({
      message: SuccessMessages.UPDATE_SUCCESS,
    });
  }

  async deleteAppReview(req: RequestWithId) {
    const review = await this.appReviewRepository.findById(req.id);
    if (!review) throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);

    await this.appReviewRepository.softDelete(req.id);
    return new Result({
      message: SuccessMessages.DELETE_SUCCESS,
    });
  }

  async getAppReviews(query: GetAppReviewRequest) {
    let whereBuilder = {};

    if (query.appId) {
      const app = await this.appRepository.findById(query.appId);
      if (!app) {
        throw new BadRequestException(ErrorMessages.INVALID_APP);
      }

      whereBuilder = {
        appId: query.appId,
      };
    }

    if (query.appVersionId) {
      const appVersion = await this.appVersionRepository.findById(query.appVersionId);
      if (!appVersion) {
        throw new BadRequestException(ErrorMessages.INVALID_APP);
      }

      whereBuilder = {
        appVersionId: query.appVersionId,
      };
    }

    return paginate<AppReviewHistory, AppReviewResponse>(
      () =>
        this.appReviewRepository.findMany({
          ...query,
          where: () => whereBuilder,
          relations: ["app", "reviewer", "appVersion"],
        }),
      query.pageSize,
      query.pageNumber,
      async (entity) => {
        const mappedReviewHistory = Mapper(AppReviewResponse, entity);
        return mappedReviewHistory;
      },
    );
  }

  async searchAppReviews(query: SearchAppReviewRequest) {
    const qb = this.appReviewRepository
      .getRepository()
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.app', 'app')
      .leftJoinAndSelect('review.reviewer', 'reviewer')
      .leftJoinAndSelect('review.appVersion', 'appVersion');
  
    if (query.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('app.name ILIKE :keyword', { keyword: `%${query.search}%` })
            .orWhere('reviewer.name ILIKE :keyword', { keyword: `%${query.search}%` })
            .orWhere('review.remark ILIKE :keyword', { keyword: `%${query.search}%` });
        }),
      );
    }
  
    if (query.appId) {
      qb.andWhere('review.appId = :appId', { appId: query.appId });
    }
    if (query.appVersionId) {
      qb.andWhere('review.appVersionId = :appVersionId', { appVersionId: query.appVersionId });
    }
    const invalidSortField = Object.values(SortField).includes(query.sortField as SortField);
    const invalidSortOrder = Object.values(SortOrder).includes(query.sortOrder as SortOrder);
    const sortField = invalidSortField ? query.sortField : SortField.NAME;
    const sortOrder = invalidSortOrder ? query.sortOrder : SortOrder.DESC;

    qb.orderBy(`review.${sortField}`, sortOrder);
    

    return paginate<AppReviewHistory, AppReviewResponse>(
      () =>
        qb
          .skip((query.pageNumber - 1) * query.pageSize)
          .take(query.pageSize)
          .getManyAndCount(),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(AppReviewResponse, entity),
    );
  }
  
}
