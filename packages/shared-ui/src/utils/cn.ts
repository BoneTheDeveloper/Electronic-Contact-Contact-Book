/**
 * Class name utility for conditional classes
 * Note: For React Native, this provides a similar API
 * but returns an array of style objects or conditionals
 */

export type ClassValue = string | number | boolean | undefined | null | ClassValue[];

function toVal(mix: ClassValue): string {
  if (typeof mix === 'string' || typeof mix === 'number') {
    return String(mix);
  }
  if (!mix) return '';
  const str = Array.isArray(mix)
    ? mix.filter(Boolean).map(toVal).join(' ')
    : '';
  return str;
}

/**
 * Merges multiple class names together
 * Primarily for web/React, but provides API consistency
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).map(toVal).join(' ');
}

/**
 * Conditional style utility for React Native
 * Returns the first truthy style object
 */
export function cs(...styles: (object | false | undefined | null)[]): object {
  return styles.filter((s): s is object => Boolean(s)).reduce((acc, style) => ({ ...acc, ...style }), {});
}
