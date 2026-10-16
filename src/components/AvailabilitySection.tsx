import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Info,
  Loader2,
  MessageCircle,
  Minus,
  Plus,
  RefreshCw,
  Users,
} from 'lucide-react';
import {
  buildAirbnbBookingUrl,
  buildWhatsAppInquiryUrl,
  PROPERTY_CONFIG,
} from '../config/property';
import { fetchAvailability } from '../services/availabilityApi';
import {
  addDays,
  doesStayOverlapUnavailable,
  formatDisplayDatePtBr,
  getFirstBlockedNightAfterCheckIn,
  getTodayIsoInTimezone,
  isDateAvailableForCheckIn,
  isDateAvailableForCheckOut,
  isNightOccupied,
  MAX_GUESTS,
  MIN_GUESTS,
  validateStaySelection,
} from '../shared/dateUtils';
import type { AvailabilityApiResponse, UnavailableRange } from '../shared/types';

const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface MonthGridData {
  year: number;
  month: number; // 0-indexed (0 = Jan)
  days: Array<{
    isoDate: string;
    dayNumber: number;
  } | null>;
}

function buildMonthGrid(year: number, month: number): MonthGridData {
  const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const days: MonthGridData['days'] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    days.push({
      isoDate: `${year}-${mStr}-${dStr}`,
      dayNumber: d,
    });
  }
  return { year, month, days };
}

function formatSyncTimestampPtBr(isoString: string | null): string | null {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Fortaleza',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export interface AvailabilitySectionProps {
  initialData?: AvailabilityApiResponse | null;
  todayOverride?: string;
}

export const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  initialData = null,
  todayOverride,
}) => {
  const todayIso = useMemo(
    () => todayOverride ?? getTodayIsoInTimezone('America/Fortaleza'),
    [todayOverride]
  );

  const [initialYear, initialMonth] = useMemo(() => {
    const [y, m] = todayIso.split('-').map(Number);
    return [y, m - 1];
  }, [todayIso]);

  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth);

  const [apiData, setApiData] = useState<AvailabilityApiResponse | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(4);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const start = todayIso;
      const end = addDays(todayIso, 330);
      const result = await fetchAvailability({ start, end });
      setApiData(result);
    } catch (err) {
      setFetchError(
        err instanceof Error
          ? err.message
          : 'Não foi possível consultar o calendário no momento.'
      );
    } finally {
      setLoading(false);
    }
  }, [todayIso]);

  useEffect(() => {
    if (!initialData) {
      loadAvailability();
    }
  }, [initialData, loadAvailability]);

  const unavailableRanges: UnavailableRange[] = useMemo(
    () => apiData?.unavailableRanges ?? [],
    [apiData]
  );

  const hasReliableData = Boolean(apiData?.hasReliableData && !fetchError);
  const isStale = Boolean(apiData?.isStale);

  // Caso novas datas indisponíveis cheguem e conflitem com a seleção atual, limpa o conflito
  useEffect(() => {
    if (checkIn && checkOut && doesStayOverlapUnavailable(checkIn, checkOut, unavailableRanges)) {
      setCheckOut('');
      setSelectionError(
        'O intervalo selecionado contém noites ocupadas. Por favor, escolha uma nova data de checkout.'
      );
    } else if (checkIn && isNightOccupied(checkIn, unavailableRanges) && !checkOut) {
      setCheckIn('');
      setSelectionError('A data selecionada para check-in está indisponível.');
    }
  }, [checkIn, checkOut, unavailableRanges]);

  const firstMonthGrid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const secondMonthGrid = useMemo(() => {
    const nextDate = new Date(Date.UTC(viewYear, viewMonth + 1, 1));
    return buildMonthGrid(nextDate.getUTCFullYear(), nextDate.getUTCMonth());
  }, [viewYear, viewMonth]);

  const canGoPrevMonth =
    viewYear > initialYear || (viewYear === initialYear && viewMonth > initialMonth);

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    const prev = new Date(Date.UTC(viewYear, viewMonth - 1, 1));
    setViewYear(prev.getUTCFullYear());
    setViewMonth(prev.getUTCMonth());
  };

  const handleNextMonth = () => {
    const next = new Date(Date.UTC(viewYear, viewMonth + 1, 1));
    setViewYear(next.getUTCFullYear());
    setViewMonth(next.getUTCMonth());
  };

  // Primeira noite ocupada após o check-in (pode ser usada apenas como checkout exclusivo)
  const firstBlockedNightAfterCheckIn = useMemo(() => {
    if (!checkIn || checkOut) return null;
    return getFirstBlockedNightAfterCheckIn(checkIn, unavailableRanges);
  }, [checkIn, checkOut, unavailableRanges]);

  const handleDayClick = (isoDate: string) => {
    setSelectionError(null);

    // 1. Se ainda não há check-in, ou se já há check-in e checkout definidos, iniciamos nova seleção de check-in
    if (!checkIn || (checkIn && checkOut)) {
      if (!isDateAvailableForCheckIn(isoDate, unavailableRanges, todayIso)) {
        setSelectionError(
          'Esta data está indisponível para check-in. Selecione uma noite livre.'
        );
        return;
      }
      setCheckIn(isoDate);
      setCheckOut('');
      return;
    }

    // 2. Já existe check-in, e o visitante clicou na mesma data: limpa seleção
    if (isoDate === checkIn) {
      setCheckIn('');
      setCheckOut('');
      return;
    }

    // 3. Se o visitante clicou numa data anterior ao check-in atual:
    // se ela for válida para check-in, atualiza o check-in para essa data
    if (isoDate < checkIn) {
      if (isDateAvailableForCheckIn(isoDate, unavailableRanges, todayIso)) {
        setCheckIn(isoDate);
        setCheckOut('');
      } else {
        setSelectionError('Esta data está indisponível para check-in.');
      }
      return;
    }

    // 4. O visitante clicou em uma data posterior ao check-in -> tenta definir como checkout
    if (isDateAvailableForCheckOut(checkIn, isoDate, unavailableRanges)) {
      setCheckOut(isoDate);
      return;
    }

    // Se o intervalo tem noites ocupadas no meio, mas a data clicada em si está livre para um novo check-in,
    // informa o visitante do bloqueio intermediário.
    setSelectionError(
      'Não é possível selecionar este período pois existem noites reservadas no intervalo.'
    );
  };

  const handleGuestChange = (newGuests: number) => {
    if (Number.isNaN(newGuests)) return;
    if (newGuests < MIN_GUESTS) {
      setGuests(MIN_GUESTS);
      setSelectionError(`O mínimo é de ${MIN_GUESTS} hóspede.`);
      return;
    }
    if (newGuests > MAX_GUESTS) {
      setGuests(MAX_GUESTS);
      setSelectionError(`A capacidade máxima da casa é de ${MAX_GUESTS} hóspedes.`);
      return;
    }
    setSelectionError(null);
    setGuests(newGuests);
  };

  const stayValidation = useMemo(() => {
    if (!checkIn || !checkOut) {
      return { valid: false, nights: 0 };
    }
    return validateStaySelection({
      checkIn,
      checkOut,
      guests,
      unavailableRanges,
      minDate: todayIso,
    });
  }, [checkIn, checkOut, guests, unavailableRanges, todayIso]);

  const syncedAtFormatted = useMemo(
    () => formatSyncTimestampPtBr(apiData?.lastSyncedAt ?? null),
    [apiData?.lastSyncedAt]
  );

  const whatsAppUrl = useMemo(() => {
    if (stayValidation.valid) {
      return buildWhatsAppInquiryUrl({
        checkIn,
        checkOut,
        guests,
        nights: stayValidation.nights,
      });
    }
    return buildWhatsAppInquiryUrl({ guests });
  }, [stayValidation.valid, stayValidation.nights, checkIn, checkOut, guests]);

  const airbnbUrl = useMemo(() => {
    if (stayValidation.valid) {
      return buildAirbnbBookingUrl({ checkIn, checkOut, guests });
    }
    return buildAirbnbBookingUrl({ guests });
  }, [stayValidation.valid, checkIn, checkOut, guests]);

  const renderMonth = (grid: MonthGridData) => (
    <div key={`${grid.year}-${grid.month}`} className="w-full">
      <div className="text-center mb-4">
        <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#1C1917]">
          {MONTH_NAMES_PT[grid.month]} {grid.year}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {WEEKDAYS_PT.map((dayName) => (
          <div
            key={dayName}
            className="text-[0.7rem] uppercase tracking-wider text-[#57534E] font-medium py-1"
          >
            {dayName}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`${MONTH_NAMES_PT[grid.month]} ${grid.year}`}>
        {grid.days.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="h-10 sm:h-11" aria-hidden="true" />;
          }

          const { isoDate, dayNumber } = cell;
          const isPast = isoDate < todayIso;
          const occupiedNight = isNightOccupied(isoDate, unavailableRanges);

          const isSelectedCheckIn = isoDate === checkIn;
          const isSelectedCheckOut = isoDate === checkOut;
          const isInSelectedRange =
            Boolean(checkIn && checkOut && isoDate > checkIn && isoDate < checkOut);

          // Semântica de checkout exclusivo:
          // Quando o visitante já escolheu checkIn e está escolhendo checkOut,
          // a primeira data ocupada após o checkIn (firstBlockedNightAfterCheckIn) PODE ser escolhida como checkout!
          const isCheckoutOnlyCandidate =
            Boolean(checkIn && !checkOut && firstBlockedNightAfterCheckIn === isoDate);

          // Se já escolheu checkIn (e ainda não escolheu checkOut), datas após firstBlockedNightAfterCheckIn ficam bloqueadas
          const isBlockedByIntermediateReservation = Boolean(
            checkIn &&
              !checkOut &&
              firstBlockedNightAfterCheckIn &&
              isoDate > firstBlockedNightAfterCheckIn
          );

          const isDisabled =
            isPast ||
            (occupiedNight && !isCheckoutOnlyCandidate && !isSelectedCheckOut) ||
            isBlockedByIntermediateReservation;

          // Verifica se esta data é um dia de checkout de uma reserva anterior (livre para novo check-in à tarde)
          const isPreviousCheckoutDay =
            !occupiedNight &&
            unavailableRanges.some((r) => r.endDate === isoDate);

          let buttonClasses =
            'relative h-10 sm:h-11 w-full rounded-xs text-xs sm:text-sm font-medium transition-all flex flex-col items-center justify-center ';

          if (isSelectedCheckIn || isSelectedCheckOut) {
            buttonClasses += 'bg-[#132A38] text-[#F6F3EB] font-semibold shadow-xs cursor-pointer';
          } else if (isInSelectedRange) {
            buttonClasses += 'bg-[#132A38]/15 text-[#132A38] cursor-pointer';
          } else if (isPast) {
            buttonClasses += 'text-[#A8A29E] bg-transparent cursor-not-allowed opacity-45';
          } else if (occupiedNight && !isCheckoutOnlyCandidate) {
            buttonClasses +=
              'bg-[#E7E2D8] text-[#78716C] line-through cursor-not-allowed opacity-75';
          } else if (isBlockedByIntermediateReservation) {
            buttonClasses += 'text-[#A8A29E] bg-[#F0ECE1] cursor-not-allowed opacity-50';
          } else if (isCheckoutOnlyCandidate) {
            buttonClasses +=
              'bg-[#EFE9DC] text-[#8C5A32] border border-dashed border-[#8C5A32] hover:bg-[#132A38] hover:text-[#F6F3EB] cursor-pointer';
          } else if (!hasReliableData || isStale) {
            // Quando não há sincronização confiável, não marcamos como "disponível confirmado"
            buttonClasses +=
              'bg-[#FAF8F5] text-[#1C1917] border border-[#E5DEC9] hover:border-[#8C5A32] cursor-pointer';
          } else {
            buttonClasses +=
              'bg-white text-[#1C1917] border border-[#E5DEC9] hover:border-[#132A38] hover:bg-[#F6F3EB] cursor-pointer';
          }

          const statusLabel = isPast
            ? 'Data passada'
            : occupiedNight && !isCheckoutOnlyCandidate
              ? 'Indisponível (reservado)'
              : isCheckoutOnlyCandidate
                ? 'Disponível apenas para checkout até as 12h'
                : !hasReliableData
                  ? 'Disponibilidade sob consulta direta'
                  : isStale
                    ? 'Disponibilidade sujeita a confirmação (dados desatualizados)'
                    : 'Disponível na última sincronização';

          return (
            <button
              key={isoDate}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDayClick(isoDate)}
              data-date={isoDate}
              data-status={
                occupiedNight && !isCheckoutOnlyCandidate
                  ? 'unavailable'
                  : isCheckoutOnlyCandidate
                    ? 'checkout-only'
                    : hasReliableData && !isStale
                      ? 'available'
                      : 'unconfirmed'
              }
              aria-label={`${formatDisplayDatePtBr(isoDate, 'long')} — ${statusLabel}`}
              aria-pressed={isSelectedCheckIn || isSelectedCheckOut}
              className={buttonClasses}
            >
              <span>{dayNumber}</span>
              {isCheckoutOnlyCandidate && (
                <span className="text-[0.55rem] uppercase leading-none tracking-tighter text-[#8C5A32]">
                  Saída
                </span>
              )}
              {!isSelectedCheckIn &&
                !isSelectedCheckOut &&
                !isCheckoutOnlyCandidate &&
                isPreviousCheckoutDay &&
                !isPast && (
                  <span
                    className="w-1 h-1 rounded-full bg-[#8C5A32] mt-0.5"
                    title="Check-in disponível após as 14h"
                  />
                )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section
      id="disponibilidade"
      aria-labelledby="availability-heading"
      className="py-20 sm:py-28 lg:py-32 bg-[#F6F3EB] text-[#1C1917] border-t border-[#DFD6C3]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8C5A32] font-semibold mb-3">
            Disponibilidade & Reserva
          </p>
          <h2
            id="availability-heading"
            className="font-editorial text-3xl sm:text-5xl font-normal leading-[1.12] text-[#1C1917]"
          >
            Planeje seus dias em frente ao mar do Preá.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
            Selecione as datas de entrada e saída e a quantidade de hóspedes para consultar a
            disponibilidade sincronizada com o calendário do Airbnb e iniciar seu atendimento pelos
            canais oficiais.
          </p>
        </div>

        {/* Avisos de Estado de Sincronização (Carregamento / Erro / Não Configurado / Desatualizado) */}
        {loading && (
          <div
            role="status"
            data-testid="calendar-loading"
            className="mb-8 p-4 rounded-sm bg-[#EFE9DC] border border-[#DFD6C3] flex items-center gap-3 text-sm text-[#44403C]"
          >
            <Loader2 className="w-4 h-4 animate-spin text-[#132A38]" aria-hidden="true" />
            <span>Consultando calendário sincronizado de disponibilidade...</span>
          </div>
        )}

        {!loading && (!hasReliableData || isStale || fetchError) && (
          <div
            role="alert"
            data-testid="calendar-unconfirmed-banner"
            className="mb-8 p-5 rounded-sm bg-[#EFE9DC] border-l-4 border-[#8C5A32] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <AlertTriangle
                className="w-5 h-5 text-[#8C5A32] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-sm font-semibold text-[#1C1917]">
                  {fetchError
                    ? 'Não foi possível atualizar o calendário neste instante'
                    : !hasReliableData
                      ? 'Disponibilidade sujeita a confirmação direta'
                      : 'Dados do calendário aguardando nova atualização'}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                  {fetchError ||
                    apiData?.message ||
                    'A disponibilidade online não pode ser apresentada como confirmada no momento. Você ainda pode selecionar as datas desejadas abaixo e consultar diretamente pelo WhatsApp ou Airbnb oficial.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={loadAvailability}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium bg-[#F6F3EB] border border-[#DFD6C3] text-[#1C1917] rounded-xs hover:bg-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tentar novamente</span>
              </button>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium bg-[#132A38] text-[#F6F3EB] rounded-xs hover:bg-[#1C3D52] transition-colors"
              >
                <span>Contato direto</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Coluna Esquerda: Calendário Visual Interativo (7 colunas) */}
          <div className="lg:col-span-7 bg-[#EFE9DC]/65 border border-[#DFD6C3] rounded-sm p-5 sm:p-8">
            {/* Barra de Navegação de Meses */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DFD6C3]">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={!canGoPrevMonth}
                aria-label="Mês anterior"
                className="p-2 rounded-xs border border-[#DFD6C3] bg-[#F6F3EB] text-[#1C1917] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="text-center">
                <span className="text-xs uppercase tracking-[0.18em] text-[#57534E]">
                  {!checkIn
                    ? '1. Selecione a data de check-in'
                    : !checkOut
                      ? '2. Selecione a data de checkout'
                      : 'Período selecionado'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Próximo mês"
                className="p-2 rounded-xs border border-[#DFD6C3] bg-[#F6F3EB] text-[#1C1917] hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Grade de 2 Meses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderMonth(firstMonthGrid)}
              {renderMonth(secondMonthGrid)}
            </div>

            {/* Legenda do Calendário */}
            <div className="mt-8 pt-5 border-t border-[#DFD6C3] flex flex-wrap items-center justify-between gap-4 text-xs text-[#57534E]">
              <div className="flex flex-wrap items-center gap-5">
                {hasReliableData && !isStale ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-xs bg-white border border-[#E5DEC9] inline-block" />
                    <span>Disponível (última sincronização)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-xs bg-[#FAF8F5] border border-[#E5DEC9] inline-block" />
                    <span>Sob consulta direta</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#E7E2D8] inline-block" />
                  <span>Indisponível / Reservado</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#132A38] inline-block" />
                  <span>Selecionado</span>
                </div>
              </div>

              {(checkIn || checkOut) && (
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn('');
                    setCheckOut('');
                    setSelectionError(null);
                  }}
                  className="text-xs font-medium text-[#8C5A32] hover:underline cursor-pointer"
                >
                  Limpar datas
                </button>
              )}
            </div>

            {/* Informação da Última Sincronização */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.72rem] text-[#57534E]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8C5A32]" aria-hidden="true" />
                {syncedAtFormatted ? (
                  <span>
                    Última sincronização com o Airbnb: <strong>{syncedAtFormatted}</strong> (horário do Ceará)
                  </span>
                ) : (
                  <span>
                    Sincronização periódica a cada {apiData?.syncIntervalMinutes ?? 15} minutos
                  </span>
                )}
              </div>
              <span>Check-in após 14h · Checkout até 12h</span>
            </div>
          </div>

          {/* Coluna Direita: Resumo da Consulta, Seletor de Hóspedes e Canais de Conversão (5 colunas) */}
          <div className="lg:col-span-5 bg-[#EFE9DC] border border-[#DFD6C3] rounded-sm p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#8C5A32] font-semibold">
                Resumo da Consulta
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1C1917] mt-1">
                Casa na Areia Preá
              </h3>
              <p className="text-xs text-[#57534E] mt-1">
                Espaço inteiro · 6 suítes · Até 14 hóspedes
              </p>
            </div>

            {/* Campos Visuais de Check-in e Checkout */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#F6F3EB] border border-[#DFD6C3] rounded-xs">
                <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-[#57534E]">
                  Check-in
                </span>
                <span
                  data-testid="selected-checkin"
                  className="mt-1 block text-sm font-medium text-[#1C1917]"
                >
                  {checkIn ? formatDisplayDatePtBr(checkIn, 'short') : 'Selecione no calendário'}
                </span>
              </div>

              <div className="p-3.5 bg-[#F6F3EB] border border-[#DFD6C3] rounded-xs">
                <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-[#57534E]">
                  Checkout
                </span>
                <span
                  data-testid="selected-checkout"
                  className="mt-1 block text-sm font-medium text-[#1C1917]"
                >
                  {checkOut ? formatDisplayDatePtBr(checkOut, 'short') : 'Selecione no calendário'}
                </span>
              </div>
            </div>

            {/* Seletor de Hóspedes (1 a 14) */}
            <div className="p-4 bg-[#F6F3EB] border border-[#DFD6C3] rounded-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#8C5A32]" aria-hidden="true" />
                <div>
                  <label
                    htmlFor="guests-input"
                    className="block text-xs uppercase tracking-wider text-[#57534E]"
                  >
                    Quantidade de Hóspedes
                  </label>
                  <span className="text-xs text-[#57534E]">Máximo de {MAX_GUESTS} pessoas</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGuestChange(guests - 1)}
                  disabled={guests <= MIN_GUESTS}
                  aria-label="Diminuir quantidade de hóspedes"
                  className="w-8 h-8 rounded-xs border border-[#DFD6C3] bg-white text-[#1C1917] flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#EFE9DC] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>

                <input
                  id="guests-input"
                  type="number"
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  value={guests}
                  onChange={(e) => handleGuestChange(Number(e.target.value))}
                  aria-label="Quantidade de hóspedes"
                  className="w-12 text-center text-sm font-semibold text-[#1C1917] bg-transparent focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleGuestChange(guests + 1)}
                  disabled={guests >= MAX_GUESTS}
                  aria-label="Aumentar quantidade de hóspedes"
                  className="w-8 h-8 rounded-xs border border-[#DFD6C3] bg-white text-[#1C1917] flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#EFE9DC] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Mensagem de erro de validação ou confirmação do período */}
            {selectionError && (
              <div
                role="alert"
                data-testid="selection-error"
                className="p-3.5 rounded-xs bg-[#991B1B]/10 border border-[#991B1B]/30 text-xs text-[#7F1D1D] flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{selectionError}</span>
              </div>
            )}

            {stayValidation.valid && (
              <div
                data-testid="stay-summary"
                className="p-4 rounded-xs bg-[#EBF0EC] border border-[#2D4A3E]/25 text-[#1C1917] space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2D4A3E]">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {hasReliableData && !isStale
                      ? 'Período disponível conforme última sincronização'
                      : 'Período selecionado para consulta direta'}
                  </span>
                </div>
                <p className="text-xs text-[#44403C]">
                  {stayValidation.nights}{' '}
                  {stayValidation.nights === 1 ? 'noite selecionada' : 'noites selecionadas'} ·{' '}
                  {guests} {guests === 1 ? 'hóspede' : 'hóspedes'}
                </p>
              </div>
            )}

            {/* Botões de Conversão nos Canais Oficiais */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="whatsapp-cta"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#2D4A3E] text-[#F6F3EB] text-xs uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-[#22382F] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>
                  {stayValidation.valid
                    ? 'Consultar datas pelo WhatsApp'
                    : 'Falar pelo WhatsApp Oficial'}
                </span>
              </a>

              <a
                href={airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="airbnb-cta"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#132A38] text-[#F6F3EB] text-xs uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-[#1C3D52] transition-colors"
              >
                <CalendarIcon className="w-4 h-4" aria-hidden="true" />
                <span>
                  {stayValidation.valid
                    ? 'Continuar reserva no Airbnb'
                    : 'Ver anúncio oficial no Airbnb'}
                </span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <a
                href={PROPERTY_CONFIG.officialLinks.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F6F3EB] border border-[#DFD6C3] text-[#1C1917] text-xs uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-white transition-colors"
              >
                <span>Ver no Booking.com</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>

            {/* Nota de transparência sobre limitações do iCal */}
            <div className="pt-4 border-t border-[#DFD6C3] flex items-start gap-2.5 text-[0.72rem] text-[#57534E] leading-relaxed">
              <Info className="w-4 h-4 text-[#8C5A32] shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                <strong>Nota sobre disponibilidade:</strong> A consulta apresenta os bloqueios
                observados na última sincronização do calendário iCal do Airbnb. Como o feed pode ter
                intervalo de propagação e não processa reservas em tempo real, a confirmação final de
                disponibilidade, tarifas e condições ocorre diretamente no canal oficial escolhido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
