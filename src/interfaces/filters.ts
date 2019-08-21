/**
 * Query filters
 *
 * @export
 * @interface Filters
 */
export interface Filters {
  /**
   * Filter text
   *
   * @type {string}
   * @memberof Filters
   */
  search?: string;

  /**
   * Order by colum name
   *
   * @type {string}
   * @memberof Filters
   */
  order?: string;

  /**
   * Should orded be descending (default false)
   *
   * @type {boolean}
   * @memberof Filters
   */
  desc?: boolean;

  /**
   * Limit of entities to get (-1 to get all)
   *
   * @type {number}
   * @memberof Filters
   */
  limit?: number;

  /**
   * First entitty to get
   *
   * @type {number}
   * @memberof Filters
   */
  start?: number;
}
