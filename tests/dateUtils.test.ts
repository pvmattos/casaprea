import { describe, expect, it } from 'vitest';
import {
  doesStayOverlapUnavailable,
  isDateAvailableForCheckIn,
  isDateAvailableForCheckOut,
  isNightOccupied,
  isValidIsoDate,
  normalizeAndMergeRanges,
  validateGuestCount,
  validateStaySelection,
} from '../src/shared/dateUtils';
import type { UnavailableRange } from '../src/shared/types';

describe('Date & Stay Semantics (Checkout exclusivo e validação de hóspedes)', () => {
  const ranges: UnavailableRange[] = [
    { startDate: '2026-11-10', endDate: '2026-11-15' },
    { startDate: '2026-11-20', endDate: '2026-11-23' },
  ];

  it('trata o checkout como data final exclusiva: o dia do checkout não bloqueia nova noite', () => {
    // Noites 10, 11, 12, 13, 14 estão ocupadas
    expect(isNightOccupied('2026-11-09', ranges)).toBe(false);
    expect(isNightOccupied('2026-11-10', ranges)).toBe(true);
    expect(isNightOccupied('2026-11-14', ranges)).toBe(true);

    // Dia 15 é o checkout da reserva (manhã até 12h), logo a noite de 15 está LIVRE para novo check-in!
    expect(isNightOccupied('2026-11-15', ranges)).toBe(false);
    expect(isDateAvailableForCheckIn('2026-11-15', ranges, '2026-11-01')).toBe(true);
    expect(isDateAvailableForCheckIn('2026-11-10', ranges, '2026-11-01')).toBe(false);
  });

  it('permite selecionar a data de início de uma reserva futura como data de checkout de quem entrou antes', () => {
    // Hóspede entra em 2026-11-07 e sai na manhã de 2026-11-10 (quando outra reserva fará check-in às 14h)
    expect(isDateAvailableForCheckOut('2026-11-07', '2026-11-10', ranges)).toBe(true);
    expect(doesStayOverlapUnavailable('2026-11-07', '2026-11-10', ranges)).toBe(false);

    // Porém, tentar fazer checkout em 2026-11-11 cruza a noite ocupada de 2026-11-10 -> inválido
    expect(isDateAvailableForCheckOut('2026-11-07', '2026-11-11', ranges)).toBe(false);
    expect(doesStayOverlapUnavailable('2026-11-07', '2026-11-11', ranges)).toBe(true);
  });

  it('permite estadia exata no intervalo entre duas reservas usando o checkout da primeira e o check-in da segunda', () => {
    // Reserva 1 termina em 2026-11-15; Reserva 2 começa em 2026-11-20.
    // Um novo hóspede pode entrar em 2026-11-15 e sair em 2026-11-20 (5 noites: 15, 16, 17, 18, 19).
    const validation = validateStaySelection({
      checkIn: '2026-11-15',
      checkOut: '2026-11-20',
      guests: 8,
      unavailableRanges: ranges,
      minDate: '2026-11-01',
    });
    expect(validation).toEqual({ valid: true, nights: 5 });
  });

  it('consolida reservas adjacentes ou sobrepostas corretamente', () => {
    const merged = normalizeAndMergeRanges([
      { startDate: '2026-12-10', endDate: '2026-12-15' },
      { startDate: '2026-12-15', endDate: '2026-12-20' },
      { startDate: '2026-12-01', endDate: '2026-12-05' },
    ]);
    expect(merged).toEqual([
      { startDate: '2026-12-01', endDate: '2026-12-05' },
      { startDate: '2026-12-10', endDate: '2026-12-20' },
    ]);
  });

  it('valida estritamente a quantidade de hóspedes entre 1 e 14', () => {
    expect(validateGuestCount(1)).toEqual({ valid: true });
    expect(validateGuestCount(14)).toEqual({ valid: true });
    expect(validateGuestCount(0).valid).toBe(false);
    expect(validateGuestCount(15).valid).toBe(false);
    expect(validateGuestCount(2.5).valid).toBe(false);
  });

  it('rejeita datas inexistentes no calendário e checkout anterior ou igual ao check-in', () => {
    expect(isValidIsoDate('2026-02-29')).toBe(false);
    expect(isValidIsoDate('2026-11-15')).toBe(true);

    const sameDay = validateStaySelection({
      checkIn: '2026-11-05',
      checkOut: '2026-11-05',
      guests: 4,
      unavailableRanges: ranges,
    });
    expect(sameDay.valid).toBe(false);

    const inverted = validateStaySelection({
      checkIn: '2026-11-06',
      checkOut: '2026-11-04',
      guests: 4,
      unavailableRanges: ranges,
    });
    expect(inverted.valid).toBe(false);
  });
});
