import { useState } from 'react';

export function useLoading(): [boolean, () => void, () => void] {
  const [isLoading, setIsLoading] = useState(false);

  function carrying() {
    setIsLoading(true);
  }
  function outCarrying() {
    setIsLoading(false);
  }

  return [isLoading, carrying, outCarrying];
}
