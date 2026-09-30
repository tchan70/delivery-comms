import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CommsService } from './comms.service';
import { NextDeliveryResponse } from './comms.types';

@Controller('comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}

  @Get('your-next-delivery/:userId')
  getNextDelivery(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): NextDeliveryResponse {
    return this.commsService.getNextDelivery(userId);
  }
}
