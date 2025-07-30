import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  UpdateResult,
  DeleteResult,
  SaveOptions,
  RemoveOptions,
  ObjectLiteral,
  SelectQueryBuilder,
  QueryRunner,
  FindOptionsRelations,
  EntityMetadata
} from 'typeorm'

export interface IPaginationOptions {
  page: number
  limit: number
}

export interface PaginationMeta {
  totalItems: number
  itemCount: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
  from: number
  to: number
  nextPage: boolean
  previousPage: boolean
}

export interface IPaginationResult<T> {
  items: T[]
  meta: PaginationMeta
}

export interface IQueryOptions<T> extends Omit<FindManyOptions<T>, 'skip' | 'take'> {
  page?: number
  limit?: number
  search?: string
  sortBy?: keyof T
  orderBy?: 'ASC' | 'DESC'
}

export interface IBaseRepository<T extends ObjectLiteral> {
  /**
   * Creates a new entity instance from the provided data.
   * @param {DeepPartial<T>} entityData - Partial entity data.
   * @returns {T} The new entity instance.
   * @example
   * const user = repo.create({ name: 'Alice' })
   */
  create(entityData: DeepPartial<T>): T

  /**
   * Saves (inserts or updates) an entity.
   * @param {T} entity - The entity to save.
   * @param {SaveOptions} [options] - Optional save options.
   * @returns {Promise<T>} The saved entity.
   * @example
   * const saved = await repo.save(user)
   */
  save(entity: T, options?: SaveOptions): Promise<T>

  /**
   * Saves multiple entities at once.
   * @param {T[]} entities - Array of entities.
   * @param {SaveOptions} [options] - Optional save options.
   * @returns {Promise<T[]>} The saved entities.
   * @example
   * const saved = await repo.saveMany([user1, user2])
   */
  saveMany(entities: T[], options?: SaveOptions): Promise<T[]>

  /**
   * Finds an entity by its primary key.
   * @param {string|number} id - The entity's primary key.
   * @returns {Promise<T|null>} The found entity or null.
   * @example
   * const user = await repo.findById(1)
   */
  findById(id: string | number): Promise<T | null>

  /**
   * Finds a single entity matching the given options.
   * @param {FindOneOptions<T>} options - Find options.
   * @returns {Promise<T|null>} The found entity or null.
   * @example
   * const user = await repo.findOne({ where: { email: 'a@b.com' } })
   */
  findOne(options: FindOneOptions<T>): Promise<T | null>

  /**
   * Finds all entities matching the options.
   * @param {FindManyOptions<T>} [options] - Find options.
   * @returns {Promise<T[]>} Array of entities.
   * @example
   * const users = await repo.findAll({ order: { createdAt: 'DESC' } })
   */
  findAll(options?: FindManyOptions<T>): Promise<T[]>

  /**
   * Finds entities matching the given where condition(s).
   * @param {FindOptionsWhere<T>|FindOptionsWhere<T>[]} where - Where condition(s).
   * @returns {Promise<T[]>} Array of entities.
   * @example
   * const users = await repo.findBy({ isActive: true })
   */
  findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]>

  /**
   * Finds a single entity matching the where condition.
   * @param {FindOptionsWhere<T>} where - Where condition.
   * @returns {Promise<T|null>} The found entity or null.
   * @example
   * const user = await repo.findOneBy({ username: 'alice' })
   */
  findOneBy(where: FindOptionsWhere<T>): Promise<T | null>

  /**
   * Finds entities with pagination support.
   * @param {IQueryOptions<T>} options - Query and pagination options.
   * @returns {Promise<IPaginationResult<T>>} Paginated result.
   * @example
   * const result = await repo.paginate({ page: 2, limit: 10 })
   */
  paginate(options: IQueryOptions<T>): Promise<IPaginationResult<T>>

  /**
   * Counts entities matching the options.
   * @param {FindManyOptions<T>} [options] - Find options.
   * @returns {Promise<number>} The count.
   * @example
   * const count = await repo.count({ where: { isActive: true } })
   */
  count(options?: FindManyOptions<T>): Promise<number>

  /**
   * Counts entities matching the where condition(s).
   * @param {FindOptionsWhere<T>|FindOptionsWhere<T>[]} where - Where condition(s).
   * @returns {Promise<number>} The count.
   * @example
   * const count = await repo.countBy({ role: 'admin' })
   */
  countBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<number>

  /**
   * Updates entities matching the criteria.
   * @param {string|number|FindOptionsWhere<T>} criteria - Criteria to match.
   * @param {DeepPartial<T>} partialEntity - Partial entity data.
   * @returns {Promise<UpdateResult>} Update result.
   * @example
   * await repo.update(1, { isActive: false })
   */
  update(
    criteria: string | number | FindOptionsWhere<T>,
    partialEntity: DeepPartial<T>
  ): Promise<UpdateResult>

  /**
   * Updates multiple entities matching the criteria.
   * @param {FindOptionsWhere<T>|FindOptionsWhere<T>[]} criteria - Criteria to match.
   * @param {DeepPartial<T>} partialEntity - Partial entity data.
   * @returns {Promise<UpdateResult>} Update result.
   * @example
   * await repo.updateMany([{ role: 'user' }], { isActive: false })
   */
  updateMany(
    criteria: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    partialEntity: DeepPartial<T>
  ): Promise<UpdateResult>

  /**
   * Deletes entities matching the criteria.
   * @param {string|number|FindOptionsWhere<T>} criteria - Criteria to match.
   * @returns {Promise<DeleteResult>} Delete result.
   * @example
   * await repo.delete(1)
   */
  delete(criteria: string | number | FindOptionsWhere<T>): Promise<DeleteResult>

  /**
   * Deletes multiple entities.
   * @param {FindOptionsWhere<T>|FindOptionsWhere<T>[]} criteria - Criteria to match.
   * @returns {Promise<DeleteResult>} Delete result.
   * @example
   * await repo.deleteMany([{ isActive: false }])
   */
  deleteMany(criteria: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<DeleteResult>

  /**
   * Soft-deletes entities (sets a deleted flag/date).
   * @param {string|number|FindOptionsWhere<T>} criteria - Criteria to match.
   * @returns {Promise<UpdateResult>} Update result.
   * @example
   * await repo.softDelete(1)
   */
  softDelete(criteria: string | number | FindOptionsWhere<T>): Promise<UpdateResult>

  /**
   * Restores soft-deleted entities.
   * @param {string|number|FindOptionsWhere<T>} criteria - Criteria to match.
   * @returns {Promise<UpdateResult>} Update result.
   * @example
   * await repo.restore(1)
   */
  restore(criteria: string | number | FindOptionsWhere<T>): Promise<UpdateResult>

  /**
   * Removes a single entity instance.
   * @param {T} entity - Entity to remove.
   * @param {RemoveOptions} [options] - Remove options.
   * @returns {Promise<T>} Removed entity.
   * @example
   * await repo.remove(user)
   */
  remove(entity: T, options?: RemoveOptions): Promise<T>

  /**
   * Removes multiple entity instances.
   * @param {T[]} entities - Entities to remove.
   * @param {RemoveOptions} [options] - Remove options.
   * @returns {Promise<T[]>} Removed entities.
   * @example
   * await repo.removeMany([user1, user2])
   */
  removeMany(entities: T[], options?: RemoveOptions): Promise<T[]>

  /**
   * Checks if any entity exists matching the options.
   * @param {FindOneOptions<T>} options - Find options.
   * @returns {Promise<boolean>} True if exists.
   * @example
   * const exists = await repo.exists({ where: { email: 'a@b.com' } })
   */
  exists(options: FindOneOptions<T>): Promise<boolean>

  /**
   * Checks if any entity exists matching the where condition.
   * @param {FindOptionsWhere<T>} where - Where condition.
   * @returns {Promise<boolean>} True if exists.
   * @example
   * const exists = await repo.existsBy({ username: 'alice' })
   */
  existsBy(where: FindOptionsWhere<T>): Promise<boolean>

  /**
   * Returns a TypeORM query builder for advanced queries.
   * @param {string} [alias] - Table alias.
   * @returns {SelectQueryBuilder<T>} Query builder.
   * @example
   * const qb = repo.createQueryBuilder('user')
   */
  createQueryBuilder(alias?: string): SelectQueryBuilder<T>

  /**
   * Inserts or updates entities based on conflict paths.
   * @param {DeepPartial<T>|DeepPartial<T>[]} entityOrEntities - Entity/entities to upsert.
   * @param {string[]|Object} conflictPathsOrOptions - Conflict paths or options.
   * @returns {Promise<UpdateResult>} Upsert result.
   * @example
   * await repo.upsert({ email: 'a@b.com', name: 'Alice' }, ['email'])
   */
  upsert(
    entityOrEntities: DeepPartial<T> | DeepPartial<T>[],
    conflictPathsOrOptions:
      | string[]
      | {
          conflictPaths: string[]
          skipUpdateIfNoValuesChanged?: boolean
        }
  ): Promise<UpdateResult>

  /**
   * Returns a repository instance bound to the given transaction.
   * @param {QueryRunner} queryRunner - Query runner.
   * @returns {IBaseRepository<T>} Transactional repository.
   * @example
   * const txRepo = repo.withTransaction(queryRunner)
   */
  withTransaction(queryRunner: QueryRunner): IBaseRepository<T>

  /**
   * Finds entities with specified relations loaded.
   * @param {FindOptionsRelations<T>} relations - Relations to load.
   * @param {FindOptionsWhere<T>} [where] - Where condition.
   * @returns {Promise<T[]>} Entities with relations.
   * @example
   * const users = await repo.findWithRelations(['profile'], { isActive: true })
   */
  findWithRelations(relations: FindOptionsRelations<T>, where?: FindOptionsWhere<T>): Promise<T[]>

  /**
   * Finds a single entity with specified relations loaded.
   * @param {FindOptionsRelations<T>} relations - Relations to load.
   * @param {FindOptionsWhere<T>} [where] - Where condition.
   * @returns {Promise<T|null>} Entity with relations or null.
   * @example
   * const user = await repo.findOneWithRelations(['profile'], { id: 1 })
   */
  findOneWithRelations(
    relations: FindOptionsRelations<T>,
    where?: FindOptionsWhere<T>
  ): Promise<T | null>

  /**
   * Returns the sum of a column.
   * @param {keyof T} columnName - Column to sum.
   * @param {FindOptionsWhere<T>} [where] - Where condition.
   * @returns {Promise<number>} Sum value.
   * @example
   * const total = await repo.sum('balance', { isActive: true })
   */
  sum(columnName: keyof T, where?: FindOptionsWhere<T>): Promise<number>

  /**
   * Returns the average of a column.
   * @param {keyof T} columnName - Column to average.
   * @param {FindOptionsWhere<T>} [where] - Where condition.
   * @returns {Promise<number>} Average value.
   * @example
   * const avg = await repo.average('age')
   */
  average(columnName: keyof T, where?: FindOptionsWhere<T>): Promise<number>

  /**
   * Returns the minimum value of a column.
   * @param {keyof T} columnName - Column to check.
   * @param {FindOptionsWhere<T>} [where] - Where condition.
   * @returns {Promise<number>} Minimum value.
   * @example
   * const min = await repo.minimum('score')
   */
  minimum(columnName: keyof T, where?: FindOptionsWhere<T>): Promise<number>

  /**
   * Returns the maximum value of a column.
   * @param {keyof T} columnName - Column to check.
   * @param {FindOptionsWhere<T>} [where] - Where condition.
   * @returns {Promise<number>} Maximum value.
   * @example
   * const max = await repo.maximum('score')
   */
  maximum(columnName: keyof T, where?: FindOptionsWhere<T>): Promise<number>

  /**
   * Executes a raw SQL query.
   * @template R
   * @param {string} sql - SQL query string.
   * @param {ObjectLiteral[]} [parameters] - Query parameters.
   * @returns {Promise<R>} Query result.
   * @example
   * const rows = await repo.query('SELECT * FROM users WHERE isActive = ?', [true])
   */
  query<R = T[]>(sql: string, parameters?: ObjectLiteral[]): Promise<R>

  /**
   * Returns the underlying TypeORM repository instance.
   * Useful when you need to perform advanced operations directly with TypeORM.
   *
   * @returns {Repository<T>} The TypeORM repository for the entity.
   * @example
   * const userRepo = userService.getRepository();
   * const users = await userRepo.find();
   */
  getRepository(): Repository<T>

  /**
   * Returns the entity metadata, which includes information such as
   * entity name, columns, relations, table name, and more.
   * Useful for building dynamic queries or reflecting schema info.
   *
   * @returns {EntityMetadata} The metadata information for the entity.
   * @example
   * const columns = repo.getEntityMetaData().columns;
   */
  getEntityMetaData(): EntityMetadata
}
