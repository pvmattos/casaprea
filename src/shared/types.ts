/**
 * Tipos compartilhados entre o Cloudflare Worker (backend) e a aplicação React (frontend).
 */

/**
 * Intervalo indisponível normalizado no formato semiaberto [startDate, endDate).
 * - `startDate` (YYYY-MM-DD): data de check-in (primeira noite ocupada).
 * - `endDate` (YYYY-MM-DD): data exclusiva de checkout (manhã de saída; noite livre para novo check-in).
 */
export interface UnavailableRange {
  startDate: string;
  endDate: string;
}

export type SyncStatus = 'ok' | 'error' | 'unconfigured' | 'uninitialized';

export interface StoredAvailabilityData {
  unavailableRanges: UnavailableRange[];
  eventCount: number;
  syncedAt: string; // ISO 8601 UTC
  sourceHash: string;
}

export interface StoredSyncState {
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastStatus: SyncStatus;
  lastError: string | null;
  consecutiveFailures: number;
}

export interface AvailabilityApiResponse {
  query: {
    start: string;
    end: string;
  };
  unavailableRanges: UnavailableRange[];
  lastSyncedAt: string | null;
  lastAttemptAt: string | null;
  status: SyncStatus;
  isStale: boolean;
  hasReliableData: boolean;
  syncIntervalMinutes: number;
  staleThresholdMinutes: number;
  message?: string;
}

export interface SuiteConfig {
  id: string;
  number: number;
  name: string;
  bedsSummary: string;
  bedsDetail: string[];
  capacityNote: string;
  highlights: string[];
  image: string;
  secondaryImage?: string;
  imageAlt: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: 'Casa' | 'Rooftop' | 'Áreas sociais' | 'Suítes';
  caption: string;
  aspect: 'wide' | 'tall' | 'standard' | 'square';
}

export interface AmenityItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  iconName: string;
}
