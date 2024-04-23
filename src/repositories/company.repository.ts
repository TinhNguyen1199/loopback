import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, ReferencesManyAccessor, repository, BelongsToAccessor} from '@loopback/repository';
import {DemoDbDataSource} from '../datasources';
import {Company, CompanyRelations, Country, User} from '../models';
import {UserRepository} from './user.repository';
import {CountryRepository} from './country.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  public readonly userList: ReferencesManyAccessor<User, typeof Company.prototype.id>;

  public readonly country: HasOneRepositoryFactory<Country, typeof Company.prototype.id>;

  public readonly contryInfo: BelongsToAccessor<Country, typeof Company.prototype.id>;

  constructor(
    @inject('datasources.demoDb') dataSource: DemoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>,
  ) {
    super(Company, dataSource);
    this.contryInfo = this.createBelongsToAccessorFor('contryInfo', countryRepositoryGetter,);
    this.registerInclusionResolver('contryInfo', this.contryInfo.inclusionResolver);
    this.userList = this.createReferencesManyAccessorFor('userList', userRepositoryGetter,);
    this.registerInclusionResolver('userList', this.userList.inclusionResolver);
  }
}
