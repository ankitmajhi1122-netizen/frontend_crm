import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditLog, AuditAction } from '../../shared/types';

interface AuditState {
  logs: AuditLog[];
}

const initialState: AuditState = { logs: [] };

let logCounter = 0;

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    addAuditLog(state, action: PayloadAction<Omit<AuditLog, 'id' | 'timestamp'>>) {
      logCounter += 1;
      state.logs.push({
        ...action.payload,
        id: `audit-${logCounter}`,
        timestamp: new Date().toISOString(),
      });
    },
    clearAuditLogs(state) { state.logs = []; },
  },
});

export const { addAuditLog, clearAuditLogs } = auditSlice.actions;
export type { AuditAction };
export default auditSlice.reducer;
