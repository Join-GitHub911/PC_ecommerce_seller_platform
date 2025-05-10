import { FindOperator } from 'typeorm';
export type EntityId = number;
export type FindEntityId = EntityId | FindOperator<EntityId>;
