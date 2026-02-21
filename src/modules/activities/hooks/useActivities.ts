import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { addTask, updateTask, deleteTask } from '../../../store/slices/tasksSlice';
import { addAuditLog } from '../../../store/slices/auditSlice';
import { Task } from '../../../shared/types';
import { tasksService } from '../../../api/services/tasksService';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { selectCurrentUser } from '../../../auth/authSelectors';
import { filterByTenant, filterByOwnership } from '../../../shared/utils/filterUtils';

export function useActivities() {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector(selectCurrentTenant);
  const user = useAppSelector(selectCurrentUser);
  const allTasks = useAppSelector((s) => s.tasks.items);

  const tasks = useMemo(() => {
    if (!tenant || !user) return [];
    return filterByOwnership(filterByTenant(allTasks, tenant.id), user.id, user.role);
  }, [allTasks, tenant, user]);

  const createTask = useCallback(async (data: Omit<Task, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!tenant || !user) return;
    try {
      const newTask = await tasksService.create({ ...data, tenantId: tenant.id, createdBy: user.id });
      dispatch(addTask(newTask));
      dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'CREATE', module: 'activities', recordId: newTask.id }));
    } catch (err) {
      console.error('Failed to create task', err);
    }
  }, [dispatch, tenant, user]);

  const editTask = useCallback(async (task: Task) => {
    if (!tenant || !user) return;
    try {
      const updated = await tasksService.update(task.id, task);
      dispatch(updateTask(updated));
      dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'UPDATE', module: 'activities', recordId: task.id }));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  }, [dispatch, tenant, user]);

  const removeTask = useCallback(async (id: string) => {
    if (!tenant || !user) return;
    try {
      await tasksService.delete(id);
      dispatch(deleteTask(id));
      dispatch(addAuditLog({ tenantId: tenant.id, userId: user.id, action: 'DELETE', module: 'activities', recordId: id }));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  }, [dispatch, tenant, user]);

  return { tasks, createTask, editTask, removeTask };
}
