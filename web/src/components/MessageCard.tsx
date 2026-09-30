import type { JSX, ReactNode } from 'react';
import styles from './MessageCard.module.css';

interface MessageCardProps {
  title: string;
  children?: ReactNode;
}

/** A plain card for the loading, not found and error states. */
export function MessageCard({
  title,
  children,
}: MessageCardProps): JSX.Element {
  return (
    <article className={styles.card}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </article>
  );
}
