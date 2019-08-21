import { CoreEntity } from "../entities/core.entity";
import { CoreRepository } from "../repositories/core.repository";
import { EntityList } from "../interfaces/entityList";
import { Errors } from "../enums/errors";
import { Filters } from "../interfaces/filters";

/**
 * Entity management abstract service
 *
 * @export
 * @abstract
 * @class EntityService
 * @template Entity
 */
export abstract class EntityService<Entity extends CoreEntity, Model = object> {
  /**
   * Entity repository
   *
   * @protected
   * @abstract
   * @type {CoreRepository<Entity>}
   * @memberof EntityService
   */
  protected abstract readonly repository: CoreRepository<Entity>;

  /**
   * Gets list of entities with total count
   *
   * @param {Filters} filters
   * @returns {Promise<EntityList<Entity>>}
   * @memberof EntityService
   */
  list(filters?: Filters): Promise<EntityList<Entity>> {
    return this.repository
      .filter(filters)
      .getManyAndCount()
      .then(result => ({ list: result[0], count: result[1] }));
  }

  /**
   * Gets entity by id
   *
   * @param {number} id
   * @returns {Promise<Entity>}
   * @memberof EntityService
   */
  get(id: number): Promise<Entity> {
    return this.repository.findOne(id).then(entity => {
      if (!entity) {
        throw new Error(Errors.ENTITY_NOT_FOUND);
      }
      return entity;
    });
  }

  /**
   * Adds an entity
   *
   * @param {object} model
   * @returns {Promise<Entity>}
   * @memberof EntityService
   */
  add(model: Model): Promise<Entity> {
    return this.prepareModel(model).then(entityLike => this.repository.save(entityLike as any));
  }

  /**
   * Updates an entity
   *
   * @param {number} id
   * @param {object} model
   * @returns {Promise<Entity>}
   * @memberof EntityService
   */
  update(id: number, model: Model): Promise<Entity> {
    return this.get(id)
      .then(() => this.prepareModel({ ...model, id }))
      .then(entityLike => this.repository.save(entityLike as any));
  }

  /**
   * Deletes an entity
   *
   * @param {number} id
   * @returns {Promise<number>}
   * @memberof EntityService
   */
  delete(id: number): Promise<number> {
    return this.get(id)
      .then(() => this.repository.delete(id))
      .then(() => id);
  }

  /**
   * Delets multiple entities
   *
   * @param {number[]} ids
   * @returns {Promise<void>}
   * @memberof EntityService
   */
  async deleteMultiple(ids: number[]): Promise<void> {
    this.repository.delete(ids);
  }

  /**
   * Splices entity from list
   *
   * @template Entity
   * @param {Entity[]} entities
   * @param {number} id
   * @memberof EntityService
   */
  spliceEntityOrThrow<Entity extends CoreEntity>(entities: Entity[], id: number): void {
    const index = this.findIndexOrThrow(entities, id);
    entities.splice(index, 1);
  }

  /**
   * Finds index of entity with given id
   *
   * @template Entity
   * @param {Entity[]} entities
   * @param {number} id
   * @returns
   * @memberof EntityService
   */
  findIndexOrThrow<Entity extends CoreEntity>(entities: Entity[], id: number): number {
    const index = entities.findIndex(entity => entity.id === id);
    if (index < 0) {
      throw new Error(Errors.ENTITY_NOT_FOUND);
    }
    return index;
  }

  /**
   * Prepares model to be saved
   *
   * @protected
   * @param {object} model
   * @returns {Promise<Entity>}
   * @memberof EntityService
   */
  protected prepareModel(model: Model): Promise<Entity> {
    return Promise.resolve(this.repository.create(model));
  }
}
