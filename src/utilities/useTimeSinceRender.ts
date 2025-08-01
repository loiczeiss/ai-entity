'use client';

import { useCallback, useState } from 'react';

export function useTimeSinceRender() {
  const [renderTime] = useState(Date.now());

  const hasTimeElapsed = useCallback(() => {
    return Date.now() - renderTime > 10000; // 10 seconds
  }, [renderTime]);

  return hasTimeElapsed;
}
