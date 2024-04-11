import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from '../../migration/file.schema';
import { CreateFileDto } from './dto/create.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async uploadFile(file: Express.Multer.File): Promise<File> {
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
    };

    const uploadResult = await s3.upload(params).promise();

    const createFileDto: CreateFileDto = {
      name: file.originalname,
      url: uploadResult.Location,
    };
    console.log(createFileDto);
    const createdFile = new this.fileModel(createFileDto);
    return createdFile.save();
  }

  async findAll(): Promise<File[]> {
    return this.fileModel.find().exec();
  }
}