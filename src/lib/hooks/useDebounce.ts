import { useCallback, useEffect, useMemo, useRef } from 'react';
import { debounce as _debounce } from 'lib/debounce';

export const useDebounce = (fn: (...args: any[]) => void, delay: number) => {
  const debounce = useMemo(() => _debounce(fn, delay), [fn, delay]);
  const cancelDebounce = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    // clearing timeout id on unmount
    return () => {
      cancelDebounce.current && cancelDebounce.current();
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      cancelDebounce.current = debounce(...args);
    },
    [debounce]
  );
};
