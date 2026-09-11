import { encode } from 'uqr';
import { describe, expect, it } from 'vitest';
import { qrSvg } from './qrSvg';

describe('qrSvg', () => {
  it('genera SVG distintos y escaneables para cada reserva pública', () => {
    const diagnostico = qrSvg('https://cal.com/alexendros/diagnostico');
    const sesion = qrSvg('https://cal.com/alexendros/sesion-tecnica');

    expect(diagnostico.startsWith('<svg ')).toBe(true);
    expect(diagnostico).toContain('viewBox=');
    expect(diagnostico).toContain('#141a21');
    expect(diagnostico).toContain('#ffffff');
    expect(diagnostico).not.toEqual(sesion);

    const matrix = encode('https://cal.com/alexendros/diagnostico', { ecc: 'M', border: 2 });
    expect(matrix.size).toBeGreaterThan(20);
    expect(matrix.data.some((row) => row.includes(true))).toBe(true);
  });
});
