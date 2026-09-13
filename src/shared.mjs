export const SETTINGS_NAMESPACE = 'done-whale';
export const DEFAULT_GREEN = '#22C55E';
export const DEFAULT_AMBER = '#F59E0B';
export const HEX = /^#[0-9a-fA-F]{6}$/;

export function colorsOf(value = {}) {
  const color = (key, fallback) => HEX.test(value[key]) ? value[key] : fallback;
  return {
    green: color('green', DEFAULT_GREEN),
    amber: color('amber', DEFAULT_AMBER),
    black: color('black', undefined),
  };
}
