import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Divider, Chip } from '@mui/material';
import { UserPlus, Handshake, Users, CheckSquare } from 'lucide-react';
import { DESIGN_TOKENS } from '../../../shared/constants/theme';

export interface ActivityItem {
  id: string;
  type: 'lead' | 'deal' | 'contact' | 'task';
  label: string;
  sub: string;
  time: string; // ISO string
}

const TYPE_CONFIG: Record<ActivityItem['type'], { icon: React.ReactNode; color: string; chipLabel: string }> = {
  lead:    { icon: <UserPlus size={15} />,    color: DESIGN_TOKENS.colors.primary,  chipLabel: 'Lead'    },
  deal:    { icon: <Handshake size={15} />,   color: DESIGN_TOKENS.colors.success,  chipLabel: 'Deal'    },
  contact: { icon: <Users size={15} />,       color: DESIGN_TOKENS.colors.info,     chipLabel: 'Contact' },
  task:    { icon: <CheckSquare size={15} />, color: DESIGN_TOKENS.colors.warning,  chipLabel: 'Task'    },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface RecentActivityFeedProps {
  items: ActivityItem[];
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ items }) => {
  return (
    <Card sx={{ borderRadius: DESIGN_TOKENS.cardRadius, height: '100%', borderLeft: `4px solid ${DESIGN_TOKENS.colors.warning}`, boxShadow: `0 1px 4px 0 ${DESIGN_TOKENS.colors.warning}18` }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>Recent Activity</Typography>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
        ) : (
          <Box>
            {items.map((item, idx) => {
              const cfg = TYPE_CONFIG[item.type];
              return (
                <Box key={item.id}>
                  <Stack direction="row" alignItems="center" gap={1.5} py={1.2}>
                    <Box sx={{
                      bgcolor: `${cfg.color}20`,
                      color: cfg.color,
                      borderRadius: '50%',
                      width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {cfg.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>{item.sub}</Typography>
                    </Box>
                    <Stack alignItems="flex-end" gap={0.5} flexShrink={0}>
                      <Chip label={cfg.chipLabel} size="small" sx={{ height: 18, fontSize: 10, bgcolor: `${cfg.color}18`, color: cfg.color, fontWeight: 600 }} />
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>{timeAgo(item.time)}</Typography>
                    </Stack>
                  </Stack>
                  {idx < items.length - 1 && <Divider />}
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
