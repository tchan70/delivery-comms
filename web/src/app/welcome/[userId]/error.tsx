'use client';

import { useEffect, type JSX } from 'react';
import { MessageCard } from '@/components/MessageCard';

interface ErrorPageProps {
  error: Error & { digest?: string };
}

export default function ErrorPage({ error }: ErrorPageProps): JSX.Element {
  useEffect(() => {
    // TODO: report to an error tracker (for example Sentry) in production.
    console.error(error);
  }, [error]);

  return (
    <MessageCard title="Something went wrong">
      <p>We couldn&apos;t load your delivery details. Please try again.</p>
      {/* A full reload runs the server fetch again. Next's reset() only
          re-renders on the client, so it would show this error again. */}
      <button type="button" onClick={() => window.location.reload()}>
        Try again
      </button>
    </MessageCard>
  );
}
