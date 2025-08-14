import { Injectable, BadRequestException } from "@nestjs/common";
import { EntityManager, Brackets } from "typeorm";
import { GenericRepository } from "@libs/repository/genericRepository";

import { Result } from "@domain/common/dtos/result.dto";
import { Mapper } from "@libs/utils/mapper";
import { paginate } from "@libs/utils/paginate";
import { ErrorMessages } from "@libs/constant/messages";
import {
  CreateNewsletterCampaignRequest,
  SearchNewsletterCampaignRequest,
  UpdateNewsletterCampaignRequest,
} from "./dtos/request";
import { NewsletterCampaign } from "@domain/entities/schema/newsletterCampaign.entity";
import { NewsletterCampaignResponse } from "./dtos/response";

@Injectable()
export class NewsletterCampaignService {
  private readonly campaignRepository: GenericRepository<NewsletterCampaign>;

  constructor(private readonly manager: EntityManager) {
    this.campaignRepository = new GenericRepository(
      NewsletterCampaign,
      manager,
    );
  }

  async create(body: CreateNewsletterCampaignRequest) {
    const created = await this.campaignRepository.create(body);
    return new Result({
      data: Mapper(NewsletterCampaignResponse, created),
      message: "Campaign created successfully",
    });
  }

  async update(id: string, body: UpdateNewsletterCampaignRequest) {
    await this.campaignRepository.update(id, body);
    const updated = await this.campaignRepository.findById(id);

    return new Result({
      data: Mapper(NewsletterCampaignResponse, updated),
      message: "Campaign updated successfully",
    });
  }

  async search(query: SearchNewsletterCampaignRequest) {
    const qb = this.campaignRepository
      .getRepository()
      .createQueryBuilder("campaign");

    if (query.search) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where("campaign.title ILIKE :keyword", {
              keyword: `%${query.search}%`,
            })
            .orWhere("campaign.headline ILIKE :keyword", {
              keyword: `%${query.search}%`,
            })
            .orWhere("campaign.description ILIKE :keyword", {
              keyword: `%${query.search}%`,
            });
        }),
      );
    }


    if (query.sortOrder === "ASC") {
      qb.orderBy("campaign.createdAt", "ASC");
    } else {
      qb.orderBy("campaign.createdAt", "DESC");
    }

    const result = await paginate<
      NewsletterCampaign,
      NewsletterCampaignResponse
    >(
      () => qb.getManyAndCount(),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(NewsletterCampaignResponse, entity),
    );

    if (!Array.isArray(result.data) || result.data.length === 0) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_CAMPAIGN);
    }

    return result;
  }

  async delete(id: string) {
    const existing = await this.campaignRepository.findById(id);
    if (!existing) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_CAMPAIGN);
    }
    await this.campaignRepository.softDelete(id);
    return new Result({
      message: "Campaign deleted successfully",
    });
  }
}
