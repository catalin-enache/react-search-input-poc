export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null;
  return function (...args: any[]) {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
    return () => {
      if (timeoutId) {
        // console.log('clearing timeout');
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  };
};
