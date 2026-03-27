/**
 * Safely parse JSON with comprehensive error handling
 * Returns null if parsing fails or if the value is invalid
 */
export function safeJsonParse<T = any>(value: string | null | undefined): T | null {
  try {
    if (!value || typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();

    if (
      !trimmed ||
      trimmed === 'null' ||
      trimmed === 'undefined' ||
      trimmed === 'NaN' ||
      trimmed === '[object Object]' ||
      trimmed === '[object Array]' ||
      trimmed.startsWith('object') ||
      trimmed.includes('[object') ||
      /^\[object\s/.test(trimmed)
    ) {
      console.warn('[safeJsonParse] Invalid stored value, skipping parse:', trimmed.substring(0, 50));
      return null;
    }

    if (trimmed === '{}' || trimmed === '[]') {
      return null;
    }

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"')) {
      console.warn('[safeJsonParse] Value does not look like JSON, skipping parse:', trimmed.substring(0, 50));
      return null;
    }

    if (trimmed.includes('NaN') || trimmed.includes('undefined')) {
      console.warn('[safeJsonParse] Value contains invalid JavaScript values');
      return null;
    }

    const parsed = JSON.parse(trimmed);
    
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 0) {
      console.warn('[safeJsonParse] Parsed to empty object/array');
      return null;
    }
    
    return parsed;
  } catch (error: any) {
    console.error('[safeJsonParse] Parse error:', error?.message || error);
    console.log('[safeJsonParse] Problematic value:', value?.substring(0, 100));
    return null;
  }
}

/**
 * Safely stringify JSON with NaN/Infinity replacement
 * Returns empty string if stringification fails
 */
export function safeJsonStringify(value: any): string {
  try {
    if (value === null || value === undefined) {
      return '';
    }

    const jsonString = JSON.stringify(value, (key, val) => {
      if (val !== val) return null;
      if (val === Infinity || val === -Infinity) return null;
      if (typeof val === 'number' && !isFinite(val)) return null;
      return val;
    });

    if (
      !jsonString ||
      jsonString === 'undefined' ||
      jsonString === 'null' ||
      jsonString === 'NaN' ||
      jsonString.includes('NaN')
    ) {
      console.error('[safeJsonStringify] Invalid JSON string generated');
      return '';
    }

    return jsonString;
  } catch (error) {
    console.error('[safeJsonStringify] Stringify error:', error);
    return '';
  }
}
