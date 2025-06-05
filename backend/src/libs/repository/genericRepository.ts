import { NotFoundException } from "@nestjs/common";

import {
    Repository,
    EntityTarget,
    EntityManager,
    ObjectLiteral,
    FindOptionsOrder,
    DeepPartial,
    FindOptionsWhere,
    FindOneOptions,
    FindManyOptions,
} from "typeorm";

import { SortOrder } from "@domain/common/enum/sortOder";

import { ErrorMessages } from "@libs/constant/messages";
import { SortField } from "@domain/common/enum/sortField";

export class GenericRepository<T extends ObjectLiteral> {
    private repository: Repository<T>;

    constructor(
        entity: EntityTarget<T>,
        private manager: EntityManager,
    ) {
        this.repository = this.manager.getRepository(entity);
    }

    public async findMany(req: {
        pageNumber: number;
        pageSize: number;
        sortField: string;
        sortOrder: string;
        where?: () => FindOptionsWhere<T> | FindOptionsWhere<T>[]; // Accepts single or multiple conditions
        relations?: string[]
    }): Promise<[T[], number]> {
        const {
            pageNumber,
            pageSize,
            sortField = SortField.NAME,
            sortOrder = SortOrder.ASC, 
            where,
            relations
        } = req;

        return await this.repository.findAndCount({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            where: where ? where() : {},
            withDeleted: false,
            order: { [sortField]: sortOrder } as FindOptionsOrder<T>,
            relations
        });
    }

    public async findById(id: string, relations?: string[]): Promise<T | null> {
        return await this.repository.findOne({
            where: { id } as any,
            withDeleted: false,
            relations
        });
    }

    public async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return await this.repository.findOne(options);
    }

    public async find(options: FindManyOptions<T>): Promise<T[]> {
        return await this.repository.find(options);
    }

    public async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return await this.repository.save(entity);
    }

    public async update(id: string, data: Partial<T>, msg: string = ErrorMessages.NOT_FOUND_MSG): Promise<void> {
        const entity = await this.findById(id);
        if (!entity)
            throw new NotFoundException(msg)
        await this.repository.update(id, data);
    }

    public async delete(id: string, msg: string = ErrorMessages.NOT_FOUND_MSG): Promise<void> {
        const entity = await this.findById(id);
        if (!entity)
            throw new NotFoundException(msg)
        await this.repository.delete(id);
    }

    public async softDelete(id: string, msg: string = ErrorMessages.NOT_FOUND_MSG): Promise<void> {
        const entity = await this.findById(id);
        if (!entity)
            throw new NotFoundException(msg)
        await this.repository.softDelete(id)
    }

    public getRepository(): Repository<T> {
        return this.repository; // Expose repository for custom queries
    }
}
