import type { AvailabilityApiResponse } from '../shared/types';
import { addDays, getTodayIsoInTimezone } from '../shared/dateUtils';

export interface FetchAvailabilityOptions {
  start?: string;
  end?: string;
  signal?: AbortSignal;
}

/**
 * Cliente de API do frontend para consultar `/api/availability`.
 */
export async function fetchAvailability(
  options: FetchAvailabilityOptions = {}
): Promise<AvailabilityApiResponse> {
  const start = options.start ?? getTodayIsoInTimezone();
  const end = options.end ?? addDays(start, 210);

  const params = new URLSearchParams({ start, end });
  const response = await fetch(`/api/availability?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  });

  if (!response.ok) {
    let errorMessage = `Não foi possível carregar o calendário (HTTP ${response.status}).`;
    try {
      const errJson = (await response.json()) as { error?: string };
      if (errJson?.error) {
        errorMessage = errJson.error;
      }
    } catch {
      // Ignora erro de parse de JSON em respostas de erro
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as AvailabilityApiResponse;
  return data;
}
