import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { InputBase, Box, Paper, List, ListItemButton, ListItemText, Chip, Typography, Divider } from '@mui/material';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store/hooks';
import { selectCurrentUser } from '../../auth/authSelectors';
import { selectCurrentTenant, selectTenantFeatures } from '../../multi-tenant/tenantSelectors';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { filterByTenant, filterByOwnership } from '../../shared/utils/filterUtils';
import { ROUTES } from '../../shared/constants/routes';

type ChipColor = 'primary' | 'success' | 'warning' | 'default' | 'error' | 'info' | 'secondary';

interface SearchResult {
  label: string;
  sub: string;
  id: string;
  route: string;
  color: ChipColor;
  module: string;
}

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const user = useAppSelector(selectCurrentUser);
  const tenant = useAppSelector(selectCurrentTenant);
  const features = useAppSelector(selectTenantFeatures);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Read all data from live Redux store — picks up newly created records
  const allLeads     = useAppSelector((s) => s.leads.items);
  const allContacts  = useAppSelector((s) => s.contacts.items);
  const allDeals     = useAppSelector((s) => s.deals.items);
  const allTasks     = useAppSelector((s) => s.tasks.items);
  const allAccounts  = useAppSelector((s) => s.accounts.items);
  const allCampaigns = useAppSelector((s) => s.campaigns.items);
  const allProducts  = useAppSelector((s) => s.products.items);

  const results = useMemo<SearchResult[]>(() => {
    if (!debouncedQuery.trim() || !tenant || !user) return [];
    const q = debouncedQuery.toLowerCase();

    const tenantLeads     = filterByOwnership(filterByTenant(allLeads,     tenant.id), user.id, user.role);
    const tenantContacts  = filterByOwnership(filterByTenant(allContacts,  tenant.id), user.id, user.role);
    const tenantDeals     = filterByOwnership(filterByTenant(allDeals,     tenant.id), user.id, user.role);
    const tenantTasks     = filterByOwnership(filterByTenant(allTasks,     tenant.id), user.id, user.role);
    const tenantAccounts  = filterByOwnership(filterByTenant(allAccounts,  tenant.id), user.id, user.role);
    const tenantCampaigns = filterByTenant(allCampaigns, tenant.id);
    const tenantProducts  = filterByTenant(allProducts,  tenant.id);

    const hits: SearchResult[] = [];

    if (features.includes('leads')) {
      tenantLeads
        .filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company.toLowerCase().includes(q))
        .forEach((l) => hits.push({ label: l.name, sub: `${l.company} · ${l.status}`, id: l.id, route: ROUTES.LEADS, color: 'primary', module: 'Leads' }));
    }

    if (features.includes('contacts')) {
      tenantContacts
        .filter((c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q))
        .forEach((c) => hits.push({ label: `${c.firstName} ${c.lastName}`, sub: `${c.company} · Contact`, id: c.id, route: ROUTES.CONTACTS, color: 'default', module: 'Contacts' }));
    }

    if (features.includes('deals')) {
      tenantDeals
        .filter((d) => d.title.toLowerCase().includes(q) || d.stage.toLowerCase().includes(q))
        .forEach((d) => hits.push({ label: d.title, sub: `Stage: ${d.stage}`, id: d.id, route: ROUTES.DEALS, color: 'success', module: 'Deals' }));
    }

    if (features.includes('accounts')) {
      tenantAccounts
        .filter((a) => a.name.toLowerCase().includes(q) || a.industry.toLowerCase().includes(q))
        .forEach((a) => hits.push({ label: a.name, sub: `${a.industry} · Account`, id: a.id, route: ROUTES.ACCOUNTS, color: 'secondary', module: 'Accounts' }));
    }

    if (features.includes('campaigns') && (user.role === 'ADMIN' || user.role === 'MANAGER')) {
      tenantCampaigns
        .filter((c) => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q))
        .forEach((c) => hits.push({ label: c.name, sub: `${c.type} · ${c.status}`, id: c.id, route: ROUTES.CAMPAIGNS, color: 'warning', module: 'Campaigns' }));
    }

    if (features.includes('products') && (user.role === 'ADMIN' || user.role === 'MANAGER')) {
      tenantProducts
        .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
        .forEach((p) => hits.push({ label: p.name, sub: `${p.category} · $${p.price}`, id: p.id, route: ROUTES.PRODUCTS, color: 'info', module: 'Products' }));
    }

    if (features.includes('activities')) {
      tenantTasks
        .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
        .forEach((t) => hits.push({ label: t.title, sub: `Priority: ${t.priority}`, id: t.id, route: ROUTES.ACTIVITIES, color: 'error', module: 'Tasks' }));
    }

    return hits.slice(0, 12);
  }, [debouncedQuery, tenant, user, features, allLeads, allContacts, allDeals, allTasks, allAccounts, allCampaigns, allProducts]);

  // Reset active index whenever results change
  useEffect(() => {
    setActiveIndex(-1);
    itemRefs.current = itemRefs.current.slice(0, results.length);
  }, [results]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Group results by module for section headers
  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!map[r.module]) map[r.module] = [];
      map[r.module].push(r);
    });
    return map;
  }, [results]);

  const handleSelect = useCallback((route: string) => {
    navigate(route);
    setQuery('');
    setFocused(false);
    setActiveIndex(-1);
  }, [navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focused || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex].route);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuery('');
        setFocused(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  }, [focused, results, activeIndex, handleSelect]);

  const handleBlur = useCallback(() => setTimeout(() => {
    setFocused(false);
    setActiveIndex(-1);
  }, 200), []);

  // Flat index for keyboard tracking — maps flat index → result
  // (needed because results are displayed grouped but indexed flat)
  const flatResults = results; // already flat, grouped is only for display

  return (
    <Box sx={{ position: 'relative', width: 360 }}>
      <Box sx={{
        display: 'flex', alignItems: 'center',
        bgcolor: 'action.hover', borderRadius: 2, px: 1.5, py: 0.5,
        outline: focused ? `2px solid` : 'none',
        outlineColor: 'primary.main',
        transition: 'outline 0.15s',
      }}>
        <Search size={16} />
        <InputBase
          inputRef={inputRef}
          placeholder="Search leads, deals, contacts, accounts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          inputProps={{ 'aria-label': 'global search', 'aria-autocomplete': 'list', 'aria-expanded': focused && results.length > 0, role: 'combobox' }}
          sx={{ ml: 1, flex: 1, fontSize: 14 }}
        />
        {query && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: 10, whiteSpace: 'nowrap', ml: 1, userSelect: 'none' }}
          >
            ↑↓ navigate · ↵ open · esc close
          </Typography>
        )}
      </Box>

      {focused && results.length > 0 && (
        <Paper
          elevation={8}
          sx={{ position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 1400, maxHeight: 400, overflowY: 'auto', borderRadius: 2 }}
          role="listbox"
        >
          <List ref={listRef} dense disablePadding>
            {Object.entries(grouped).map(([module, items], gIdx) => {
              // Calculate the flat offset for this group so we can map to activeIndex
              const groupOffset = flatResults.findIndex((r) => r.module === module);
              return (
                <Box key={module}>
                  {gIdx > 0 && <Divider />}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ px: 2, pt: 1, pb: 0.5, display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 10 }}
                  >
                    {module}
                  </Typography>
                  {items.map((r, itemIdx) => {
                    const flatIdx = groupOffset + itemIdx;
                    const isActive = flatIdx === activeIndex;
                    return (
                      <ListItemButton
                        key={`${r.id}-${r.module}`}
                        ref={(el) => { itemRefs.current[flatIdx] = el; }}
                        onClick={() => handleSelect(r.route)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        selected={isActive}
                        role="option"
                        aria-selected={isActive}
                        sx={{
                          px: 2, py: 0.75,
                          bgcolor: isActive ? 'action.selected' : 'transparent',
                          '&.Mui-selected': { bgcolor: 'action.selected' },
                          '&.Mui-selected:hover': { bgcolor: 'action.selected' },
                        }}
                      >
                        <ListItemText
                          primary={r.label}
                          secondary={r.sub}
                          primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}
                          secondaryTypographyProps={{ fontSize: 11 }}
                        />
                        <Chip label={r.module} size="small" color={r.color} sx={{ ml: 1, height: 18, fontSize: 10 }} />
                      </ListItemButton>
                    );
                  })}
                </Box>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default GlobalSearch;
