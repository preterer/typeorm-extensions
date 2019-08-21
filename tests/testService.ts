import { DeepPartial } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

import { EntityService } from "../src/services/entity.service";

import { Test } from "./testEntity";
import { TestRepository } from "./testRepository";

@Service()
export class TestService extends EntityService<Test, DeepPartial<Test>> {
  @InjectRepository(Test)
  protected repository: TestRepository;

  nameLike(text: string): Promise<Test[]> {
    return this.repository
      .createQueryBuilder("test")
      .andLike("test.name", text)
      .getMany();
  }

  nameEqual(text: string): Promise<Test[]> {
    return this.repository
      .createQueryBuilder("test")
      .andEqual("test.name", text)
      .getMany();
  }
}
