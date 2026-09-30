import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CommsController } from './comms.controller';
import { CommsService } from './comms.service';

@Module({
  imports: [UsersModule],
  controllers: [CommsController],
  providers: [CommsService],
})
export class CommsModule {}
