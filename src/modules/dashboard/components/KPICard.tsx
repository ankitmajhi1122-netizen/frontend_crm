import React from 'react';
import { Card, CardContent, Box, Typography, Stack } from '@mui/material';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DESIGN_TOKENS } from '../../../shared/constants/theme';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  trend?: number; // % change vs prior period, e.g. 12.5 means +12.5%
}

const KPICard: React.FC<KPICardProps> = React.memo(({ title, value, icon, color, delay = 0, trend }) => {
  const hasTrend = trend !== undefined && trend !== null;
  const trendPositive = hasTrend && trend! > 0;
  const trendNeutral = hasTrend && trend! === 0;
  const trendColor = trendNeutral
    ? 'text.secondary'
    : trendPositive
    ? DESIGN_TOKENS.colors.success
    : DESIGN_TOKENS.colors.error;
  const TrendIcon = trendNeutral ? Minus : trendPositive ? TrendingUp : TrendingDown;

  return (
    <Box sx={{
      height: '100%',
      animation: 'kpiFadeIn 0.3s ease-out both',
      animationDelay: `${delay}ms`,
      '@keyframes kpiFadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
    }}>
      <Card sx={{
        borderRadius: DESIGN_TOKENS.cardRadius,
        height: '100%',
        borderLeft: `4px solid ${color}`,
        boxShadow: `0 1px 4px 0 ${color}18`,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 6px 20px 0 ${color}28`,
        },
      }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          {/* Icon + title row */}
          <Stack direction="row" alignItems="center" gap={1.5} mb={1.5}>
            <Box sx={{
              bgcolor: `${color}18`,
              color,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {icon}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              textTransform="uppercase"
              letterSpacing={0.8}
              fontWeight={600}
              lineHeight={1.3}
            >
              {title}
            </Typography>
          </Stack>

          {/* Value */}
          <Typography variant="h4" fontWeight={800} lineHeight={1} mb={1}>
            {value}
          </Typography>

          {/* Trend */}
          {hasTrend && (
            <Stack direction="row" alignItems="center" gap={0.4}>
              <TrendIcon size={12} color={trendColor as string} />
              <Typography variant="caption" sx={{ color: trendColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {trendPositive ? '+' : ''}{trend!.toFixed(1)}% vs last month
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
});

KPICard.displayName = 'KPICard';
export default KPICard;
