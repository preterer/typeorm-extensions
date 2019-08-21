import Container from "typedi";
import * as TypeORM from "typeorm";
import { Test } from "./testEntity";
import { TestService } from "./testService";

/**
 * Mocks in memory DB
 *
 * @export
 * @returns
 */
export function mockDB(): Promise<TypeORM.Connection> {
  TypeORM.useContainer(Container);
  return TypeORM.createConnection({
    type: "sqljs",
    entities: [Test],
    logger: "advanced-console",
    logging: ["error"],
    dropSchema: true,
    synchronize: true,
    cache: false
  });
}

/**
 * Mock some test data
 *
 * @export
 * @param {number} [amount=5]
 * @returns {Promise<number>}
 */
export async function mockData(amount: number): Promise<number> {
  const testService = Container.get(TestService);
  let id: number;
  for (let i = 1; i <= amount; i++) {
    id = await testService.add({ name: "Test " + i }).then(test => test.id);
  }
  return id;
}

/**
 * Clears mocked data
 *
 * @export
 * @returns {Promise<void>}
 */
export async function clearData(): Promise<void> {
  await TypeORM.getRepository(Test).clear();
}
