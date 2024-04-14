import { MutableRefObject, Ref } from 'react';

export const combineRefs = <T>(refs: Array<Ref<T>>) => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };
};
