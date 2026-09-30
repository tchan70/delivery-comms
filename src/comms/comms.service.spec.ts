import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../users/user.types';
import { UsersRepository } from '../users/users.repository';
import { CommsService } from './comms.service';

const kayleigh: User = {
  id: 'ff535484-6880-4653-b06e-89983ecf4ed5',
  firstName: 'Kayleigh',
  lastName: 'Wilderman',
  email: 'Kayleigh_Wilderman@hotmail.com',
  cats: [
    { name: 'Dorian', subscriptionActive: true, breed: 'Thai', pouchSize: 'C' },
    { name: 'Ocie', subscriptionActive: true, breed: 'Somali', pouchSize: 'F' },
    {
      name: 'Eldridge',
      subscriptionActive: false,
      breed: 'Himalayan',
      pouchSize: 'A',
    },
  ],
};

const userWithInactiveMiddleCat: User = {
  id: '11111111-1111-4111-8111-111111111111',
  firstName: 'Sam',
  lastName: 'Jones',
  email: 'sam@example.com',
  cats: [
    { name: 'Tom', subscriptionActive: true, breed: 'Manx', pouchSize: 'A' },
    {
      name: 'Felix',
      subscriptionActive: false,
      breed: 'Bengal',
      pouchSize: 'F',
    },
    { name: 'Luna', subscriptionActive: true, breed: 'Sphynx', pouchSize: 'C' },
  ],
};

const userWithNoActiveCats: User = {
  id: '22222222-2222-4222-8222-222222222222',
  firstName: 'Alex',
  lastName: 'Smith',
  email: 'alex@example.com',
  cats: [
    {
      name: 'Milo',
      subscriptionActive: false,
      breed: 'Persian',
      pouchSize: 'B',
    },
  ],
};

const testUsers: User[] = [
  kayleigh,
  userWithInactiveMiddleCat,
  userWithNoActiveCats,
];

const fakeUsersRepository: Pick<UsersRepository, 'findById'> = {
  findById: (id: string): User | undefined =>
    testUsers.find((user) => user.id === id),
};

describe('CommsService', () => {
  let service: CommsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommsService,
        { provide: UsersRepository, useValue: fakeUsersRepository },
      ],
    }).compile();

    service = moduleRef.get(CommsService);
  });

  it('returns the README example exactly', () => {
    expect(service.getNextDelivery(kayleigh.id)).toEqual({
      title: 'Your next delivery for Dorian and Ocie',
      message:
        "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
      totalPrice: 134,
      freeGift: true,
    });
  });

  it('leaves inactive cats out of the names and the price', () => {
    const response = service.getNextDelivery(userWithInactiveMiddleCat.id);

    expect(response.title).toBe('Your next delivery for Tom and Luna');
    expect(response.totalPrice).toBe(118.25);
    expect(response.freeGift).toBe(false);
  });

  it('throws NotFoundException for an unknown user', () => {
    expect(() =>
      service.getNextDelivery('00000000-0000-4000-8000-000000000000'),
    ).toThrow(NotFoundException);
  });

  it('throws NotFoundException when the user has no active cats', () => {
    expect(() => service.getNextDelivery(userWithNoActiveCats.id)).toThrow(
      new NotFoundException(
        `User ${userWithNoActiveCats.id} has no active cats`,
      ),
    );
  });
});
