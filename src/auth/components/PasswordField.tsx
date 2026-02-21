import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

type PasswordFieldProps = Omit<TextFieldProps, 'type'> & {
  showStrength?: boolean;
};

const inputSx = {
  '.MuiOutlinedInput-root': {
    color: 'white',
    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.35)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
  },
  '.MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '.MuiInputLabel-root.Mui-focused': { color: '#60A5FA' },
  '.MuiFormHelperText-root': { color: '#F87171' },
};

const PasswordField: React.FC<PasswordFieldProps> = ({ showStrength: _showStrength, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      sx={{ ...inputSx, ...(props.sx as object) }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setVisible((v) => !v)}
              edge="end"
              size="small"
              sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' } }}
            >
              {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
