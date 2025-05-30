import { BadRequestException, Injectable } from "@nestjs/common";

import { EntityManager, ILike } from "typeorm";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Result } from "@domain/common/dtos/result.dto";
import { LinkType } from "@domain/entities";

import { ErrorMessages } from "@libs/constant/messages";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Mapper } from "@libs/utils/mapper";

import { CreateLinkTypeRequest, UpdateLinkTypeRequest } from "./dtos/request";
import { LinkTypeResponse } from "./dtos/response";

@Injectable()
export class LinkTypeService {
  private readonly linkTypeRepository: GenericRepository<LinkType>;

  constructor(private manager: EntityManager) {
    this.linkTypeRepository = new GenericRepository(LinkType, manager);
  }

  async getAllSocialLinks() {
    const socialLinks = await this.linkTypeRepository.getRepository().find();

    return new Result({
      data: Mapper(LinkTypeResponse, socialLinks),
    });
  }

  async createLinkType(body: CreateLinkTypeRequest) {
    const linkTypes = await this.linkTypeRepository.getRepository().findOne({
      where: [
        { name: ILike(body.name.trim()) },
        { prefixUrl: ILike(body.prefixUrl) }
      ]
    });
    if (linkTypes)
      throw new BadRequestException(ErrorMessages.EXISTED_LINK_TYPE)
    const created = await this.linkTypeRepository.create(body);
    return new Result({ data: Mapper(LinkTypeResponse, created) });
  }

  async updateLinkType(body: UpdateLinkTypeRequest) {
    const linkTypes = await this.linkTypeRepository.getRepository().findOne({
      where: [
        { name: ILike(body.name.trim()) },
        { prefixUrl: ILike(body.prefixUrl) }
      ]
    });
    if (linkTypes && linkTypes.id !== body.id)
      throw new BadRequestException(ErrorMessages.EXISTED_LINK_TYPE)
    await this.linkTypeRepository.update(body.id, body);
    return new Result({data: Mapper(LinkTypeResponse, body)});
  }

  async deleteLinkType(body: RequestWithId) {
    const linkType = await this.linkTypeRepository.findOne({
      where: { id: body.id },
      relations: ['links'],
    })
    if (!linkType) {
      throw new BadRequestException('Link type not found')
    }
    await this.linkTypeRepository.softDelete(body.id)
    return new Result({ message: "Delete link type successfully" });
  }
}
