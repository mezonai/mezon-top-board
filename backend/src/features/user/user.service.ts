import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { EntityManager, IsNull, Not } from "typeorm";

import { RequestWithId } from "@domain/common/dtos/request.dto";
import { Result } from "@domain/common/dtos/result.dto";
import { App, Rating, User } from "@domain/entities";

import { ErrorMessages } from "@libs/constant/messages";
import { GenericRepository } from "@libs/repository/genericRepository";
import { Mapper } from "@libs/utils/mapper";
import { paginate } from "@libs/utils/paginate";
import { searchBuilder } from "@libs/utils/queryBuilder";

import {
  SearchUserRequest,
  SelfUpdateUserRequest,
  UpdateUserRequest,
} from "./dtos/request";
import { GetUserDetailsResponse, GetPublicProfileResponse, SearchUserResponse } from "./dtos/response";

@Injectable()
export class UserService {
  private readonly userRepository: GenericRepository<User>;
  private readonly appRepository: GenericRepository<App>;
  private readonly ratingRepository: GenericRepository<Rating>;

  constructor(private manager: EntityManager) {
    this.userRepository = new GenericRepository(User, manager);
    this.appRepository = new GenericRepository(App, manager);
    this.ratingRepository = new GenericRepository(Rating, manager);
  }

  async searchUser(query: SearchUserRequest) {
    let whereCondition = undefined;

    if (query.search)
      whereCondition = searchBuilder<User>({
        keyword: query.search,
        fields: ["name", "email"],
      });

    return paginate<User, SearchUserResponse>(
      () =>
        this.userRepository.findMany({
          ...query,
          where: () => whereCondition,
          withDeleted: true,
        }),
      query.pageSize,
      query.pageNumber,
      (entity) => Mapper(SearchUserResponse, entity),
    );
  }

  async getUserDetails(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);
    return new Result({ data: Mapper(GetUserDetailsResponse, user) });
  }

  async getPublicProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);
    return new Result({ data: Mapper(GetPublicProfileResponse, user) });
  }

  async deleteUser(req: RequestWithId) {
    await this.userRepository.softDelete(req.id);
    return new Result();
  }

  async deactivateUser(req: RequestWithId, userId: string) {
    if (req.id === userId) {
      throw new BadRequestException("You cannot deactivate your own account");
    }

    const user = await this.userRepository.findOne({
      where: { id: req.id },
      relations: ["apps", "ratings"],
    });

    if (!user) throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);

    await this.userRepository.update(req.id, { deactive: true });

    await this.userRepository.getRepository().softRemove(user);

    return new Result();
  }

  async activateUser(req: RequestWithId) {
    const user = await this.userRepository.findOne({
      where: { id: req.id, deletedAt: Not(IsNull()) },
      relations: ['apps', 'ratings'],
      withDeleted: true,
    });

    if (!user) throw new BadRequestException(ErrorMessages.NOT_FOUND_MSG);

    await this.userRepository.getRepository().restore(req.id);

    for (const app of user.apps) {
      if (app.deletedAt) {
        await this.appRepository.getRepository().restore(app.id);
      }
    }

    for (const rating of user.ratings) {
      if (rating.deletedAt) {
        await this.ratingRepository.getRepository().restore(rating.id);
      }
    }

    await this.userRepository.update(req.id, { deactive: false });

    return new Result();
  }

  async updateUser(req: UpdateUserRequest) {
    await this.userRepository.update(req.id, {
      name: req.name,
      bio: req.bio,
      role: req.role,
    });
    return new Result();
  }

  async seflUpdateUser(userId: string, req: SelfUpdateUserRequest) {
    await this.userRepository.update(userId, {
      name: req.name,
      bio: req.bio,
      profileImage: req.profileImage,
    });
    return new Result();
  }

  async markWillSyncFromMezon(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException(ErrorMessages.NOT_FOUND_MSG);

    await this.userRepository.update(userId, {
      willSyncFromMezon: true,
    });

    return new Result();
  }
}
