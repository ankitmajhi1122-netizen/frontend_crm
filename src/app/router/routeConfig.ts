import { ROUTES } from '../../shared/constants/routes';

export interface RouteConfig {
  path: string;
  module: string;
  label: string;
  icon: string;
  requiredPlan: string[];
  requiredRole: string[];
}

export const MODULE_ROUTES: RouteConfig[] = [
  { path: ROUTES.DASHBOARD,    module: 'dashboard',    label: 'Dashboard',    icon: 'LayoutDashboard', requiredPlan: ['basic','pro','enterprise'], requiredRole: ['ADMIN','MANAGER','SALES'] },
  { path: ROUTES.LEADS,        module: 'leads',        label: 'Leads',        icon: 'UserPlus',        requiredPlan: ['basic','pro','enterprise'], requiredRole: ['ADMIN','MANAGER','SALES'] },
  { path: ROUTES.CONTACTS,     module: 'contacts',     label: 'Contacts',     icon: 'Users',           requiredPlan: ['basic','pro','enterprise'], requiredRole: ['ADMIN','MANAGER','SALES'] },
  { path: ROUTES.ACCOUNTS,     module: 'accounts',     label: 'Accounts',     icon: 'Building2',       requiredPlan: ['pro','enterprise'],        requiredRole: ['ADMIN','MANAGER','SALES'] },
  { path: ROUTES.DEALS,        module: 'deals',        label: 'Deals',        icon: 'Handshake',       requiredPlan: ['basic','pro','enterprise'], requiredRole: ['ADMIN','MANAGER','SALES'] },
  { path: ROUTES.ACTIVITIES,   module: 'activities',   label: 'Activities',   icon: 'Activity',        requiredPlan: ['pro','enterprise'],        requiredRole: ['ADMIN','MANAGER','SALES'] },
  { path: ROUTES.CAMPAIGNS,    module: 'campaigns',    label: 'Campaigns',    icon: 'Megaphone',       requiredPlan: ['pro','enterprise'],        requiredRole: ['ADMIN','MANAGER'] },
  { path: ROUTES.PRODUCTS,     module: 'products',     label: 'Products',     icon: 'Package',         requiredPlan: ['pro','enterprise'],        requiredRole: ['ADMIN','MANAGER'] },
  { path: ROUTES.QUOTES,       module: 'quotes',       label: 'Quotes',       icon: 'FileText',        requiredPlan: ['pro','enterprise'],        requiredRole: ['ADMIN','MANAGER'] },
  { path: ROUTES.INVOICES,     module: 'invoices',     label: 'Invoices',     icon: 'Receipt',         requiredPlan: ['enterprise'],              requiredRole: ['ADMIN','MANAGER'] },
  { path: ROUTES.ORDERS,       module: 'orders',       label: 'Orders',       icon: 'ShoppingCart',    requiredPlan: ['enterprise'],              requiredRole: ['ADMIN','MANAGER'] },
  { path: ROUTES.FORECASTING,  module: 'forecasting',  label: 'Forecasting',  icon: 'TrendingUp',      requiredPlan: ['enterprise'],              requiredRole: ['ADMIN','MANAGER'] },
  { path: ROUTES.REPORTS,      module: 'reports',      label: 'Reports',      icon: 'BarChart2',       requiredPlan: ['pro','enterprise'],        requiredRole: ['ADMIN','MANAGER'] },
  { path: ROUTES.SETTINGS,     module: 'settings',     label: 'Settings',     icon: 'Settings',        requiredPlan: ['basic','pro','enterprise'], requiredRole: ['ADMIN','MANAGER'] },
];
