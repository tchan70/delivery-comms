import { render, screen } from '@testing-library/react';
import type { NextDeliveryResponse } from '@/lib/types';
import { DeliveryCard } from './DeliveryCard';

const delivery: NextDeliveryResponse = {
  title: 'Your next delivery for Dorian and Ocie',
  message:
    "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
  totalPrice: 134,
  freeGift: true,
};

describe('DeliveryCard', () => {
  it('renders the title as the page heading', () => {
    render(<DeliveryCard delivery={delivery} />);

    expect(
      screen.getByRole('heading', { level: 1, name: delivery.title }),
    ).toBeTruthy();
  });

  it('renders the message and the formatted total price', () => {
    render(<DeliveryCard delivery={delivery} />);

    expect(screen.getByText(delivery.message)).toBeTruthy();
    expect(screen.getByText('Total price: £134.00')).toBeTruthy();
  });

  it('renders "See details" as a button and "Edit delivery" as a link', () => {
    render(<DeliveryCard delivery={delivery} />);

    expect(screen.getByRole('button', { name: 'See details' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Edit delivery' })).toBeTruthy();
  });

  it('renders one cat image with alt text', () => {
    render(<DeliveryCard delivery={delivery} />);

    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByAltText(/cat/)).toBeTruthy();
  });

  it('shows the free gift tag when freeGift is true', () => {
    render(<DeliveryCard delivery={delivery} />);

    expect(screen.getByText('Free gift')).toBeTruthy();
  });

  it('hides the free gift tag when freeGift is false', () => {
    render(<DeliveryCard delivery={{ ...delivery, freeGift: false }} />);

    expect(screen.queryByText('Free gift')).toBeNull();
  });
});
