'use client';

import { useEffect, useState, useRef } from 'react';

export function useTimeSinceRender(delayMs: number = 10000) {
  const [hasElapsed, setHasElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasElapsed(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return hasElapsed;
}
