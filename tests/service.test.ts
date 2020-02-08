import { Container } from "typedi";

import { mockDB, mockData, clearData } from "./testUtils";
import { Test } from "./testEntity";
import { TestService } from "./testService";

describe("Entity service", function() {
  const amounts = 10;
  let testService: TestService, testId: number;

  beforeAll(async function() {
    await mockDB();
    testService = Container.get(TestService);
  });

  beforeEach(async function() {
    testId = await mockData(amounts);
  });

  afterEach(async function() {
    await clearData();
  });

  describe("get", function() {
    it("should get an entity", async function() {
      const entity = await testService.get(testId);
      expect(entity).not.toBeUndefined();
      expect(entity instanceof Test).toBeTruthy();
    });

    it("should not get a non existing entity", async function() {
      await expect(testService.get(testId + 1)).rejects.toThrow();
    });
  });

  describe("list", function() {
    it("should find all entities", async function() {
      const results = await testService.list({ limit: -1 });
      expect(results.list.length).toEqual(amounts);
      expect(results.count).toEqual(amounts);
    });

    it("should find entities with default filters", async function() {
      const results = await testService.list();
      expect(results.list.length).toBeGreaterThan(0);
      expect(results.count).toEqual(amounts);
    });

    it("should order descending by id", async function() {
      const results = await testService.list({ order: "id", desc: true });
      expect(results.list.length).toEqual(amounts);
      expect(
        results.list.every((test, index) => {
          const previous = results.list[index - 1];
          return !previous || previous.id > test.id;
        })
      ).toBeTruthy();
    });
  });

  describe("count", function() {
    it("should get entites count", async function() {
      const count = await testService.count();
      expect(count).toEqual(amounts);
    });

    it("should get entities count with filters", async function() {
      const count = await testService.count({ search: "whatever, it's not important anyway" });
      expect(count).toEqual(amounts);
    });
  });

  describe("add", function() {
    it("should add a new entity", async function() {
      const entity = await testService.add({ name: "test" });
      expect(entity).not.toBeUndefined();
      expect(await testService.get(entity.id)).not.toBeUndefined();
    });
  });

  describe("update", function() {
    it("should update entity", async function() {
      const name = "test12345";
      await testService.update(testId, { name });
      const entity = await testService.get(testId);
      expect(entity.name).toBe(name);
    });

    it("should not update a non existing entity", async function() {
      const name = "test12345";
      await expect(testService.update(testId + 1, { name })).rejects.toThrow();
    });
  });

  describe("delete", function() {
    it("should delete an entity", async function() {
      await testService.delete(testId);
      await expect(testService.get(testId)).rejects.toThrow();
    });

    it("should not delete a non existing entity", async function() {
      await expect(testService.delete(testId + 1)).rejects.toThrow();
    });
  });

  describe("nameLike", function() {
    it("should return matching entities", async function() {
      const results = await testService.nameLike("%Test%");
      expect(results.length).toBe(amounts);
    });

    it("should return no matching entities", async function() {
      const results = await testService.nameLike("%90aseiaoejoaise%");
      expect(results.length).toBe(0);
    });
  });

  describe("nameEqual", function() {
    it("should return matching entities", async function() {
      const results = await testService.nameEqual("Test 1");
      expect(results.length).toBe(1);
    });

    it("should return no matching entities", async function() {
      const results = await testService.nameEqual("90aseiaoejoaise");
      expect(results.length).toBe(0);
    });
  });

  describe("deleteMultiple", function() {
    it("should delete multiple entities", async function() {
      const entitiesBefore = await testService.list({ limit: -1 });
      await testService.deleteMultiple(entitiesBefore.list.map(entity => entity.id));
      const entities = await testService.list({ limit: -1 });
      expect(entities.count).toBe(0);
    });
  });

  describe("spliceOrThrow", function() {
    it("should splice the list", async function() {
      const entities = await testService.list();
      testService.spliceEntityOrThrow(entities.list, testId);
      expect(entities.list.length).toBe(entities.count - 1);
    });

    it("should throw", async function() {
      const entities = await testService.list();
      expect(() => testService.spliceEntityOrThrow(entities.list, testId + 1)).toThrow();
    });
  });

  describe("findIndexOrThrow", function() {
    it("should find index of an entity", async function() {
      const entities = await testService.list();
      expect(testService.findIndexOrThrow(entities.list, testId)).not.toBeUndefined();
    });

    it("should throw", async function() {
      const entities = await testService.list();
      expect(() => testService.findIndexOrThrow(entities.list, testId + 1)).toThrow();
    });
  });
});
