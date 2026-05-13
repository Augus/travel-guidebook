import type { Block } from "../schema/blocks";
import type { Entity } from "../schema/entity";
import type { Trip } from "../schema/trip";

export type BlockProps<T extends Block = Block> = {
  block: T;
  entities: Map<string, Entity>;
  tripMeta?: Trip["meta"];
  scope?: string;
  onOpenEntity?: (scope: string, entityId: string) => void;
};

export type BlockComponent<T extends Block = Block> = (props: BlockProps<T>) => React.ReactElement | null;
