import {
  AnyObject,
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Company} from '../models';
import {CompanyRepository, CountryRepository, UserRepository} from '../repositories';

export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository: CompanyRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CountryRepository)
    public countryRepository: CountryRepository,
  ) { }

  @post('/companies')
  @response(200, {
    description: 'Company model instance',
    content: {'application/json': {schema: getModelSchemaRef(Company)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            title: 'NewCompany',
            exclude: ['id'],
          }),
        },
      },
    })
    company: Omit<Company, 'id'>,
  ): Promise<Company> {
    return this.companyRepository.create(company);
  }


  // Get list company
  @get('/companies')
  @response(200, {
    description: 'Array of Company model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Company, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Company) filter?: Filter<Company>,
  ): Promise<Company[]> {
    const filters: Filter = {...filter}

    filters.include = [
      {
        relation: "userList",
        scope: {
          fields: {id: true, firstName: true, lastName: true, tels: true, emails: true},
        },
      },
      {
        relation: "contryInfo",
      }
    ]

    const companies = await this.companyRepository.find(filters);


    return companies;
  }

  // Get specific company info by id
  @get('/companies/{id}')
  @response(200, {
    description: 'Company model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Company, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Company, {exclude: 'where'}) filter?: FilterExcludingWhere<Company>
  ): Promise<Company> {
    const filters: Filter = {...filter}

    filters.include = [
      {
        relation: "userList",
        scope: {
          fields: {id: true, firstName: true, lastName: true, tels: true, emails: true},
        },
      },
      {
        relation: "contryInfo",
      }
    ]
    return this.companyRepository.findById(id, filters);
  }

  // Get numbers company employee by company id
  @get('/companies-count-user/{id}')
  @response(200, {
    description: 'Company model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Company, {includeRelations: true}),
      },
    },
  })
  async findAndCountUserByIdCompany(
    @param.path.string('id') id: string,
    @param.filter(Company, {exclude: 'where'}) filter?: FilterExcludingWhere<Company>
  ): Promise<AnyObject> {

    let company = await this.companyRepository.findById(id, filter);
    const rs = {id: company.id, name: company.name, countUser: company.userIds.length};

    return rs
  }

  //Update by id company
  @patch('/companies/{id}')
  @response(204, {
    description: 'Company PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {partial: true}),
        },
      },
    })
    company: Company,
  ): Promise<AnyObject> {

    await this.countryRepository.findById(company?.countryId);
    await this.companyRepository.updateById(id, company);

    return {message: `Update id "${id}" successful!`}
  }

  // @put('/companies/{id}')
  // @response(204, {
  //   description: 'Company PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() company: Company,
  // ): Promise<void> {
  //   await this.companyRepository.replaceById(id, company);
  // }

  // @del('/companies/{id}')
  // @response(204, {
  //   description: 'Company DELETE success',
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.companyRepository.deleteById(id);
  // }
}
