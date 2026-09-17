import React from 'react';
import { IconButton, IconButtonProps, SxProps, Theme } from '@mui/material';

type AppIconButtonProps = Omit<IconButtonProps, 'color'> & {
  color?: 'primary' | 'info' | 'success' | 'error';
};

const themes: Record<NonNullable<AppIconButtonProps['color']>, SxProps<Theme>> = {
  primary: {
    color: 'var(--color-primary)',
    backgroundColor: 'rgb(25 118 210 / 0.15)',
    '&:hover': {
      color: 'var(--color-primary)',
      backgroundColor: 'rgb(25 118 210 / 0.30)',
    },
  },
  info: {
    color: 'var(--color-primary)',
    backgroundColor: 'rgb(25 118 210 / 0.15)',
    '&:hover': {
      color: 'var(--color-primary)',
      backgroundColor: 'rgb(25 118 210 / 0.30)',
    },
  },
  success: {
    color: 'var(--color-success)',
    backgroundColor: 'var(--color-success-subtle-bg)',
    '&:hover': {
      color: 'var(--color-success)',
      backgroundColor: 'var(--color-success-subtle-hover-bg)',
    },
  },
  error: {
    color: 'var(--color-error)',
    backgroundColor: 'var(--color-error-subtle-bg)',
    '&:hover': {
      color: 'var(--color-error)',
      backgroundColor: 'var(--color-error-subtle-hover-bg)',
    },
  },
};

const baseSx: SxProps<Theme> = {
  width: '2.5rem',
  height: '2.5rem',
  padding: 0,
  borderRadius: '6px',
};

const AppIconButton: React.FC<AppIconButtonProps> = ({
  color = 'primary',
  size = 'small',
  sx,
  children,
  ...rest
}) => (
  <IconButton
    size={size}
    sx={(theme) => ({
      ...baseSx,
      ...themes[color],
      ...(typeof sx === 'function' ? sx(theme) : sx),
    })}
    {...rest}
  >
    {children}
  </IconButton>
);

export default AppIconButton;