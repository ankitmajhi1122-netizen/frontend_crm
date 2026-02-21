import React, { Component, ErrorInfo } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface Props { children: React.ReactNode; moduleName: string; }
interface State { hasError: boolean; error: Error | null; }

class ModuleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.moduleName}] Module Error:`, error, info);
  }
  handleReset = () => this.setState({ hasError: false, error: null });
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" icon={<AlertTriangle size={20} />} action={
            <Button color="inherit" size="small" onClick={this.handleReset}>Retry</Button>
          }>
            <Typography fontWeight={600}>{this.props.moduleName} failed to load</Typography>
            <Typography variant="caption">{this.state.error?.message}</Typography>
          </Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ModuleErrorBoundary;
