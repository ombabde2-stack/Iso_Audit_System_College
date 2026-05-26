import { useEffect, useRef } from 'react';

export const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);

  const debouncedFn = (...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delay);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return debouncedFn;
};
