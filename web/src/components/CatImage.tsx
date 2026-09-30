import Image from 'next/image';
import type { JSX } from 'react';
import styles from './CatImage.module.css';

// Keep in sync with CatImage.module.css: a 56px circle on mobile, and 45% of
// the 720px card (324px) on desktop. The browser uses this to pick a small
// file on mobile.
const IMAGE_SIZES = '(min-width: 768px) 324px, 56px';

/** One image for both layouts. CSS reshapes it, so only one file downloads. */
export function CatImage(): JSX.Element {
  return (
    <div className={styles.frame}>
      <Image
        src="/cat.jpg"
        alt="A long-haired tabby cat sitting on a rug"
        fill
        sizes={IMAGE_SIZES}
        priority
        className={styles.image}
      />
    </div>
  );
}
