import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';
import { ActivityItem } from '../components/RecentActivityFeed';

const selectAllLeads = (state: RootState) => state.leads.items;
const selectAllDeals = (state: RootState) => state.deals.items;
const selectAllContacts = (state: RootState) => state.contacts.items;
const selectAllTasks = (state: RootState) => state.tasks.items;
const selectTenantId = (state: RootState) => state.tenant.currentTenant?.id ?? '';
const selectUserId = (state: RootState) => state.auth.currentUser?.id ?? '';
const selectUserRole = (state: RootState) => state.auth.currentUser?.role ?? 'SALES';

export const selectDashboardLeads = createSelector(
  [selectAllLeads, selectTenantId, selectUserId, selectUserRole],
  (leads, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(leads, tenantId), userId, role)
);

export const selectDashboardDeals = createSelector(
  [selectAllDeals, selectTenantId, selectUserId, selectUserRole],
  (deals, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(deals, tenantId), userId, role)
);

export const selectDashboardContacts = createSelector(
  [selectAllContacts, selectTenantId, selectUserId, selectUserRole],
  (contacts, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(contacts, tenantId), userId, role)
);

export const selectDashboardTasks = createSelector(
  [selectAllTasks, selectTenantId, selectUserId, selectUserRole],
  (tasks, tenantId, userId, role) =>
    filterByOwnership(filterByTenant(tasks, tenantId), userId, role)
);

export const selectTotalRevenue = createSelector(
  [selectDashboardDeals],
  (deals) => deals.reduce((sum, d) => sum + d.revenue, 0)
);

export const selectPipelineValue = createSelector(
  [selectDashboardDeals],
  (deals) => deals.filter((d) => d.status === 'active').reduce((sum, d) => sum + d.value, 0)
);

export const selectConversionRate = createSelector(
  [selectDashboardLeads, selectDashboardDeals],
  (leads, deals) => {
    if (leads.length === 0) return 0;
    return (deals.filter((d) => d.status === 'won').length / leads.length) * 100;
  }
);

// ── Win Rate: % of closed deals that are won ──────────────────────────────────
export const selectWinRate = createSelector(
  [selectDashboardDeals],
  (deals) => {
    const closed = deals.filter((d) => d.status === 'won' || d.status === 'lost');
    if (closed.length === 0) return 0;
    return (deals.filter((d) => d.status === 'won').length / closed.length) * 100;
  }
);

// ── Avg Deal Size: mean value of all won deals ────────────────────────────────
export const selectAvgDealSize = createSelector(
  [selectDashboardDeals],
  (deals) => {
    const won = deals.filter((d) => d.status === 'won');
    if (won.length === 0) return 0;
    return won.reduce((sum, d) => sum + d.value, 0) / won.length;
  }
);

// ── Pie chart: deals grouped by stage ────────────────────────────────────────
export const selectDealsByStage = createSelector(
  [selectDashboardDeals],
  (deals) => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => {
      counts[d.stage] = (counts[d.stage] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }
);

// ── Pie chart: leads grouped by status ───────────────────────────────────────
export const selectLeadsByStatus = createSelector(
  [selectDashboardLeads],
  (leads) => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }
);

// ── KPI trends: % change vs the previous calendar month ──────────────────────
function splitByMonth<T extends { createdAt: string }>(
  items: T[]
): { current: T[]; previous: T[] } {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();
  const prevYear = curMonth === 0 ? curYear - 1 : curYear;
  const prevMonth = curMonth === 0 ? 11 : curMonth - 1;

  const current: T[] = [];
  const previous: T[] = [];
  items.forEach((item) => {
    const d = new Date(item.createdAt);
    if (d.getFullYear() === curYear && d.getMonth() === curMonth) current.push(item);
    else if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) previous.push(item);
  });
  return { current, previous };
}

function pctChange(cur: number, prev: number): number {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return ((cur - prev) / prev) * 100;
}

export const selectKPITrends = createSelector(
  [selectDashboardLeads, selectDashboardDeals],
  (leads, deals) => {
    const { current: curLeads, previous: prevLeads } = splitByMonth(leads);
    const { current: curDeals, previous: prevDeals } = splitByMonth(deals);

    const curRevenue = curDeals.reduce((s, d) => s + d.revenue, 0);
    const prevRevenue = prevDeals.reduce((s, d) => s + d.revenue, 0);

    const curPipeline = curDeals.filter((d) => d.status === 'active').reduce((s, d) => s + d.value, 0);
    const prevPipeline = prevDeals.filter((d) => d.status === 'active').reduce((s, d) => s + d.value, 0);

    const curConv = leads.length ? (curDeals.filter((d) => d.status === 'won').length / leads.length) * 100 : 0;
    const prevConv = leads.length ? (prevDeals.filter((d) => d.status === 'won').length / leads.length) * 100 : 0;

    // Win rate trend
    const curClosed = curDeals.filter((d) => d.status === 'won' || d.status === 'lost');
    const prevClosed = prevDeals.filter((d) => d.status === 'won' || d.status === 'lost');
    const curWinRate = curClosed.length ? (curDeals.filter((d) => d.status === 'won').length / curClosed.length) * 100 : 0;
    const prevWinRate = prevClosed.length ? (prevDeals.filter((d) => d.status === 'won').length / prevClosed.length) * 100 : 0;

    // Avg deal size trend (won deals)
    const curWon = curDeals.filter((d) => d.status === 'won');
    const prevWon = prevDeals.filter((d) => d.status === 'won');
    const curAvg = curWon.length ? curWon.reduce((s, d) => s + d.value, 0) / curWon.length : 0;
    const prevAvg = prevWon.length ? prevWon.reduce((s, d) => s + d.value, 0) / prevWon.length : 0;

    return {
      revenue: pctChange(curRevenue, prevRevenue),
      leads: pctChange(curLeads.length, prevLeads.length),
      pipeline: pctChange(curPipeline, prevPipeline),
      conversion: pctChange(curConv, prevConv),
      winRate: pctChange(curWinRate, prevWinRate),
      avgDealSize: pctChange(curAvg, prevAvg),
    };
  }
);

// ── Recent activity feed: last 8 items across leads/deals/contacts/tasks ─────
export const selectRecentActivity = createSelector(
  [selectDashboardLeads, selectDashboardDeals, selectDashboardContacts, selectDashboardTasks],
  (leads, deals, contacts, tasks): ActivityItem[] => {
    const items: ActivityItem[] = [
      ...leads.map((l) => ({
        id: l.id,
        type: 'lead' as const,
        label: l.name,
        sub: `${l.company} · ${l.status}`,
        time: l.createdAt,
      })),
      ...deals.map((d) => ({
        id: d.id,
        type: 'deal' as const,
        label: d.title,
        sub: `Stage: ${d.stage}`,
        time: d.createdAt,
      })),
      ...contacts.map((c) => ({
        id: c.id,
        type: 'contact' as const,
        label: `${c.firstName} ${c.lastName}`,
        sub: c.company,
        time: c.createdAt,
      })),
      ...tasks.map((t) => ({
        id: t.id,
        type: 'task' as const,
        label: t.title,
        sub: `Priority: ${t.priority}`,
        time: t.createdAt,
      })),
    ];

    return items
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  }
);
