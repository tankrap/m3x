import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@ibx34/m3x-primitives';
import { Button } from './button/Button';
import { ButtonGroup } from './button-group/ButtonGroup';
import { SplitButton } from './split-button/SplitButton';
import { FabMenu } from './fab-menu/FabMenu';
import { LoadingIndicator } from './loading-indicator/LoadingIndicator';
import { LinearProgress } from './progress/LinearProgress';
import { CircularProgress } from './progress/CircularProgress';
import { DockedToolbar, FloatingToolbar } from './toolbar/Toolbar';
import { IconButton } from './icon-button/IconButton';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('ButtonGroup', () => {
  it('renders a group and passes connected silhouettes to members', () => {
    render(
      wrap(
        <ButtonGroup connected aria-label="Alignment">
          <Button toggle>Left</Button>
          <Button toggle>Center</Button>
          <Button toggle>Right</Button>
        </ButtonGroup>,
      ),
    );
    expect(screen.getByRole('group', { name: 'Alignment' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    // connected members rest with asymmetric corners: first = full left, 8px right
    const first = screen.getByRole('button', { name: 'Left' });
    expect(first.style.borderRadius).toContain('8px');
  });
});

describe('SplitButton', () => {
  it('opens the menu with proper aria wiring and selects items', () => {
    const onSelect = vi.fn();
    render(
      wrap(
        <SplitButton items={[{ label: 'Copy', onSelect }, { label: 'Move' }]} onAction={() => {}}>
          Save
        </SplitButton>,
      ),
    );
    const trigger = screen.getByRole('button', { name: 'More options' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(wrap(<SplitButton items={[{ label: 'A' }]}>Act</SplitButton>));
    fireEvent.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('FabMenu', () => {
  it('expands and collapses with aria-expanded', async () => {
    vi.useFakeTimers();
    render(
      wrap(
        <FabMenu
          aria-label="Actions"
          items={[
            { label: 'Compose', icon: 'edit' },
            { label: 'Photo', icon: 'photo' },
          ]}
        />,
      ),
    );
    const fab = screen.getByRole('button', { name: 'Actions' });
    expect(fab).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(fab);
    expect(fab).toHaveAttribute('aria-expanded', 'true');
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole('menuitem', { name: /Compose/ })).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe('LoadingIndicator', () => {
  it('is an indeterminate progressbar', () => {
    render(wrap(<LoadingIndicator />));
    const el = screen.getByRole('progressbar', { name: 'Loading' });
    expect(el).not.toHaveAttribute('aria-valuenow');
    expect(el.querySelector('svg path')).toBeTruthy();
  });
});

describe('Progress', () => {
  it('linear exposes value', () => {
    render(wrap(<LinearProgress value={0.4} aria-label="Upload" />));
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute(
      'aria-valuenow',
      '0.4',
    );
  });

  it('circular determinate renders active arc and track with gap', () => {
    render(wrap(<CircularProgress value={0.5} aria-label="Sync" />));
    const el = screen.getByRole('progressbar', { name: 'Sync' });
    expect(el.querySelectorAll('svg path').length).toBe(2);
  });

  it('circular indeterminate spins', () => {
    render(wrap(<CircularProgress aria-label="Busy" />));
    expect(
      screen.getByRole('progressbar', { name: 'Busy' }).querySelector('.m3x-circular-progress__spin'),
    ).toBeTruthy();
  });
});

describe('Toolbars', () => {
  it('renders docked and floating with roles', () => {
    render(
      wrap(
        <>
          <DockedToolbar aria-label="Bottom">
            <IconButton icon="undo" aria-label="Undo" />
          </DockedToolbar>
          <FloatingToolbar variant="vibrant" orientation="vertical" aria-label="Format" >
            <IconButton icon="format_bold" aria-label="Bold" />
          </FloatingToolbar>
        </>,
      ),
    );
    expect(screen.getByRole('toolbar', { name: 'Bottom' })).toBeInTheDocument();
    const floating = screen.getByRole('toolbar', { name: 'Format' });
    expect(floating).toHaveClass('m3x-floating-toolbar--vibrant');
    expect(floating).toHaveAttribute('aria-orientation', 'vertical');
  });
});
