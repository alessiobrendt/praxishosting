/**
 * ISO 3166-1 alpha-2 Länderkürzel mit deutschen Ländernamen für Select-Felder.
 * Wert = ISO-Code (z. B. DE), Anzeige = voller Name (z. B. Deutschland).
 */
export const countries: { code: string; name: string }[] = [
    { code: 'AT', name: 'Österreich' },
    { code: 'BE', name: 'Belgien' },
    { code: 'CH', name: 'Schweiz' },
    { code: 'DE', name: 'Deutschland' },
    { code: 'DK', name: 'Dänemark' },
    { code: 'ES', name: 'Spanien' },
    { code: 'FI', name: 'Finnland' },
    { code: 'FR', name: 'Frankreich' },
    { code: 'GB', name: 'Vereinigtes Königreich' },
    { code: 'GR', name: 'Griechenland' },
    { code: 'HR', name: 'Kroatien' },
    { code: 'HU', name: 'Ungarn' },
    { code: 'IE', name: 'Irland' },
    { code: 'IT', name: 'Italien' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LU', name: 'Luxemburg' },
    { code: 'NL', name: 'Niederlande' },
    { code: 'NO', name: 'Norwegen' },
    { code: 'PL', name: 'Polen' },
    { code: 'PT', name: 'Portugal' },
    { code: 'RO', name: 'Rumänien' },
    { code: 'SE', name: 'Schweden' },
    { code: 'SI', name: 'Slowenien' },
    { code: 'SK', name: 'Slowakei' },
    { code: 'CZ', name: 'Tschechien' },
    { code: 'BG', name: 'Bulgarien' },
    { code: 'CY', name: 'Zypern' },
    { code: 'EE', name: 'Estland' },
    { code: 'LV', name: 'Lettland' },
    { code: 'LT', name: 'Litauen' },
    { code: 'MT', name: 'Malta' },
];

/** Sortiert nach deutschem Namen. */
export const countriesSortedByName = [...countries].sort((a, b) =>
    a.name.localeCompare(b.name, 'de'),
);
