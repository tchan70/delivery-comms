import { Module } from '@nestjs/common';
import { CommsModule } from './comms/comms.module';

@Module({
  imports: [CommsModule],
})
export class AppModule {}
