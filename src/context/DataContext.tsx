import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Dataset } from '../data/types';
import { dataStore } from '../data/dataService';
import { computeIndex } from '../calc/calculations';
import type { IndexResult } from '../calc/calculations';

interface DataContextValue {
  activeDataset: Dataset | undefined;
  datasets: Dataset[];
  index: IndexResult | null;
  ready: boolean;
  setActiveDataset: (id: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    dataStore.init().then(() => {
      if (mounted) {
        setReady(true);
        setVersion((v) => v + 1);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return dataStore.subscribe(() => setVersion((v) => v + 1));
  }, []);

  const value = useMemo(() => {
    void version;
    const activeDataset = dataStore.getActiveDataset();
    return {
      activeDataset,
      datasets: dataStore.getDatasets(),
      index: activeDataset ? computeIndex(activeDataset) : null,
      ready,
      setActiveDataset: dataStore.setActiveDataset.bind(dataStore),
    };
  }, [version, ready]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
