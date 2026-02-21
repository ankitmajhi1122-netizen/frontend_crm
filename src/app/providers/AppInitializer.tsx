/**
 * AppInitializer
 * ---------------
 * Fetches all backend data once the user is authenticated and populates
 * the Redux store. Renders children unconditionally — data loads silently
 * in the background so pages show their own loading states.
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../../auth/authSelectors';
import { selectCurrentTenant } from '../../multi-tenant/tenantSelectors';
import { AUTH_TOKEN_KEY } from '../../api/config';
import { logout } from '../../auth/authSlice';
import {
    leadsService, contactsService, accountsService, dealsService,
    campaignsService, invoicesService, ordersService, productsService,
    quotesService, tasksService, usersService,
} from '../../api';
import { setLeads } from '../../store/slices/leadsSlice';
import { setContacts } from '../../store/slices/contactsSlice';
import { setAccounts } from '../../store/slices/accountsSlice';
import { setDeals } from '../../store/slices/dealsSlice';
import { setCampaigns } from '../../store/slices/campaignsSlice';
import { setInvoices } from '../../store/slices/invoicesSlice';
import { setOrders } from '../../store/slices/ordersSlice';
import { setProducts } from '../../store/slices/productsSlice';
import { setQuotes } from '../../store/slices/quotesSlice';
import { setTasks } from '../../store/slices/tasksSlice';
import { setUsers } from '../../store/slices/usersSlice';

interface Props { children: React.ReactNode; }

const AppInitializer: React.FC<Props> = ({ children }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const tenant = useAppSelector(selectCurrentTenant);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Guard: Ensure token exists before firing API calls
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) {
            console.warn('[AppInitializer] Authenticated but token missing. Logging out.');
            dispatch(logout());
            return;
        }

        if (!tenant?.id) return;

        const tid = tenant.id;

        const load = async () => {
            try {
                const [
                    leads, contacts, accounts, deals,
                    campaigns, invoices, orders, products,
                    quotes, tasks, users,
                ] = await Promise.allSettled([
                    leadsService.getAll(tid),
                    contactsService.getAll(tid),
                    accountsService.getAll(tid),
                    dealsService.getAll(tid),
                    campaignsService.getAll(tid),
                    invoicesService.getAll(tid),
                    ordersService.getAll(tid),
                    productsService.getAll(tid),
                    quotesService.getAll(tid),
                    tasksService.getAll(tid),
                    usersService.getAll(tid),
                ]);

                if (leads.status === 'fulfilled') dispatch(setLeads(leads.value));
                if (contacts.status === 'fulfilled') dispatch(setContacts(contacts.value));
                if (accounts.status === 'fulfilled') dispatch(setAccounts(accounts.value));
                if (deals.status === 'fulfilled') dispatch(setDeals(deals.value));
                if (campaigns.status === 'fulfilled') dispatch(setCampaigns(campaigns.value));
                if (invoices.status === 'fulfilled') dispatch(setInvoices(invoices.value));
                if (orders.status === 'fulfilled') dispatch(setOrders(orders.value));
                if (products.status === 'fulfilled') dispatch(setProducts(products.value));
                if (quotes.status === 'fulfilled') dispatch(setQuotes(quotes.value));
                if (tasks.status === 'fulfilled') dispatch(setTasks(tasks.value));
                if (users.status === 'fulfilled') dispatch(setUsers(users.value));
            } catch (err) {
                console.error('[AppInitializer] failed to load initial data', err);
            }
        };

        load();
    }, [isAuthenticated, tenant?.id, dispatch]);

    return <>{children}</>;
};

export default AppInitializer;
