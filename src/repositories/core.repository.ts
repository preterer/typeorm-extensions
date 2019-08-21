import { Repository, QueryRunner } from "typeorm";

import { CoreEntity } from "../entities/core.entity";
import { Filters } from "../interfaces/filters";
import { QueryBuilder } from "../utils/queryBuilder";

/**
 * Core of a repository
 *
 * @export
 * @class CoreRepository
 * @extends {Repository<Entity>}
 * @template Entity
 */
export abstract class CoreRepository<Entity extends CoreEntity> extends Repository<Entity> {
  /**
   * Creates an extended QueryBuilder
   *
   * @param {string} [alias]
   * @param {QueryRunner} [queryRunner]
   * @returns {QueryBuilder<Entity>}
   * @memberof CoreRepository
   */
  createQueryBuilder(alias?: string, queryRunner?: QueryRunner): QueryBuilder<Entity> {
    return new QueryBuilder(super.createQueryBuilder(alias, queryRunner));
  }

  /**
   * Returns query builder with applied filters
   *
   * @param {Filters} [filters]
   * @returns {SelectQueryBuilder<Entity>}
   * @memberof CoreRepository
   */
  filter(filters: Filters = {}): QueryBuilder<Entity> {
    const orderField = filters.order ? `${this.metadata.tableName}.${filters.order}` : `${this.metadata.tableName}.id`;
    const query = this.createQueryBuilder(this.metadata.tableName)
      .skip(filters.start || 0)
      .orderBy({
        [orderField]: filters.desc ? "DESC" : "ASC"
      });
    if (!filters.limit || filters.limit > 0) {
      query.limit(filters.limit || 20);
    }
    return query;
  }
}
