
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import * as sanitizeHtml from "sanitize-html";
import { Brackets, EntityManager, In, Not, ObjectLiteral } from "typeorm";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Result } from "@domain/common/dtos/result.dto";
import { AppStatus } from "@domain/common/enum/appStatus";
import { Role } from "@domain/common/enum/role";
import { SortField } from '@domain/common/enum/sortField';
import { SortOrder } from '@domain/common/enum/sortOder';
import { App, AppVersion, Link, LinkType, Tag, User } from "@domain/entities";

import { AppVersionService } from "@features/app-version/app-version.service";

import { ErrorMessages } from "@libs/constant/messages";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Mapper } from "@libs/utils/mapper";
import { paginate } from "@libs/utils/paginate";
import { filterBuilder, searchBuilder } from "@libs/utils/queryBuilder";

import {
  CreateMezonAppRequest,
  SearchMezonAppRequest,
  UpdateMezonAppRequest,
} from "./dtos/request";
import {
  GetMezonAppDetailsResponse,
  GetRelatedMezonAppResponse,
  SearchMezonAppResponse,
} from "./dtos/response";
import { MezonAppType } from "@domain/common/enum/mezonAppType";



@Injectable()
export class MezonAppService {
  private readonly appRepository: GenericRepository<App>;
  private readonly appVersionRepository: GenericRepository<AppVersion>;
  private readonly userRepository: GenericRepository<User>;
  private readonly tagRepository: GenericRepository<Tag>;
  private readonly linkRepository: GenericRepository<Link>;
  private readonly linkTypeRepository: GenericRepository<LinkType>;

  constructor(
    private manager: EntityManager,
    private appVersionService: AppVersionService,
  ) {
    this.appRepository = new GenericRepository(App, manager);
    this.appVersionRepository = new GenericRepository(AppVersion, manager);
    this.userRepository = new GenericRepository(User, manager);
    this.tagRepository = new GenericRepository(Tag, manager);
    this.linkRepository = new GenericRepository(Link, manager);
    this.linkTypeRepository = new GenericRepository(LinkType, manager);
  }

  /**
   *  Calculate the average rating and round to the nearest 0.5 increment
   */
  private getAverageRating(mezonApp: App): number {
    if (!mezonApp.ratings.length) return 0;

    const totalScore = mezonApp.ratings.reduce(
      (sum, rating) => sum + rating.score,
      0,
    );
    const averageScore = totalScore / mezonApp.ratings.length;

    return Math.round(averageScore * 2) / 2;
  }

  async getMezonAppDetail(query: RequestWithId) {
    const mezonApp = await this.appRepository.findById(query.id, [
      "tags",
      "socialLinks",
      "socialLinks.type",
      "ratings",
      "versions",
      "versions.tags",
      "versions.socialLinks",
      "versions.socialLinks.type",
    ]);

    if (!mezonApp) {
      throw new NotFoundException("App not found");
    }


    const owner = await this.userRepository.findById(mezonApp.ownerId);

    const detail = Mapper(GetMezonAppDetailsResponse, mezonApp);

    detail.rateScore = this.getAverageRating(mezonApp);
    detail.owner = {
      id: owner.id,
      name: owner.name,
      profileImage: owner.profileImage,
    };
    detail.tags = mezonApp.tags.map((tag) => ({ id: tag.id, name: tag.name }));
    detail.socialLinks = mezonApp.socialLinks
      .filter((link) => !!link)
      .map((link) => ({
        id: link.id,
        url: link.url,
        linkTypeId: link.type?.id || null,
        type: link.type
          ? {
              id: link.type.id,
              name: link.type.name,
              icon: link.type.icon,
              prefixUrl: link.type.prefixUrl,
            }
          : null,
      }));
    detail.versions = mezonApp.versions.sort((a, b) => b.version - a.version)

    return new Result({
      data: detail,
    });
  }

  async getRelatedMezonApp(query: RequestWithId) {
    const mezonApp = await this.appRepository.findById(query.id, ["tags"]);

    if (!mezonApp || mezonApp.status !== AppStatus.PUBLISHED) {
      return new Result({ data: [] });
    }

    const tagIds = mezonApp.tags.map((tag) => tag.id);
    if (tagIds.length === 0) return new Result({ data: [] });

    const relatedMezonApps = await this.appRepository.getRepository().find({
      where: {
        tags: { id: In(tagIds) },
        id: Not(query.id),
        status: AppStatus.PUBLISHED,
      },
      withDeleted: false,
      relations: ["tags", "ratings"],
      take: 5,
    });

    const res = relatedMezonApps.map((mezonApp) => {
      const mappedMezonApp = Mapper(GetRelatedMezonAppResponse, mezonApp);
      mappedMezonApp.rateScore = this.getAverageRating(mezonApp);
      return mappedMezonApp;
    });

    return new Result({ data: res });
  }

  private async buildSearchQuery(
    query: SearchMezonAppRequest,
    initialWhereCondition?: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
    ititialWhereParams?: ObjectLiteral,
  ) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const take = query.pageSize;

    const whereCondition = this.appRepository
      .getRepository()
      .createQueryBuilder("app")
      .select("app.id")
      .skip(skip)
      .take(take);

    if (initialWhereCondition) {
      whereCondition.where(initialWhereCondition, ititialWhereParams);
    }

    // Priorize to search by keyword if field and search exist at the same time.
    if (query.search)
      whereCondition.andWhere(
        new Brackets((qb) => {
          qb.where("app.name ILIKE :keyword", {
            keyword: `%${query.search}%`,
          }).orWhere("app.headline ILIKE :keyword", {
            keyword: `%${query.search}%`,
          });
        }),
      );

    if (query.tags?.length) {
      whereCondition.andWhere(
        `EXISTS (SELECT 1 FROM app_tags_tag tag WHERE tag."appId" = app.id AND tag."tagId" IN (:...tagIds))`,
        { tagIds: query.tags },
      );
    }

    if (query?.ownerId) {
      whereCondition.andWhere("app.ownerId = :ownerId", {
        ownerId: query.ownerId,
      });
    }

    if (query?.type) {
      whereCondition.andWhere("app.type = :type", {
        type: query.type,
      });
    }

    if(query?.hasNewUpdate !== undefined){
      whereCondition.andWhere("app.hasNewUpdate = :hasNewUpdate", {
        hasNewUpdate: query.hasNewUpdate,
      });
    }

    const invalidSortField = Object.values(SortField).includes(query.sortField as SortField);
    const invalidSortOrder = Object.values(SortOrder).includes(query.sortOrder as SortOrder);
    const sortField = invalidSortField ? query.sortField : SortField.NAME;
    const sortOrder = invalidSortOrder ? query.sortOrder : SortOrder.DESC;

    if (query.sortField === SortField.NAME) {
      whereCondition
        .addSelect('LOWER(app.name)', 'app_name_lower')
        .orderBy('app_name_lower', sortOrder);
    } else whereCondition.orderBy(`app.${sortField}`, sortOrder);

    const [appIds, total] = await whereCondition.getManyAndCount();
    const ids = appIds.map(a => a.id);

    const apps = this.appRepository
      .getRepository()
      .createQueryBuilder("app")
      .leftJoinAndSelect("app.tags", "filterTag")
      .leftJoinAndSelect("app.ratings", "rating")
      .leftJoinAndSelect("app.socialLinks", "socialLink")
      .leftJoinAndSelect("app.owner", "owner")
      .leftJoinAndSelect("app.versions", "version")
      .leftJoinAndSelect("version.tags", "versionTag")
      .leftJoinAndSelect("version.socialLinks", "versionSocialLink")
      .leftJoinAndSelect("versionSocialLink.type", "versionLinkType")
      .where("app.id IN (:...ids)", { ids: ids.length ? ids : ["00000000-0000-0000-0000-000000000000"] });

    if (query.sortField === SortField.NAME) {
      apps
        .addSelect('LOWER(app.name)', 'app_name_lower')
        .orderBy('app_name_lower', sortOrder);
    } else apps.orderBy(`app.${sortField}`, sortOrder);
    apps.addOrderBy("version.version", "DESC");

    return { apps, total };
  }

  async searchMezonApp(query: SearchMezonAppRequest) {
    const { apps, total } = await this.buildSearchQuery(query, "app.status = :status", { status: AppStatus.PUBLISHED });
    const data = await apps.getMany();
    return paginate<App, SearchMezonAppResponse>(
      [data, total],
      query.pageSize,
      query.pageNumber,
      (entity) => {
        const mappedMezonApp = Mapper(SearchMezonAppResponse, entity);
        mappedMezonApp.rateScore = this.getAverageRating(entity);
        mappedMezonApp.tags = entity.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
        return mappedMezonApp;
      },
    );
  }

  async deleteMezonApp(userDeleting: User, req: RequestWithId) {
    const app = await this.appRepository.findById(req.id, ["tags", "socialLinks"]);
    if (!app) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);
    }

    if (app.ownerId !== userDeleting.id && userDeleting.role !== Role.ADMIN) {
      throw new BadRequestException(ErrorMessages.PERMISSION_DENIED);
    }

    // Soft delete the app
    await this.appRepository.softDelete(req.id);
    return new Result({});
  }

  async createMezonApp(ownerId: string, req: CreateMezonAppRequest) {
    const { tagIds, socialLinks, ...appData } = req;

    // Fetch existing tags
    const existingTags = tagIds?.length
      ? await this.tagRepository.getRepository().findBy({ id: In(tagIds) })
      : [];
    const missingTagIds =
      tagIds?.filter((id) => !existingTags.some((tag) => tag.id === id)) || [];
    if (missingTagIds.length)
      throw new BadRequestException(ErrorMessages.INVALID_TAGS);

    let links: Link[] = [];
    if (socialLinks && socialLinks.length > 0) {
      links = await Promise.all(
        socialLinks.map(async (socialLink) => {
          // Check if linkType exist.
          const linkType = await this.linkTypeRepository.findById(
            socialLink.linkTypeId,
          );
          if (!linkType)
            throw new BadRequestException(ErrorMessages.INVALID_LINK_TYPE);

          let existingLink = await this.linkRepository.getRepository().findOne({
            where: {
              url: socialLink.url,
              linkTypeId: socialLink.linkTypeId,
              ownerId: ownerId,
            },
          });

          // If url is not exist, create a new one.
          if (!existingLink) {
            existingLink = await this.linkRepository.create({
              url: socialLink.url,
              type: linkType,
              ownerId: ownerId,
            });
          }

          return existingLink;
        }),
      );
    }

    const newApp = await this.appRepository.create({
      ...appData,
      ownerId: ownerId,
      tags: existingTags,
      socialLinks: links,
      hasNewUpdate: true,
    });
    if (newApp) await this.appVersionService.createVersion({
      appId: newApp.id,
      tagIds,
      socialLinks: links,
      ...appData,
    })
    return newApp
  }

  async updateMezonApp(userUpdating: User, req: UpdateMezonAppRequest) {
    const app = await this.appRepository.findById(req.id, [
      "tags",
      "socialLinks",
    ]);

    if (!app) {
      throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);
    }

    if (app.ownerId !== userUpdating.id && userUpdating.role !== Role.ADMIN) {
      throw new BadRequestException(ErrorMessages.PERMISSION_DENIED);
    }

    const { tagIds, socialLinks, description, id, ...updateData } = req;

    let tags = app.tags;
    let links = app.socialLinks;

    if (tagIds) {
      const existingTags = await this.tagRepository
        .getRepository()
        .findBy({ id: In(tagIds) });
      const missingTagIds = tagIds.filter(
        (id) => !existingTags.some((tag) => tag.id === id),
      );

      if (missingTagIds.length) {
        throw new BadRequestException(ErrorMessages.INVALID_TAGS);
      }

      tags = existingTags;
    }

    if (socialLinks) {
      const seen = new Set<string>()
      const filteredSocialLinks = socialLinks.filter((link) => {
        const key = `${link.linkTypeId}::${link.url}`;
        return seen.has(key) ? false : seen.add(key);
      });

      links = await Promise.all(
        filteredSocialLinks.map(async (socialLink) => {
          // Check if linkType exist.
          const linkType = await this.linkTypeRepository.findById(
            socialLink.linkTypeId,
          );
          if (!linkType)
            throw new BadRequestException(ErrorMessages.INVALID_LINK_TYPE);

          let existingLink = await this.linkRepository.getRepository().findOne({
            where: {
              url: socialLink.url,
              linkTypeId: socialLink.linkTypeId,
              ownerId: app.ownerId,
            },
          });
          // If url is not exist, create a new one.
          if (!existingLink) {
            existingLink = await this.linkRepository.create({
              url: socialLink.url,
              type: linkType,
              ownerId: app.ownerId,
            });
          }

          return existingLink;
        }),
      );
      app.socialLinks = links;
    }

    const cleanedDescription = sanitizeHtml(description, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "span", "img", "video", "source", "h1", "h2", "h3", "h4", "h5", "h6",
        "li", "ol", "ul", "p", "pre", "a", "em", "strong", "u"
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height', 'style'],
        video: ['src', 'controls', 'width', 'height'],
        source: ['src', 'type'],
        embed: ['src', 'width', 'height', 'allowfullscreen'],
        span: ['style', 'class'],
        p: ['style', 'class'],
        em: ['style', 'class'],
        strong: ['style', 'class'],
        u: ['style', 'class'],
      },
      allowedClasses: {
        '*': ['ql-size-small', 'ql-size-large', 'ql-size-huge',
          'ql-align-center', 'ql-align-right', 'ql-align-justify',
          'ql-font-monospace', 'ql-font-serif', 'fancy', 'simple']
      },
      allowedStyles: {
        '*': {
          'color': [/^.*$/],
          'background-color': [/^.*$/],
          'text-align': [/^.*$/],
          'font-size': [/^\d+(?:px|em|%)$/],
          'font-family': [/^.*$/],
        },
        img: {
          'width': [/^\d+(px|%)?$/],
          'height': [/^\d+(px|%)?$/],
        },
        em: {
          'color': [/^.*$/],
          'background-color': [/^.*$/],
          'font-size': [/^\d+(?:px|em|%)$/],
          'font-family': [/^.*$/],
        },
      }
    });


    const versionData = {
      appId: id,
      ...updateData,
      description: cleanedDescription,
      tagIds,
      socialLinks: links,
    };

    const existingPendingVersion = await this.appVersionRepository.findOne({
      where: { appId: id, status: AppStatus.PENDING },
    });

    if (existingPendingVersion) {
      Object.assign(existingPendingVersion, updateData);
      existingPendingVersion.tags = tags;
      existingPendingVersion.socialLinks = links;
      existingPendingVersion.description = cleanedDescription;

      await this.appVersionRepository.getRepository().save(existingPendingVersion);
      return app
    }

    const newVersion = await this.appVersionService.createVersion(versionData);

    if (newVersion) app.hasNewUpdate = true;

    if (app.status === AppStatus.REJECTED) {
      app.status = AppStatus.PENDING;
    }

    return this.appRepository.getRepository().save(app);
  }

  async listAdminMezonApp(query: SearchMezonAppRequest) {
    const { apps, total } = await this.buildSearchQuery(query);
    const data = await apps.getMany();
    return paginate<App, SearchMezonAppResponse>(
      [data, total],
      query.pageSize,
      query.pageNumber,
      (entity) => {
        const mappedMezonApp = Mapper(SearchMezonAppResponse, entity);
        mappedMezonApp.rateScore = this.getAverageRating(entity);
        mappedMezonApp.tags = entity.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
        mappedMezonApp.owner = entity.owner;
        mappedMezonApp.versions = entity.versions;
        return mappedMezonApp;
      },
    );
  }

  async getMyApp(userId: string, query: SearchMezonAppRequest) {
    const { apps, total } = await this.buildSearchQuery(query, "app.ownerId = :ownerId", {
      ownerId: userId,
    });
    const data = await apps.getMany();
    return paginate<App, SearchMezonAppResponse>(
      [data, total],
      query.pageSize,
      query.pageNumber,
      (entity) => {
        const mappedMezonApp = Mapper(SearchMezonAppResponse, entity);
        mappedMezonApp.rateScore = this.getAverageRating(entity);
        mappedMezonApp.tags = entity.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
        mappedMezonApp.versions = entity.versions;
        // TODO: fix with exposeUnsetFields later in class-transformer
        mappedMezonApp.owner = {
          id: entity.owner.id,
          name: entity.owner.name,
          profileImage: entity.owner.profileImage,
        }
        return mappedMezonApp;
      },
    );
  }
}
