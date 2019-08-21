import { CoreEntity } from "../src/entities/core.entity";
import { Entity, Column } from "typeorm";

@Entity()
export class Test extends CoreEntity {
  @Column()
  name: string;
}
