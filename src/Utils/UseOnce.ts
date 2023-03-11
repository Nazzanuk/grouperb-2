import { EffectCallback, useEffect, useState } from 'react';

export const useOnce = (effect: Function, cleanup?: Destructor) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!init) {
      setInit(true);
      effect();
    }

    return cleanup;
  }, []);
};
