import React from 'react';
import {
  Drawer, Box, Typography, IconButton, Divider, Chip,
} from '@mui/material';
import { X } from 'lucide-react';

interface DetailField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  status?: string;
  statusColor?: string;
  fields: DetailField[];
  actions?: React.ReactNode;
  width?: number;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open, onClose, title, subtitle, avatar, status, statusColor, fields, actions, width = 400,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        },
      }}
      disableScrollLock
    >
      {/* Header */}
      <Box sx={{
        p: 2.5, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          {avatar && (
            <Box sx={{ flexShrink: 0 }}>{avatar}</Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} noWrap>{title}</Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" noWrap>{subtitle}</Typography>
            )}
            {status && (
              <Chip
                label={status}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: statusColor ? `${statusColor}22` : 'action.hover',
                  color: statusColor ?? 'text.primary',
                  fontWeight: 600, fontSize: 11,
                }}
              />
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ ml: 1, flexShrink: 0 }}>
          <X size={18} />
        </IconButton>
      </Box>

      {/* Fields */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2.5 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
          {fields.map((field, i) => (
            <Box
              key={i}
              sx={{
                width: field.fullWidth ? '100%' : '50%',
                pr: field.fullWidth ? 0 : (i % 2 === 0 ? 1 : 0),
                mb: 2.5,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}
                textTransform="uppercase" letterSpacing={0.5} display="block" mb={0.5}>
                {field.label}
              </Typography>
              {typeof field.value === 'string' || typeof field.value === 'number' ? (
                <Typography variant="body2" fontWeight={500}>{field.value || '—'}</Typography>
              ) : (
                field.value ?? <Typography variant="body2" color="text.secondary">—</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Actions */}
      {actions && (
        <>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {actions}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default DetailDrawer;
