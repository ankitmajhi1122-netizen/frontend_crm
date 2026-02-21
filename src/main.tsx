import ReactDOM from 'react-dom/client';
import AppProviders from './app/providers/AppProviders';
import AppRouter from './app/router/AppRouter';
import ErrorBoundary from './core/error/ErrorBoundary';
import AppInitializer from './app/providers/AppInitializer';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AppProviders>
      <AppInitializer>
        <AppRouter />
      </AppInitializer>
    </AppProviders>
  </ErrorBoundary>
);
