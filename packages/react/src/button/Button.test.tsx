import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@ibx34/m3x-primitives';
import { Button } from './Button';
import { IconButton } from '../icon-button/IconButton';
import { Fab, ExtendedFab } from '../fab/Fab';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('Button', () => {
  it('renders all five variants with proper classes', () => {
    for (const variant of ['elevated', 'filled', 'tonal', 'outlined', 'text'] as const) {
      const { unmount } = render(wrap(<Button variant={variant}>Go</Button>));
      expect(screen.getByRole('button', { name: 'Go' })).toHaveClass(`m3x-button--${variant}`);
      unmount();
    }
  });

  it('applies size class and resting round radius (height/2)', () => {
    render(wrap(<Button size="m">Go</Button>));
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('m3x-button--m');
    expect(btn.style.borderRadius).toContain('28px'); // 56/2
  });

  it('square shape rests at the square radius', () => {
    render(wrap(<Button size="m" shape="square">Go</Button>));
    expect(screen.getByRole('button').style.borderRadius).toContain('16px');
  });

  it('fires onClick and respects disabled', () => {
    const onClick = vi.fn();
    render(wrap(<Button onClick={onClick} disabled>Go</Button>));
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('toggle exposes and updates aria-pressed', () => {
    const onSelectedChange = vi.fn();
    render(wrap(<Button toggle onSelectedChange={onSelectedChange}>Mute</Button>));
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });
});

describe('IconButton', () => {
  it('requires an accessible name and toggles fill', () => {
    render(wrap(<IconButton toggle icon="favorite" aria-label="Favorite" />));
    const btn = screen.getByRole('button', { name: 'Favorite' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Fab', () => {
  it('renders sizes and colors', () => {
    render(wrap(<Fab icon="edit" size="large" color="tertiary" aria-label="Edit" />));
    const btn = screen.getByRole('button', { name: 'Edit' });
    expect(btn).toHaveClass('m3x-fab--large');
    expect(btn).toHaveClass('m3x-fab--tertiary');
  });

  it('extended FAB collapses', () => {
    const { rerender } = render(
      wrap(<ExtendedFab icon="edit" aria-label="Compose">Compose</ExtendedFab>),
    );
    expect(screen.getByRole('button')).not.toHaveAttribute('data-collapsed');
    rerender(wrap(<ExtendedFab icon="edit" aria-label="Compose" collapsed>Compose</ExtendedFab>));
    expect(screen.getByRole('button')).toHaveAttribute('data-collapsed');
  });
});
