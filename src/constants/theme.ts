export const FLASH_COLORS = {
  up: 'rgba(34, 197, 94, 0.25)',
  down: 'rgba(239, 68, 68, 0.25)',
} as const;

export const TEXT_COLORS = {
  positive: 'teal',
  negative: 'red',
} as const;

export const FLASH_DURATION_MS = 800;
export const POLLING_INTERVAL_MS = 30000;
export const CHART_LINE_COLOR = '#2f9e44';
export const TABLE_ROWS_PER_PAGE = 20;

export const FOCUS_SHADOW = '0 0 0 3px rgba(47, 158, 68, 0.25)';

export const CHART_HEIGHT = 300;
export const CHART_MARGIN = { top: 10, right: 30, left: 0, bottom: 0 };
export const CHART_STROKE_WIDTH = 2;

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
};
