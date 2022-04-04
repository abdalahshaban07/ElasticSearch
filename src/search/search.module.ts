import { SearchService } from './search.service';
import { Module, OnModuleInit } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_URI'),
        maxRetries: 10,
        requestTimeout: 60000,
        
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [SearchService],
  exports: [ElasticsearchModule, SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}

  async onModuleInit() {
    // await this.searchService.createIndex();
  }
}
