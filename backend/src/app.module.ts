import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module'; 

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost:27017/google-drive-clone`),
    FilesModule,
    UsersModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
