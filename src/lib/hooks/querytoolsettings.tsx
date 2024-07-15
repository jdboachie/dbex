'use client';

import * as React from "react";
import { Connection } from "@prisma/client";

export interface QueryToolSettings {
  connection: Connection;
}

interface QueryToolContextType {
  queryToolSettings: QueryToolSettings | null;
  setQueryToolSettings: (settings: QueryToolSettings) => void;
}

const QueryToolSettingsContext = React.createContext<QueryToolContextType | undefined>(undefined);

export const QueryToolSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryToolSettings, setQueryToolSettings] = React.useState<QueryToolSettings | null>(null);

  return (
    <QueryToolSettingsContext.Provider value={{ queryToolSettings, setQueryToolSettings }}>
      {children}
    </QueryToolSettingsContext.Provider>
  );
};

// Custom hook to use the QueryToolSettingsContext
export const useQueryToolContext = (): QueryToolContextType => {
  const context = React.useContext(QueryToolSettingsContext);
  if (!context) {
    throw new Error("useQueryToolContext must be used within a QueryToolSettingsProvider");
  }
  return context;
};
