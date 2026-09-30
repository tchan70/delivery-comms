'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect, type JSX } from 'react';
import { MessageCard } from '@/components/MessageCard';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // TODO: report to an error tracker (for example Sentry) in production.
    console.error(error);
  }, [error]);

  function retry(): void {
    // reset() alone only re-renders on the client, so the failed server fetch
    // would not run again. refresh() asks the server to render the page again;
    // in one transition, the boundary resets when that new result arrives.
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <MessageCard title="Something went wrong">
      <p>We couldn&apos;t load your delivery details. Please try again.</p>
      <button type="button" onClick={retry}>
        Try again
      </button>
    </MessageCard>
  );
}
