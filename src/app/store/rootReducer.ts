import { combineReducers, AnyAction } from '@reduxjs/toolkit';
import authReducer from '../../auth/authSlice';
import tenantReducer, { setTenant } from '../../multi-tenant/tenantSlice';
import leadsReducer, { resetLeadsFilters } from '../../store/slices/leadsSlice';
import dealsReducer, { resetDealsFilters } from '../../store/slices/dealsSlice';
import contactsReducer, { resetContactsFilters } from '../../store/slices/contactsSlice';
import tasksReducer from '../../store/slices/tasksSlice';
import auditReducer from '../../store/slices/auditSlice';
import accountsReducer, { resetAccountsFilters } from '../../store/slices/accountsSlice';
import campaignsReducer, { resetCampaignsFilters } from '../../store/slices/campaignsSlice';
import productsReducer, { resetProductsFilters } from '../../store/slices/productsSlice';
import quotesReducer, { resetQuotesFilters } from '../../store/slices/quotesSlice';
import invoicesReducer, { resetInvoicesFilters } from '../../store/slices/invoicesSlice';
import ordersReducer, { resetOrdersFilters } from '../../store/slices/ordersSlice';
import usersReducer from '../../store/slices/usersSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  tenant: tenantReducer,
  leads: leadsReducer,
  deals: dealsReducer,
  contacts: contactsReducer,
  tasks: tasksReducer,
  audit: auditReducer,
  accounts: accountsReducer,
  campaigns: campaignsReducer,
  products: productsReducer,
  quotes: quotesReducer,
  invoices: invoicesReducer,
  orders: ordersReducer,
  users: usersReducer,
});

export type CombinedState = ReturnType<typeof combinedReducer>;

// Root reducer intercepts setTenant to reset all module search/filter/pagination
export const rootReducer = (
  state: CombinedState | undefined,
  action: AnyAction
): CombinedState => {
  const nextState = combinedReducer(state, action);

  if (action.type === setTenant.type) {
    return {
      ...nextState,
      leads:     leadsReducer(nextState.leads, resetLeadsFilters()),
      deals:     dealsReducer(nextState.deals, resetDealsFilters()),
      contacts:  contactsReducer(nextState.contacts, resetContactsFilters()),
      accounts:  accountsReducer(nextState.accounts, resetAccountsFilters()),
      campaigns: campaignsReducer(nextState.campaigns, resetCampaignsFilters()),
      products:  productsReducer(nextState.products, resetProductsFilters()),
      quotes:    quotesReducer(nextState.quotes, resetQuotesFilters()),
      invoices:  invoicesReducer(nextState.invoices, resetInvoicesFilters()),
      orders:    ordersReducer(nextState.orders, resetOrdersFilters()),
    };
  }

  return nextState;
};
