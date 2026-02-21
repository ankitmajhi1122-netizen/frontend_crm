import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { useAppSelector } from '../../../app/store/hooks';
import { selectDashboardLeads, selectDashboardDeals } from '../../dashboard/selectors/dashboardSelectors';
import { DESIGN_TOKENS } from '../../../shared/constants/theme';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import PageWrapper from '../../../shared/components/PageWrapper';
import { formatCurrency } from '../../../shared/utils/currencyUtils';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ReportsPage: React.FC = () => {
  const leads = useAppSelector(selectDashboardLeads);
  const deals = useAppSelector(selectDashboardDeals);

  const leadsBySource = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => { map[l.source] = (map[l.source] ?? 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const dealsByStage = useMemo(() => {
    const map: Record<string, number> = {};
    deals.forEach((d) => { map[d.stage] = (map[d.stage] ?? 0) + 1; });
    return Object.entries(map).map(([stage, count]) => ({ stage, count }));
  }, [deals]);

  // Build revenue data from deals grouped by createdAt month — no hardcoded values
  const revenueData = useMemo(() => {
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth: Record<number, number> = {};

    deals.forEach((d) => {
      const m = new Date(d.createdAt).getMonth();
      revenueByMonth[m] = (revenueByMonth[m] ?? 0) + d.revenue;
    });

    const months = Object.keys(revenueByMonth).map(Number).sort((a, b) => a - b);
    if (months.length === 0) return [];

    return months.map((m, i) => {
      const actual = Math.round(revenueByMonth[m]);
      // Forecast is 110% of the previous month's actual (or 110% of current if first month)
      const prevActual = i > 0 ? Math.round(revenueByMonth[months[i - 1]]) : actual;
      return {
        month: MONTH_NAMES[m],
        actual,
        forecast: Math.round(prevActual * 1.1),
      };
    });
  }, [deals]);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BarChart2 size={24} />
        <Typography variant="h5" fontWeight={700}>Reports</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Leads by Source</Typography>
              <ResponsiveContainer width="100%" height={DESIGN_TOKENS.chartHeight}>
                <PieChart>
                  <Pie data={leadsBySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                    {leadsBySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend /><Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Deals by Stage</Typography>
              <ResponsiveContainer width="100%" height={DESIGN_TOKENS.chartHeight}>
                <BarChart data={dealsByStage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" /><YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563EB" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>Revenue: Actual vs Forecast</Typography>
              <ResponsiveContainer width="100%" height={DESIGN_TOKENS.chartHeight}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="actual" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} name="Actual" />
                  <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default ReportsPage;
