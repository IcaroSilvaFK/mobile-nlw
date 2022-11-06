import { useState } from 'react';

export function useLoading(): [boolean, () => void, () => void] {
  const [isLoading, setIsLoading] = useState(false);

  function carring() {
    setIsLoading(true);
  }
  function outCarring() {
    setIsLoading(false);
  }

  return [isLoading, carring, outCarring];
}
