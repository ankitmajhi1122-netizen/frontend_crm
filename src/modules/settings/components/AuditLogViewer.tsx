import React, { useMemo, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, TablePagination, Chip, TextField, InputAdornment,
} from '@mui/material';
import { Search } from 'lucide-react';
import { useAppSelector } from '../../../app/store/hooks';
import { selectCurrentTenant } from '../../../multi-tenant/tenantSelectors';
import { formatDateTime } from '../../../shared/utils/dateUtils';

const ACTION_COLORS: Record<string, 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
  LOGIN: 'success', LOGOUT: 'default', CREATE: 'primary', UPDATE: 'info',
  DELETE: 'error', TENANT_SWITCH: 'warning', ROLE_CHANGE: 'warning', PLAN_ACCESS_ATTEMPT: 'error',
};

const AuditLogViewer: React.FC = () => {
  const allLogs = useAppSelector((s) => s.audit.logs);
  const tenant = useAppSelector(selectCurrentTenant);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const tenantLogs = allLogs.filter((l) => l.tenantId === tenant?.id);
    if (!search.trim()) return [...tenantLogs].reverse();
    const q = search.toLowerCase();
    return [...tenantLogs].reverse().filter(
      (l) => l.action.toLowerCase().includes(q) || l.module.toLowerCase().includes(q)
    );
  }, [allLogs, tenant, search]);

  const paginated = useMemo(() => filtered.slice(page * 10, page * 10 + 10), [filtered, page]);

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>Audit Log</Typography>
        <TextField
          size="small" placeholder="Search by action or module…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment> }}
          sx={{ mb: 2, width: 300 }}
        />
        {filtered.length === 0 ? (
          <Typography color="text.secondary" py={4} textAlign="center">No audit logs yet. Actions will appear here.</Typography>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Record ID</TableCell>
                  <TableCell>User ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ fontSize: 12 }}>{formatDateTime(log.timestamp)}</TableCell>
                    <TableCell>
                      <Chip label={log.action} size="small" color={ACTION_COLORS[log.action] ?? 'default'} />
                    </TableCell>
                    <TableCell>{log.module}</TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{log.recordId ?? '—'}</TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{log.userId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div" count={filtered.length} page={page}
              rowsPerPage={10} rowsPerPageOptions={[10]}
              onPageChange={(_, p) => setPage(p)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
