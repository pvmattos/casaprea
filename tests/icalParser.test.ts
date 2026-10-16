import { describe, expect, it } from 'vitest';
import {
  InvalidIcalFeedError,
  parseIcalDateValue,
  parseIcalFeed,
  unfoldIcalLines,
} from '../src/worker/ical/parser';

describe('iCal Parser (RFC 5545 & Airbnb iCal semantics)', () => {
  it('interpreta eventos de dia inteiro (VALUE=DATE) sem deslocamento de fuso horário', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Airbnb Inc//Hosting Calendar 0.8.8//EN',
      'BEGIN:VEVENT',
      'DTEND;VALUE=DATE:20261115',
      'DTSTART;VALUE=DATE:20261110',
      'UID:airbnb-res-001@airbnb.com',
      'SUMMARY:Reserved',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const result = parseIcalFeed(ics, 'America/Fortaleza');
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      uid: 'airbnb-res-001@airbnb.com',
      summary: 'Reserved',
      startDate: '2026-11-10',
      endDate: '2026-11-15',
      isAllDay: true,
    });
    expect(result.unavailableRanges).toEqual([
      { startDate: '2026-11-10', endDate: '2026-11-15' },
    ]);
  });

  it('interpreta corretamente eventos com fuso horário UTC (Z) e TZID sem deslocar datas indevidamente', () => {
    // 2026-12-20T17:00:00Z = 2026-12-20 14:00:00 em America/Fortaleza (UTC-3)
    // 2026-12-26T15:00:00Z = 2026-12-26 12:00:00 em America/Fortaleza (UTC-3)
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:20261220T170000Z',
      'DTEND:20261226T150000Z',
      'UID:utc-event-1',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;TZID=America/Fortaleza:20270105T140000',
      'DTEND;TZID=America/Fortaleza:20270110T120000',
      'UID:tzid-event-2',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const result = parseIcalFeed(ics, 'America/Fortaleza');
    expect(result.unavailableRanges).toEqual([
      { startDate: '2026-12-20', endDate: '2026-12-26' },
      { startDate: '2027-01-05', endDate: '2027-01-10' },
    ]);
  });

  it('converte timestamp UTC próximo à meia-noite corretamente para o fuso America/Fortaleza', () => {
    // 2026-11-10T01:30:00Z corresponde a 2026-11-09 22:30:00 em Fortaleza (UTC-3)
    const parsed = parseIcalDateValue('20261110T013000Z', {}, 'America/Fortaleza');
    expect(parsed).toEqual({
      isoDate: '2026-11-09',
      isAllDay: false,
    });
  });

  it('desdobra linhas continuadas (line folding RFC 5545) e suporta eventos sem campos opcionais', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:2026',
      ' 1120',
      'DTEND;VALUE=DATE:202611',
      '\t25',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const lines = unfoldIcalLines(ics);
    expect(lines).toContain('DTSTART;VALUE=DATE:20261120');
    expect(lines).toContain('DTEND;VALUE=DATE:20261125');

    const result = parseIcalFeed(ics);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].uid).toBeUndefined();
    expect(result.events[0].summary).toBeUndefined();
    expect(result.unavailableRanges).toEqual([
      { startDate: '2026-11-20', endDate: '2026-11-25' },
    ]);
  });

  it('ignora eventos com STATUS:CANCELLED ou TRANSP:TRANSPARENT', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261101',
      'DTEND;VALUE=DATE:20261105',
      'STATUS:CANCELLED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261110',
      'DTEND;VALUE=DATE:20261112',
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261115',
      'DTEND;VALUE=DATE:20261118',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const result = parseIcalFeed(ics);
    expect(result.events).toHaveLength(1);
    expect(result.unavailableRanges).toEqual([
      { startDate: '2026-11-15', endDate: '2026-11-18' },
    ]);
  });

  it('suporta eventos de dia inteiro sem DTEND assumindo 1 noite (RFC 5545) ou usando DURATION', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261102',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261110',
      'DURATION:P3D',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const result = parseIcalFeed(ics);
    expect(result.unavailableRanges).toEqual([
      { startDate: '2026-11-02', endDate: '2026-11-03' },
      { startDate: '2026-11-10', endDate: '2026-11-13' },
    ]);
  });

  it('rejeita feeds malformados, truncados ou páginas HTML com InvalidIcalFeedError', () => {
    expect(() => parseIcalFeed('')).toThrow(InvalidIcalFeedError);
    expect(() => parseIcalFeed('<html><body>Erro 500</body></html>')).toThrow(
      InvalidIcalFeedError
    );
    expect(() =>
      parseIcalFeed('BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20261110\nEND:VCALENDAR')
    ).toThrow(InvalidIcalFeedError);
  });
});
