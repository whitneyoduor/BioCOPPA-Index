import type { Dataset } from './types';
import { MOCK_DATASETS } from './datasets';

type Listener = () => void;

/**
 * Data layer abstraction. UI components never read datasets directly:
 * they subscribe through the `useDataStore` hook, so swapping mock data
 * for an Excel import or a REST API requires no UI changes.
 */
class DataStore {
  private datasets: Dataset[] = [];
  private activeId: string | null = null;
  private listeners = new Set<Listener>();

  /** Initialise the store with the mock source. Async to mirror a real fetch. */
  async init(): Promise<void> {
    this.datasets = await this.loadSource();
    if (!this.activeId && this.datasets.length > 0) {
      this.activeId = this.datasets[0].meta.id;
    }
    this.emit();
  }

  /** Swap this out later for `await fetch('/api/datasets')` or Excel parsing. */
  private async loadSource(): Promise<Dataset[]> {
    return MOCK_DATASETS;
  }

  getDatasets(): Dataset[] {
    return this.datasets;
  }

  getActiveDataset(): Dataset | undefined {
    return this.datasets.find((d) => d.meta.id === this.activeId);
  }

  setActiveDataset(id: string): void {
    if (this.datasets.some((d) => d.meta.id === id)) {
      this.activeId = id;
      this.emit();
    }
  }

  /** Import a new dataset (future: file uploads / API responses). */
  loadDataset(dataset: Dataset): void {
    this.datasets = this.datasets.filter((d) => d.meta.id !== dataset.meta.id).concat(dataset);
    this.activeId = dataset.meta.id;
    this.emit();
  }

  /** Restore the built-in mock datasets. */
  reset(): void {
    this.datasets = MOCK_DATASETS.slice();
    this.activeId = this.datasets[0]?.meta.id ?? null;
    this.emit();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    this.listeners.forEach((l) => l());
  }
}

export const dataStore = new DataStore();
