import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemText,
  Divider, Button, IconButton, Tooltip, Chip,
} from '@mui/material';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useActivities } from '../hooks/useActivities';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import { formatDateTime } from '../../../shared/utils/dateUtils';
import Breadcrumbs from '../../../core/navigation/Breadcrumbs';
import StatusChip from '../../../shared/components/StatusChip';
import EmptyState from '../../../shared/components/EmptyState';
import PageWrapper from '../../../shared/components/PageWrapper';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import { Task } from '../../../shared/types';
import { TaskFormData } from '../types';

const ActivitiesPage: React.FC = () => {
  const { tasks, createTask, editTask, removeTask } = useActivities();
  const { confirmState, confirm, handleClose, handleConfirm } = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = useCallback((data: TaskFormData) => createTask(data), [createTask]);

  const handleEdit = useCallback((t: Task) => { setEditingTask(t); setModalOpen(true); }, []);

  const handleEditSubmit = useCallback((data: TaskFormData) => {
    if (editingTask) editTask({ ...editingTask, ...data });
    setEditingTask(null);
  }, [editingTask, editTask]);

  const handleDelete = useCallback((id: string) => {
    confirm('Delete Activity', 'Are you sure you want to delete this activity?', () => removeTask(id));
  }, [confirm, removeTask]);

  const handleModalClose = useCallback(() => { setModalOpen(false); setEditingTask(null); }, []);

  return (
    <PageWrapper>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" fontWeight={700}>Activities</Typography>
          <Chip label={tasks.length} size="small" color="primary" sx={{ ml: 1 }} />
        </Box>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          Add Activity
        </Button>
      </Box>
      <Card>
        <CardContent>
          {tasks.length === 0 ? (
            <EmptyState title="No activities found" description="Your tasks and activities will appear here." />
          ) : (
            <List disablePadding>
              {tasks.map((t, i) => (
                <React.Fragment key={t.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ px: 0 }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(t)}>
                            <Pencil size={14} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}>
                            <Trash2 size={14} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography fontWeight={600} fontSize={14}>{t.title}</Typography>
                          <StatusChip label={t.priority} />
                          <StatusChip label={t.status} />
                        </Box>
                      }
                      secondary={
                        <>
                          {t.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {t.description}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            Due: {formatDateTime(t.dueDate)}
                            {t.relatedTo && ` · Related: ${t.relatedTo}`}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {i < tasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
      <TaskFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingTask ? handleEditSubmit : handleCreate}
        initialData={editingTask ?? {}}
        mode={editingTask ? 'edit' : 'create'}
      />
      <ConfirmDialog {...confirmState} onClose={handleClose} onConfirm={handleConfirm} />
    </PageWrapper>
  );
};

export default ActivitiesPage;
