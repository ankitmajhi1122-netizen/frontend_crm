import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppSelector } from '../../../app/store/hooks';
import { selectDashboardDeals } from '../../dashboard/selectors/dashboardSelectors';
import { formatCurrency } from '../../../shared/utils/currencyUtils';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import PageWrapper from '../../../shared/components/PageWrapper';
import { DESIGN_TOKENS } from '../../../shared/constants/theme';

const ForecastingPage: React.FC = () => {
  const deals = useAppSelector(selectDashboardDeals);

  const totalPipeline = useMemo(() => deals.reduce((s, d) => s + d.value, 0), [deals]);
  const weightedPipeline = useMemo(() => deals.reduce((s, d) => s + (d.value * d.probability) / 100, 0), [deals]);
  const wonRevenue = useMemo(() => deals.filter((d) => d.status === 'won').reduce((s, d) => s + d.revenue, 0), [deals]);

  // Build forecast data from deals — group by closeDate month, then project forward
  const forecastData = useMemo(() => {
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Group pipeline and weighted values by close month from actual deal data
    const pipelineByMonth: Record<number, number> = {};
    const weightedByMonth: Record<number, number> = {};

    deals.forEach((d) => {
      const m = new Date(d.closeDate).getMonth();
      pipelineByMonth[m] = (pipelineByMonth[m] ?? 0) + d.value;
      weightedByMonth[m] = (weightedByMonth[m] ?? 0) + (d.value * d.probability) / 100;
    });

    const months = Array.from(
      new Set([...Object.keys(pipelineByMonth).map(Number), ...Object.keys(weightedByMonth).map(Number)])
    ).sort((a, b) => a - b);

    const historical = months.map((m) => ({
      month: MONTH_NAMES[m],
      pipeline: Math.round(pipelineByMonth[m] ?? 0),
      weighted: Math.round(weightedByMonth[m] ?? 0),
    }));

    // Append a Q4 estimate as projection (20% growth over total)
    return [
      ...historical,
      { month: 'Q4 Est', pipeline: Math.round(totalPipeline * 1.2), weighted: Math.round(weightedPipeline * 1.15) },
    ];
  }, [deals, totalPipeline, weightedPipeline]);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TrendingUp size={24} />
        <Typography variant="h5" fontWeight={700}>Forecasting</Typography>
      </Box>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">Total Pipeline</Typography>
              <Typography variant="h4" fontWeight={700} color="primary">{formatCurrency(totalPipeline)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">Weighted Forecast</Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">{formatCurrency(weightedPipeline)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">Won Revenue</Typography>
              <Typography variant="h4" fontWeight={700} color="warning.main">{formatCurrency(wonRevenue)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>Revenue Forecast</Typography>
          <ResponsiveContainer width="100%" height={DESIGN_TOKENS.chartHeight}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="pipeline" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} name="Pipeline" />
              <Area type="monotone" dataKey="weighted" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} name="Weighted" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

export default ForecastingPage;
