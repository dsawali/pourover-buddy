import React, { createContext, useContext, useState } from 'react';
import type { BrewRequest, TroubleshootRequest, AppMode } from '../types';

type PendingRequest =
  | { mode: 'brew'; data: BrewRequest }
  | { mode: 'troubleshoot'; data: TroubleshootRequest }
  | null;

type RequestContextValue = {
  pending: PendingRequest;
  setPending: (req: PendingRequest) => void;
};

const RequestContext = createContext<RequestContextValue | null>(null);

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingRequest>(null);
  return (
    <RequestContext.Provider value={{ pending, setPending }}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest(): RequestContextValue {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequest must be used within RequestProvider');
  return ctx;
}

export type { PendingRequest, AppMode };
