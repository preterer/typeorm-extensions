import { SelectQueryBuilder } from "typeorm";

import { CoreEntity } from "../entities/core.entity";

/**
 * Extended query builder
 *
 * @export
 * @class QueryBuilder
 * @extends {SelectQueryBuilder<Entity>}
 * @template Entity
 */
export class QueryBuilder<Entity extends CoreEntity> extends SelectQueryBuilder<Entity> {
  /**
   * Adds a where LIKE clause
   *
   * @param {string} field
   * @param {string} value
   * @returns {QueryBuilder<Entity>}
   * @memberof QueryBuilder
   */
  andLike(field: string, value: string): QueryBuilder<Entity> {
    return this.andWhere(`${field} LIKE :like${field}`, { [`like${field}`]: value });
  }

  /**
   * Adds a where equals clause
   *
   * @param {string} field
   * @param {string} value
   * @returns {QueryBuilder<Entity>}
   * @memberof QueryBuilder
   */
  andEqual(field: string, value: any): QueryBuilder<Entity> {
    return this.andWhere(`${field} = :equal${field}`, { [`equal${field}`]: value });
  }

  constructor(queryBuilder: SelectQueryBuilder<Entity>) {
    super(queryBuilder);
  }
}
