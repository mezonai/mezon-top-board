import { BadRequestException, Injectable } from "@nestjs/common";

import { EntityManager, ILike, Not } from "typeorm";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Result } from "@domain/common/dtos/result.dto";
import { Tag } from "@domain/entities";

import { ErrorMessages } from "@libs/constant/messages";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Mapper } from "@libs/utils/mapper";
import { paginate } from "@libs/utils/paginate";
import { searchBuilder } from "@libs/utils/queryBuilder";

import { CreateTagRequest, SearchTagRequest, UpdateTagRequest } from "./dtos/request";
import { TagResponse } from "./dtos/response";

@Injectable()
export class TagService {
  private readonly tagRepository: GenericRepository<Tag>;

  constructor(private manager: EntityManager) {
    this.tagRepository = new GenericRepository(Tag, manager);
  }

  async getTagAll() {
    const tags = await this.tagRepository.getRepository().find({
      relations: ['apps'],
    });

    return new Result({
      data: tags.map(tag => {
        return Mapper(TagResponse, {
          ...tag,
          botCount: tag.apps?.length || 0,
        });
      }),
    });
  }

  async searchTag(query: SearchTagRequest) {
    let whereCondition = undefined;

    if (query.search)
      whereCondition = searchBuilder<Tag>({
        keyword: query.search,
        fields: ["name", "slug"],
      });

    return paginate<Tag, TagResponse>(
      () =>
        this.tagRepository.findMany({
          ...query,
          where: () => whereCondition,
          relations: ['apps'],
        }),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(TagResponse, {...entity, botCount: entity.apps?.length || 0}),
    );
  }

  async createTag(body: CreateTagRequest) {
    const tag = await this.tagRepository.getRepository().findOne({
      where: [
        { name: ILike(body.name.trim()) },
        { slug: ILike(body.slug) }
      ]
    });
    if (tag)
      throw new BadRequestException(ErrorMessages.EXISTED_TAG)
    
    const createdTag = await this.tagRepository.create({ name: body.name.trim(), slug: body.slug })
    const fullTag = await this.tagRepository.findOne({
      where: { id: createdTag.id },
      relations: ['apps']
    });
    return new Result({
      data: Mapper(TagResponse, {
        ...fullTag,
        botCount: fullTag?.apps?.length || 0
      })
    })
  }
 
  async updateTag(body: UpdateTagRequest) {
    const tag = await this.tagRepository.getRepository().findOne({
      where: [
        { name: ILike(body.name), id: Not(body.id) },
        { slug: ILike(body.slug), id: Not(body.id) }
      ]
    });
    if (tag)
      throw new BadRequestException(ErrorMessages.EXISTED_TAG)

    await this.tagRepository.update(body.id, { name: body.name.trim(), slug: body.slug })
    const updatedTag = await this.tagRepository.findOne({ where: { id: body.id } })
    return new Result({ data: updatedTag })
  }

  async deleteTag(body: RequestWithId) {
    const tag = await this.tagRepository.findOne({
      where: { id: body.id },
      relations: ['apps']
    })

    if (!tag) {
      throw new BadRequestException('Tag not found')
    }

    if (tag.apps && tag.apps.length > 0) {
      throw new BadRequestException('Cannot delete tag because it is associated with one or more bots.')
    }
    await this.tagRepository.softDelete(body.id)
    return new Result()
  }
}
