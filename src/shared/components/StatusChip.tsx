import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  label: string;
  colorMap?: Record<string, ChipProps['color']>;
}

const DEFAULT_COLOR_MAP: Record<string, ChipProps['color']> = {
  active: 'success', inactive: 'default', new: 'primary', contacted: 'default',
  qualified: 'success', disqualified: 'error', open: 'primary', in_progress: 'warning',
  done: 'success', high: 'error', medium: 'warning', low: 'default',
  won: 'success', lost: 'error', paid: 'success', pending: 'warning', overdue: 'error',
};

const StatusChip: React.FC<StatusChipProps> = React.memo(({ label, colorMap }) => {
  const map = colorMap ?? DEFAULT_COLOR_MAP;
  const color: ChipProps['color'] = map[label] ?? 'default';
  return <Chip label={label} size="small" color={color} />;
});

StatusChip.displayName = 'StatusChip';
export default StatusChip;
