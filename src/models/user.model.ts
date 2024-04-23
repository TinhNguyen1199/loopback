import {Entity, model, property, hasMany} from '@loopback/repository';
import {Company} from './company.model';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  tels?: object[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  email?: object[];

  @hasMany(() => Company, {keyTo: 'userIds'})
  companies: Company[];

  @property({
    type: 'string',
  })
  userIds?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
