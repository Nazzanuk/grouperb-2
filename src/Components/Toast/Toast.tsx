import { FC } from 'react';

import { useAtomValue } from 'jotai';

import { toastsAtom } from 'Atoms/Toast.atom';

import styles from './Toast.module.css';

export const Toasts: FC = () => {
  const toasts = useAtomValue(toastsAtom);

  console.log({ toasts });

  return (
    <div className={styles.wrapper}>
      {toasts.map((toast) => (
        <div className={styles.toast} key={toast.id}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};
