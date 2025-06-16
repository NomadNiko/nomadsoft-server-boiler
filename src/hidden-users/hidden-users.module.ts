import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HiddenUsersController } from './hidden-users.controller';
import { HiddenUsersService } from './hidden-users.service';
import { HiddenUserRepository } from './infrastructure/persistence/hidden-user.repository';
import { HiddenUserDocumentRepository } from './infrastructure/persistence/document/repositories/hidden-user.repository';
import { HiddenUserSchemaClass, HiddenUserSchema } from './infrastructure/persistence/document/entities/hidden-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HiddenUserSchemaClass.name, schema: HiddenUserSchema },
    ]),
  ],
  controllers: [HiddenUsersController],
  providers: [
    HiddenUsersService,
    {
      provide: HiddenUserRepository,
      useClass: HiddenUserDocumentRepository,
    },
  ],
  exports: [HiddenUsersService, HiddenUserRepository],
})
export class HiddenUsersModule {}