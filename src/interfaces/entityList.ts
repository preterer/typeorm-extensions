/**
 * Service list result
 *
 * @export
 * @interface EntityList
 * @template Entity
 */
export interface EntityList<Entity> {
  /**
   * List of selected entities
   *
   * @type {Entity[]}
   * @memberof EntityList
   */
  list: Entity[];

  /**
   * Total count
   *
   * @type {number}
   * @memberof EntityList
   */
  count: number;
}
