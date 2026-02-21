import { useAppSelector } from '../../../app/store/hooks';
import {
  selectDashboardLeads,
  selectDashboardDeals,
  selectTotalRevenue,
  selectPipelineValue,
  selectConversionRate,
  selectWinRate,
  selectAvgDealSize,
  selectDealsByStage,
  selectLeadsByStatus,
  selectKPITrends,
  selectRecentActivity,
} from '../selectors/dashboardSelectors';

export function useDashboardData() {
  const leads = useAppSelector(selectDashboardLeads);
  const deals = useAppSelector(selectDashboardDeals);
  const totalRevenue = useAppSelector(selectTotalRevenue);
  const pipelineValue = useAppSelector(selectPipelineValue);
  const conversionRate = useAppSelector(selectConversionRate);
  const winRate = useAppSelector(selectWinRate);
  const avgDealSize = useAppSelector(selectAvgDealSize);
  const dealsByStage = useAppSelector(selectDealsByStage);
  const leadsByStatus = useAppSelector(selectLeadsByStatus);
  const kpiTrends = useAppSelector(selectKPITrends);
  const recentActivity = useAppSelector(selectRecentActivity);

  return { leads, deals, totalRevenue, pipelineValue, conversionRate, winRate, avgDealSize, dealsByStage, leadsByStatus, kpiTrends, recentActivity };
}
