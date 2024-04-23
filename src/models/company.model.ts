import {Entity, model, property, referencesMany, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Country} from './country.model';

@model({settings: {strict: false}})
export class Company extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
    enum: ['active', 'delete'],
    default: 'active',
  })
  status: string;
  @referencesMany(() => User, {name: 'userList'})
  userIds: string[];

  @belongsTo(() => Country, {name: 'contryInfo'})
  countryId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
