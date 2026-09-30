import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { NextDeliveryResponse } from './comms.types';
import { buildNextDeliveryComms } from './helpers/build-next-delivery-comms';

@Injectable()
export class CommsService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getNextDelivery(userId: string): NextDeliveryResponse {
    const user = this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const activeCats = user.cats.filter((cat) => cat.subscriptionActive);
    if (activeCats.length === 0) {
      // No active cats means no next delivery, so there is nothing to send.
      throw new NotFoundException(`User ${userId} has no active cats`);
    }

    return buildNextDeliveryComms(user.firstName, activeCats);
  }
}
