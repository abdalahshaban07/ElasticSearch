import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { IResturant } from 'src/resturant/interfaces/resturatn';

@Injectable()
export class SearchService {
  index = 'resturants';
  constructor(private elasticSearchService: ElasticsearchService) {}

  // create index
  async createIndex() {
    const index = process.env.ELASTIC_INDEX;
    console.log({ index });

    const checkIndex = await this.elasticSearchService.indices.exists({
      index,
    });
    console.log({ index, checkIndex });

    if (!checkIndex) {
      await this.elasticSearchService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text',
              },
              uniqueName: {
                type: 'keyword',
              },
              cuisine: {
                type: 'keyword',
              },
              location: {
                type: 'geo_point',
              },
            },
          },
        },
      });
    }
  }

  // index resturant
  async indexResturant(resturant: IResturant) {
    return this.elasticSearchService.index<IResturant>({
      index: this.index,
      body: {
        ...resturant,
      },
    });
  }

  // search
  async search(search: string) {
    console.log({ search3: search });
    this.elasticSearchService.info().then(console.log, console.error);
    const body = await this.elasticSearchService.search<IResturant>({
      index: this.index,
      query: {
        multi_match: {
          query: search,
          fields: ['name', 'cuisine', 'uniqueName'],
        },
      },
    });
    console.log({ body });
  }

  // find by id
  async findById(id: string) {
    return this.elasticSearchService.get<IResturant>({
      index: this.index,
      id,
    });
  }

  // remove by id
  async removeById(id: string) {
    return this.elasticSearchService.delete({
      index: this.index,
      id,
    });
  }
}
