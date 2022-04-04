import { ResturantService } from './resturant.service';
import { Module } from '@nestjs/common';
import { ResturantController } from './resturant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resurant, ResurantSchema } from './schemas/resturant.schema';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    SearchModule,
    MongooseModule.forFeature([
      { name: Resurant.name, schema: ResurantSchema },
    ]),
  ],
  controllers: [ResturantController],
  providers: [ResturantService],
})
export class ResturantModule {}
