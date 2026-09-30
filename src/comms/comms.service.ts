import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { NextDeliveryResponse } from './comms.types';
import { calculateTotalPriceInPence } from './helpers/calculate-total-price';
import { formatCatNames } from './helpers/format-cat-names';
import { penceToPounds } from './helpers/pence-to-pounds';
import { qualifiesForFreeGift } from './helpers/qualifies-for-free-gift';

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

    const catNames = formatCatNames(activeCats.map((cat) => cat.name));
    const totalPriceInPence = calculateTotalPriceInPence(
      activeCats.map((cat) => cat.pouchSize),
    );

    return {
      title: `Your next delivery for ${catNames}`,
      message: `Hey ${user.firstName}! In two days' time, we'll be charging you for your next order for ${catNames}'s fresh food.`,
      totalPrice: penceToPounds(totalPriceInPence),
      freeGift: qualifiesForFreeGift(totalPriceInPence),
    };
  }
}
