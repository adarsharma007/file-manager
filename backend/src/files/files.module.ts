import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller'; 
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../../migration/file.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
