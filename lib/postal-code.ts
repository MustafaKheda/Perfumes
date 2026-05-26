const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  AU: /^\d{4}$/,
  CA: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
  IN: /^[1-9]\d{5}$/,
  US: /^\d{5}(-\d{4})?$/,
};

const FALLBACK_POSTAL_CODE_PATTERN = /^[A-Z0-9][A-Z0-9 -]{1,10}[A-Z0-9]$/i;

export function isPostalCodeValid(countryCode: string, postalCode: string) {
  const normalizedCountryCode = countryCode.trim().toUpperCase();
  const normalizedPostalCode = postalCode.trim();
  const pattern = POSTAL_CODE_PATTERNS[normalizedCountryCode];

  return (pattern ?? FALLBACK_POSTAL_CODE_PATTERN).test(normalizedPostalCode);
}
