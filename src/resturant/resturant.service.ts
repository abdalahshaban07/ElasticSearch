import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchService } from 'src/search/search.service';
import { CreateResturantDto } from './dto/create-resturant.dto';
import { Resurant, ResurantDocument } from './schemas/resturant.schema';

@Injectable()
export class ResturantService {
  constructor(
    @InjectModel(Resurant.name) private resurantModel: Model<ResurantDocument>,
    private SearchService: SearchService,
  ) {}

  // Find all resturants
  async findAll(): Promise<ResurantDocument[]> {
    return await this.resurantModel.find().exec();
  }

  // Find resturant by id
  async findById(id: string): Promise<ResurantDocument> {
    return await this.resurantModel.findById(id).exec();
  }

  // Find resturant by unique name
  async findByUniqueName(uniqueName: string): Promise<ResurantDocument> {
    return await this.resurantModel.findOne({ uniqueName }).exec();
  }

  // list by cuisine
  async listByCuisine(cuisine: string): Promise<ResurantDocument[]> {
    return await this.resurantModel.find({ cuisine }).exec();
  }

  // find nearby restaurants within 1 KM based on location (latitude and longitude)
  async findNearbyResturants(
    lng: number,
    lat: number,
  ): Promise<ResurantDocument[]> {
    let geoSpatialQuery = {
      location: {
        $near: {
          $maxDistance: 1000, // 1 KM
          $minDistance: 0,
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        },
      },
    };

    return await this.resurantModel.find(geoSpatialQuery).exec();
    // return await this.resurantModel
    //   .find()
    //   .where('location')
    //   .near({
    //     center: { type: 'Point', coordinates: [lng, lat] },
    //     maxDistance: 1000,
    //   });
  }

  // Create a new resturant
  async create(resturant: CreateResturantDto): Promise<ResurantDocument> {
    let newResturant = await this.resurantModel.create(resturant);
    await this.SearchService.indexResturant(newResturant);
    return newResturant;
  }

  // Search for resturants
  async search(search: string): Promise<any> {
    console.log({ search });

    let restaurants = await this.SearchService.search(search);
    console.log({ restaurants });

    return restaurants;
  }

  // Delete a resturant
  async delete(id: string): Promise<ResurantDocument> {
    return await this.resurantModel.findByIdAndDelete(id).exec();
  }

  // Update a resturant
  async update(
    id: string,
    resturant: CreateResturantDto,
  ): Promise<ResurantDocument> {
    return await this.resurantModel
      .findByIdAndUpdate(id, resturant, { new: true })
      .exec();
  }
}
