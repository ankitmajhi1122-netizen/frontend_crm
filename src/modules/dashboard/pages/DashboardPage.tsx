import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, Users, Handshake, DollarSign, Trophy, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import KPICard from '../components/KPICard';
import RecentActivityFeed from '../components/RecentActivityFeed';
import { formatCurrency } from '../../../shared/utils/currencyUtils';
import { DESIGN_TOKENS } from '../../../shared/constants/theme';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import PageWrapper from '../../../shared/components/PageWrapper';
import { ROUTES } from '../../../shared/constants/routes';

/** Quick action buttons — navigate to key modules */
const QUICK_ACTIONS = [
  { label: 'New Lead',    icon: '👤', color: DESIGN_TOKENS.colors.primary,  route: ROUTES.LEADS },
  { label: 'New Deal',   icon: '🤝', color: DESIGN_TOKENS.colors.success,  route: ROUTES.DEALS },
  { label: 'New Contact',icon: '📋', color: DESIGN_TOKENS.colors.info,     route: ROUTES.CONTACTS },
  { label: 'New Task',   icon: '✅', color: DESIGN_TOKENS.colors.warning,  route: ROUTES.ACTIVITIES },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={700}
        textTransform="uppercase" letterSpacing={0.8} display="block" mb={1.5}>
        Quick Actions
      </Typography>
      <Grid container spacing={1.5}>
        {QUICK_ACTIONS.map((action) => (
          <Grid item xs={6} sm={3} key={action.label}>
            <Box
              onClick={() => navigate(action.route)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                p: 1.2, borderRadius: 2, border: '1px solid', borderColor: 'divider',
                cursor: 'pointer', transition: 'all 0.15s ease',
                '&:hover': { borderColor: action.color, bgcolor: `${action.color}0d`, transform: 'translateY(-1px)' },
              }}
            >
              <Typography fontSize={18} lineHeight={1}>{action.icon}</Typography>
              <Typography variant="body2" fontWeight={600} color={action.color} noWrap>{action.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PIE_COLORS = [
  DESIGN_TOKENS.colors.primary,
  DESIGN_TOKENS.colors.success,
  DESIGN_TOKENS.colors.warning,
  DESIGN_TOKENS.colors.info,
  DESIGN_TOKENS.colors.error,
  '#8B5CF6',
  '#EC4899',
];

const DashboardPage: React.FC = () => {
  const {
    leads, deals, totalRevenue, pipelineValue, conversionRate,
    winRate, avgDealSize,
    dealsByStage, leadsByStatus, kpiTrends, recentActivity,
  } = useDashboardData();

  // Build monthly chart data — group leads and deals by their createdAt month
  const chartData = useMemo(() => {
    const leadsPerMonth: Record<number, number> = {};
    const dealsPerMonth: Record<number, number> = {};

    leads.forEach((l) => {
      const m = new Date(l.createdAt).getMonth();
      leadsPerMonth[m] = (leadsPerMonth[m] ?? 0) + 1;
    });
    deals.forEach((d) => {
      const m = new Date(d.createdAt).getMonth();
      dealsPerMonth[m] = (dealsPerMonth[m] ?? 0) + 1;
    });

    const monthSet = new Set([
      ...Object.keys(leadsPerMonth).map(Number),
      ...Object.keys(dealsPerMonth).map(Number),
    ]);
    const months = Array.from(monthSet).sort((a, b) => a - b);
    if (months.length === 0) months.push(new Date().getMonth());

    return months.map((m) => ({
      month: MONTH_NAMES[m],
      leads: leadsPerMonth[m] ?? 0,
      deals: dealsPerMonth[m] ?? 0,
    }));
  }, [leads, deals]);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Typography variant="h5" fontWeight={700} mb={3}>Dashboard</Typography>

      {/* ── KPI Cards — row 1 ── */}
      <Grid container spacing={2.5} mb={2.5}>
        <Grid item xs={12} sm={4}>
          <KPICard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign size={20} />} color={DESIGN_TOKENS.colors.success} delay={0} trend={kpiTrends.revenue} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPICard title="Total Leads" value={String(leads.length)} icon={<Users size={20} />} color={DESIGN_TOKENS.colors.primary} delay={60} trend={kpiTrends.leads} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPICard title="Pipeline Value" value={formatCurrency(pipelineValue)} icon={<Handshake size={20} />} color={DESIGN_TOKENS.colors.warning} delay={120} trend={kpiTrends.pipeline} />
        </Grid>
      </Grid>

      {/* ── KPI Cards — row 2 ── */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={4}>
          <KPICard title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} icon={<TrendingUp size={20} />} color={DESIGN_TOKENS.colors.info} delay={180} trend={kpiTrends.conversion} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPICard title="Win Rate" value={`${winRate.toFixed(1)}%`} icon={<Trophy size={20} />} color="#8B5CF6" delay={240} trend={kpiTrends.winRate} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPICard title="Avg Deal Size" value={formatCurrency(avgDealSize)} icon={<BarChart2 size={20} />} color="#EC4899" delay={300} trend={kpiTrends.avgDealSize} />
        </Grid>
      </Grid>

      {/* ── Bar + Line charts ── */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderLeft: `4px solid ${DESIGN_TOKENS.colors.primary}`, boxShadow: `0 1px 4px 0 ${DESIGN_TOKENS.colors.primary}18` }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Leads vs Deals (Monthly)</Typography>
              <ResponsiveContainer width="100%" height={DESIGN_TOKENS.chartHeight}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" /><YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" name="Leads" fill={DESIGN_TOKENS.colors.primary} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deals" name="Deals" fill={DESIGN_TOKENS.colors.success} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderLeft: `4px solid ${DESIGN_TOKENS.colors.warning}`, boxShadow: `0 1px 4px 0 ${DESIGN_TOKENS.colors.warning}18` }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Pipeline Trend</Typography>
              <ResponsiveContainer width="100%" height={DESIGN_TOKENS.chartHeight}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" /><YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="deals" name="Deals" stroke={DESIGN_TOKENS.colors.primary} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="leads" name="Leads" stroke={DESIGN_TOKENS.colors.warning} strokeWidth={2} dot={{ r: 4 }} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Quick Actions bar ── */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: DESIGN_TOKENS.cardRadius, borderLeft: `4px solid #8B5CF6`, boxShadow: `0 1px 4px 0 #8B5CF618` }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <QuickActions />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Pie charts + Recent Activity ── */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: DESIGN_TOKENS.cardRadius, borderLeft: `4px solid ${DESIGN_TOKENS.colors.success}`, boxShadow: `0 1px 4px 0 ${DESIGN_TOKENS.colors.success}18` }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Deals by Stage</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={dealsByStage}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={40}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dealsByStage.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} deals`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: DESIGN_TOKENS.cardRadius, borderLeft: `4px solid ${DESIGN_TOKENS.colors.info}`, boxShadow: `0 1px 4px 0 ${DESIGN_TOKENS.colors.info}18` }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Leads by Status</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={leadsByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={40}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {leadsByStatus.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} leads`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <RecentActivityFeed items={recentActivity} />
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default DashboardPage;
