import { useState, useCallback } from 'react';

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const initialState: ConfirmState = {
  open: false,
  title: '',
  message: '',
  onConfirm: () => {},
};

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>(initialState);

  const confirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setState({ open: true, title, message, onConfirm });
  }, []);

  const handleClose = useCallback(() => setState(initialState), []);

  const handleConfirm = useCallback(() => {
    state.onConfirm();
    setState(initialState);
  }, [state]);

  return { confirmState: state, confirm, handleClose, handleConfirm };
}
