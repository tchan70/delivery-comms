import { Cat } from '../../users/user.types';
import { buildNextDeliveryComms } from './build-next-delivery-comms';

const dorian: Cat = {
  name: 'Dorian',
  subscriptionActive: true,
  breed: 'Thai',
  pouchSize: 'C',
};
const ocie: Cat = {
  name: 'Ocie',
  subscriptionActive: true,
  breed: 'Somali',
  pouchSize: 'F',
};

describe('buildNextDeliveryComms', () => {
  it('builds the README example exactly', () => {
    expect(buildNextDeliveryComms('Kayleigh', [dorian, ocie])).toEqual({
      title: 'Your next delivery for Dorian and Ocie',
      message:
        "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
      totalPrice: 134,
      freeGift: true,
    });
  });

  it('builds the message for one cat without a free gift', () => {
    const betsy: Cat = { ...dorian, name: 'Betsy', pouchSize: 'E' };

    expect(buildNextDeliveryComms('Cordell', [betsy])).toEqual({
      title: 'Your next delivery for Betsy',
      message:
        "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
      totalPrice: 69,
      freeGift: false,
    });
  });

  it("adds 's after a name that ends in s, as the template in the brief does", () => {
    const travis: Cat = { ...dorian, name: 'Travis' };

    expect(buildNextDeliveryComms('Sam', [travis]).message).toContain(
      "Travis's fresh food.",
    );
  });

  it('lists three or more cats with commas and a final "and"', () => {
    const luna: Cat = { ...dorian, name: 'Luna', pouchSize: 'A' };

    expect(buildNextDeliveryComms('Sam', [dorian, ocie, luna]).title).toBe(
      'Your next delivery for Dorian, Ocie and Luna',
    );
  });
});
