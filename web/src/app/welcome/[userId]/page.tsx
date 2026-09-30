import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { DeliveryCard } from '@/components/DeliveryCard';
import { getNextDelivery } from '@/lib/api';

interface WelcomePageProps {
  params: Promise<{ userId: string }>;
}

// A Server Component: the API call runs on the server, so the browser gets
// finished HTML in one request and the API needs no CORS setup.
export default async function WelcomePage({
  params,
}: WelcomePageProps): Promise<JSX.Element> {
  const { userId } = await params;
  const delivery = await getNextDelivery(userId);

  if (!delivery) {
    notFound();
  }

  return <DeliveryCard delivery={delivery} />;
}
