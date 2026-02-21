import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, LinearProgress, Chip,
  TextField, InputAdornment, Button, Avatar, IconButton, Tooltip,
} from '@mui/material';
import { Search, Plus, Megaphone, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import CampaignFormModal from '../components/CampaignFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import { useFieldAccess } from '../../../shared/hooks/usePermission';
import { formatCurrency } from '../../../shared/utils/currencyUtils';
import { formatDate } from '../../../shared/utils/dateUtils';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import PageWrapper from '../../../shared/components/PageWrapper';
import StatusChip from '../../../shared/components/StatusChip';
import EmptyState from '../../../shared/components/EmptyState';
import WithPermission from '../../../core/role-access/withPermission';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import { Campaign } from '../../../shared/types';
import { CampaignFormData } from '../types';

const TYPE_COLORS: Record<string, string> = {
  Email: '#2563EB', Social: '#7C3AED', Event: '#059669', Referral: '#F59E0B', Other: '#6B7280',
};

interface CampaignCardProps {
  campaign: Campaign;
  canSeeBudget: boolean;
  onEdit: (c: Campaign) => void;
  onDelete: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = React.memo(({ campaign: c, canSeeBudget, onEdit, onDelete }) => {
  const convRate = c.leads > 0 ? ((c.converted / c.leads) * 100).toFixed(1) : '0.0';
  const budgetPct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;
  const color = TYPE_COLORS[c.type] ?? '#6B7280';
  return (
    <Card sx={{ height: '100%', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: `${color}22` }}>
              <Megaphone size={18} color={color} />
            </Avatar>
            <Box>
              <Typography fontWeight={700} fontSize={14} noWrap>{c.name}</Typography>
              <Chip label={c.type} size="small" sx={{ height: 18, fontSize: 10, bgcolor: `${color}22`, color }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StatusChip label={c.status} />
            <WithPermission permission="campaigns:write">
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => onEdit(c)}><Pencil size={13} /></IconButton>
              </Tooltip>
            </WithPermission>
            <WithPermission permission="campaigns:write">
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => onDelete(c.id)}><Trash2 size={13} /></IconButton>
              </Tooltip>
            </WithPermission>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          <Box sx={{ flex: 1, bgcolor: 'action.hover', borderRadius: 2, p: 1, textAlign: 'center' }}>
            <Typography fontSize={18} fontWeight={700} color="primary">{c.leads}</Typography>
            <Typography fontSize={11} color="text.secondary">Leads</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: 'action.hover', borderRadius: 2, p: 1, textAlign: 'center' }}>
            <Typography fontSize={18} fontWeight={700} color="success.main">{c.converted}</Typography>
            <Typography fontSize={11} color="text.secondary">Converted</Typography>
          </Box>
          <Box sx={{ flex: 1, bgcolor: 'action.hover', borderRadius: 2, p: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <TrendingUp size={14} color="#10B981" />
              <Typography fontSize={18} fontWeight={700} color="warning.main">{convRate}%</Typography>
            </Box>
            <Typography fontSize={11} color="text.secondary">Conv. Rate</Typography>
          </Box>
        </Box>
        {canSeeBudget && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography fontSize={12} color="text.secondary">Budget: {formatCurrency(c.budget)}</Typography>
              <Typography fontSize={12} fontWeight={600}>Spent: {formatCurrency(c.spent)}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={Math.min(budgetPct, 100)}
              color={budgetPct > 90 ? 'error' : budgetPct > 70 ? 'warning' : 'primary'}
              sx={{ borderRadius: 4, height: 6 }} />
          </Box>
        )}
        <Typography fontSize={11} color="text.secondary" mt={1}>
          {formatDate(c.startDate)} → {formatDate(c.endDate)}
        </Typography>
      </CardContent>
    </Card>
  );
});
CampaignCard.displayName = 'CampaignCard';

const CampaignsPage: React.FC = () => {
  const { campaigns, createCampaign, editCampaign, removeCampaign, search } = useCampaigns();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const canSeeBudget = useFieldAccess('campaigns', 'budget');
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => { search(debouncedSearch); }, [debouncedSearch, search]);

  const handleCreate = useCallback((data: CampaignFormData) => createCampaign(data), [createCampaign]);

  const handleEdit = useCallback((c: Campaign) => { setEditingCampaign(c); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: CampaignFormData) => {
    if (editingCampaign) editCampaign({ ...editingCampaign, ...data });
    setEditingCampaign(null);
  }, [editingCampaign, editCampaign]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Campaign', 'Are you sure you want to delete this campaign?', () => removeCampaign(id));
  }, [confirm, removeCampaign]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingCampaign(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Megaphone size={22} />
          <Typography variant="h5" fontWeight={700}>Campaigns</Typography>
          <Chip label={campaigns.length} size="small" color="primary" sx={{ ml: 1 }} />
        </Box>
        <WithPermission permission="campaigns:write">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>New Campaign</Button>
        </WithPermission>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Search campaigns…" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
          sx={{ width: 300 }}
        />
      </Box>
      {campaigns.length === 0 ? (
        <EmptyState title="No campaigns found" description="Create your first campaign to get started." />
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <CampaignCard campaign={c} canSeeBudget={canSeeBudget} onEdit={handleEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}
      <CampaignFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingCampaign ? handleEditSubmit : handleCreate}
        initialData={editingCampaign ?? {}}
        mode={editingCampaign ? 'edit' : 'create'}
      />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
    </PageWrapper>
  );
};

export default CampaignsPage;
