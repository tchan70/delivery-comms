import type { JSX } from 'react';
import { MessageCard } from '@/components/MessageCard';

export default function Loading(): JSX.Element {
  return (
    <div role="status">
      <MessageCard title="Loading your next delivery…" />
    </div>
  );
}
