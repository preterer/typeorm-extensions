import { EntityRepository } from "typeorm";

import { CoreRepository } from "../src/repositories/core.repository";

import { Test } from "./testEntity";

@EntityRepository(Test)
export class TestRepository extends CoreRepository<Test> {}
