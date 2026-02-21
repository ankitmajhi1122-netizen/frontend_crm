import React, { Component, ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Ignore MUI Portal/Modal DOM errors (documentElement not found)
    // These are caused by portals mounting before document is ready
    if (error?.message?.includes('documentElement') || error?.message?.includes('getScrollbarSize')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (error?.message?.includes('documentElement') || error?.message?.includes('getScrollbarSize')) {
      return; // suppress portal errors silently
    }
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 2 }}>
          <AlertTriangle size={48} color="#EF4444" />
          <Typography variant="h5" fontWeight={700}>Something went wrong</Typography>
          <Typography variant="body2" color="text.secondary">{this.state.error?.message}</Typography>
          <Button variant="outlined" onClick={this.handleReset}>Try Again</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
