import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { AvailabilitySection } from '../src/components/AvailabilitySection';
import type { AvailabilityApiResponse } from '../src/shared/types';

const MOCK_RELIABLE_RESPONSE: AvailabilityApiResponse = {
  query: { start: '2026-11-01', end: '2027-05-01' },
  unavailableRanges: [
    // Noites ocupadas: 10, 11, 12, 13, 14 de novembro de 2026. Dia 15 é checkout exclusivo!
    { startDate: '2026-11-10', endDate: '2026-11-15' },
  ],
  lastSyncedAt: '2026-11-01T12:00:00.000Z',
  lastAttemptAt: '2026-11-01T12:00:00.000Z',
  status: 'ok',
  isStale: false,
  hasReliableData: true,
  syncIntervalMinutes: 15,
  staleThresholdMinutes: 60,
};

const MOCK_UNCONFIGURED_RESPONSE: AvailabilityApiResponse = {
  query: { start: '2026-11-01', end: '2027-05-01' },
  unavailableRanges: [],
  lastSyncedAt: null,
  lastAttemptAt: null,
  status: 'unconfigured',
  isStale: true,
  hasReliableData: false,
  syncIntervalMinutes: 15,
  staleThresholdMinutes: 60,
  message:
    'Calendário em fase de configuração. Consulte a disponibilidade diretamente pelo WhatsApp ou Airbnb.',
};

describe('Interface Visual, Navegação, Galeria e Calendário Interativo', () => {
  it('renderiza navegação principal, menu mobile, as 6 suítes verificadas e o lightbox da galeria', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(MOCK_RELIABLE_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Última sincronização com o Airbnb:/i)).toBeInTheDocument();
    });

    // Verifica título principal do Hero e indicadores
    expect(
      screen.getByRole('heading', {
        name: /Seu refúgio exclusivo em frente ao mar\./i,
      })
    ).toBeInTheDocument();

    // Verifica menu mobile
    const menuBtn = screen.getByRole('button', { name: /Abrir menu de navegação/i });
    fireEvent.click(menuBtn);
    expect(screen.getByRole('navigation', { name: /Menu móvel/i })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('navigation', { name: /Menu móvel/i })).not.toBeInTheDocument();

    // Verifica todas as 6 suítes e suas configurações de cama
    expect(screen.getByRole('heading', { name: 'Suíte 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suíte 2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suíte 3' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suíte 4' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suíte 5' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suíte 6' })).toBeInTheDocument();

    // Abre o Lightbox da galeria e fecha com Escape
    const galleryButtons = screen.getAllByRole('button', {
      name: /Ampliar fotografia:/i,
    });
    expect(galleryButtons.length).toBeGreaterThan(0);
    fireEvent.click(galleryButtons[0]);

    expect(screen.getByTestId('gallery-lightbox')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('gallery-lightbox')).not.toBeInTheDocument();
  });

  it('bloqueia datas indisponíveis no calendário e respeita a semântica de checkout exclusivo', () => {
    const { container } = render(
      <AvailabilitySection
        initialData={MOCK_RELIABLE_RESPONSE}
        todayOverride="2026-11-01"
      />
    );

    const day08 = container.querySelector('button[data-date="2026-11-08"]') as HTMLButtonElement;
    const day10 = container.querySelector('button[data-date="2026-11-10"]') as HTMLButtonElement;
    const day12 = container.querySelector('button[data-date="2026-11-12"]') as HTMLButtonElement;
    const day15 = container.querySelector('button[data-date="2026-11-15"]') as HTMLButtonElement;
    const day18 = container.querySelector('button[data-date="2026-11-18"]') as HTMLButtonElement;

    // Antes de selecionar check-in:
    // Dia 10 e Dia 12 estão ocupados (indisponíveis para check-in)
    expect(day10).toBeDisabled();
    expect(day12).toBeDisabled();
    // Dia 15 é o checkout da reserva (manhã de saída), portanto DEVE estar habilitado para um novo check-in!
    expect(day15).not.toBeDisabled();

    // Quando o visitante seleciona check-in no dia 08 de novembro:
    fireEvent.click(day08);
    expect(screen.getByTestId('selected-checkin')).toHaveTextContent('08/11/2026');

    // Agora que check-in = 08/11, o dia 10/11 (início da próxima reserva às 14h) torna-se HABILITADO como data exclusiva de checkout!
    expect(day10).not.toBeDisabled();
    // Já o dia 12/11 e 15/11 ficam desabilitados pois cruzariam noites ocupadas
    expect(day12).toBeDisabled();
    expect(day15).toBeDisabled();

    // Seleciona checkout no dia 10/11 (2 noites: 08 e 09)
    fireEvent.click(day10);
    expect(screen.getByTestId('selected-checkout')).toHaveTextContent('10/11/2026');
    expect(screen.getByTestId('stay-summary')).toHaveTextContent('2 noites selecionadas');

    // Verifica também que é possível iniciar um novo check-in no dia 15/11 (data de checkout da reserva anterior) e sair em 18/11
    fireEvent.click(day15);
    expect(screen.getByTestId('selected-checkin')).toHaveTextContent('15/11/2026');
    fireEvent.click(day18);
    expect(screen.getByTestId('selected-checkout')).toHaveTextContent('18/11/2026');
    expect(screen.getByTestId('stay-summary')).toHaveTextContent('3 noites selecionadas');
  });

  it('valida o limite máximo de 14 hóspedes na interface', () => {
    render(
      <AvailabilitySection
        initialData={MOCK_RELIABLE_RESPONSE}
        todayOverride="2026-11-01"
      />
    );

    const input = screen.getByLabelText('Quantidade de hóspedes') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '18' } });

    expect(input.value).toBe('14');
    expect(screen.getByTestId('selection-error')).toHaveTextContent(
      /capacidade máxima da casa é de 14 hóspedes/i
    );
  });

  it('não apresenta datas como confirmadas quando a primeira sincronização ainda não ocorreu', () => {
    const { container } = render(
      <AvailabilitySection
        initialData={MOCK_UNCONFIGURED_RESPONSE}
        todayOverride="2026-11-01"
      />
    );

    expect(screen.getByTestId('calendar-unconfirmed-banner')).toBeInTheDocument();
    const day05 = container.querySelector('button[data-date="2026-11-05"]') as HTMLButtonElement;
    expect(day05.getAttribute('data-status')).toBe('unconfirmed');
  });
});
