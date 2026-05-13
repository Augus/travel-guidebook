import type { Block } from "../schema/blocks";
import type { Entity } from "../schema/entity";

export type BlockProps<T extends Block = Block> = {
  block: T;
  entities: Map<string, Entity>;
};

export type BlockComponent<T extends Block = Block> = (props: BlockProps<T>) => React.ReactElement | null;
