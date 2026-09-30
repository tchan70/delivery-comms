import type { JSX } from 'react';
import { MessageCard } from '@/components/MessageCard';

export default function NotFound(): JSX.Element {
  return (
    <MessageCard title="We couldn't find your next delivery">
      <p>Please check the link in your email or text message.</p>
    </MessageCard>
  );
}
