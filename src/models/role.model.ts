import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class Role extends Entity {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  permissions: string[];

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
