const TENANT_KEY = 'crm_tenant_id';

export function saveTenantToStorage(tenantId: string): void {
  localStorage.setItem(TENANT_KEY, tenantId);
}

export function loadTenantFromStorageUtil(): string | null {
  return localStorage.getItem(TENANT_KEY);
}

export function clearTenantFromStorage(): void {
  localStorage.removeItem(TENANT_KEY);
}
