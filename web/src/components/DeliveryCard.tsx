import type { JSX } from 'react';
import { formatPrice } from '@/lib/format-price';
import type { NextDeliveryResponse } from '@/lib/types';
import { CatImage } from './CatImage';
import styles from './DeliveryCard.module.css';

interface DeliveryCardProps {
  delivery: NextDeliveryResponse;
}

export function DeliveryCard({ delivery }: DeliveryCardProps): JSX.Element {
  return (
    <article className={styles.card}>
      <CatImage />
      <div className={styles.content}>
        <h1 className={styles.title}>{delivery.title}</h1>
        <p className={styles.message}>{delivery.message}</p>
        <p className={styles.totalPrice}>
          Total price: {formatPrice(delivery.totalPrice)}
        </p>
        <div className={styles.actions}>
          {/* TODO: open the delivery details modal (out of scope per the design notes). */}
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
          >
            See details
          </button>
          {/* TODO: link to the edit delivery page once it exists. */}
          <a href="#" className={`${styles.button} ${styles.secondaryButton}`}>
            Edit delivery
          </a>
        </div>
      </div>
      {delivery.freeGift && <p className={styles.freeGift}>Free gift</p>}
    </article>
  );
}
