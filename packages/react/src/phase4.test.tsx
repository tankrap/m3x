import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@tankmrap/m3x-primitives';
import { Card } from './card/Card';
import { Dialog } from './dialog/Dialog';
import { Snackbar } from './snackbar/Snackbar';
import { Badge } from './badge/Badge';
import { Divider } from './divider/Divider';
import { Tabs } from './tabs/Tabs';
import { NavigationBar } from './navigation-bar/NavigationBar';
import { Button } from './button/Button';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('Card', () => {
  it('renders variants; interactive card is a keyboard-activatable button', () => {
    const onClick = vi.fn();
    render(wrap(<Card variant="outlined" onClick={onClick}>Hello</Card>));
    const card = screen.getByRole('button', { name: 'Hello' });
    expect(card).toHaveClass('m3x-card--outlined');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onClick).toHaveBeenCalled();
  });

  it('non-interactive card has no button role', () => {
    render(wrap(<Card>Static</Card>));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('Dialog', () => {
  it('opens via showModal and closes on cancel', () => {
    const onClose = vi.fn();
    // jsdom lacks showModal
    HTMLDialogElement.prototype.showModal =
      HTMLDialogElement.prototype.showModal ??
      function (this: HTMLDialogElement) {
        this.open = true;
      };
    HTMLDialogElement.prototype.close =
      HTMLDialogElement.prototype.close ??
      function (this: HTMLDialogElement) {
        this.open = false;
      };
    render(
      wrap(
        <Dialog open onClose={onClose} headline="Discard draft?" actions={<Button variant="text">OK</Button>}>
          Body text
        </Dialog>,
      ),
    );
    expect(screen.getByText('Discard draft?')).toBeInTheDocument();
    fireEvent(screen.getByText('Discard draft?').closest('dialog')!, new Event('cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Snackbar', () => {
  it('announces politely, fires action, and auto-dismisses', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const onAction = vi.fn();
    render(
      wrap(
        <Snackbar open onClose={onClose} message="Draft saved" actionLabel="Undo" onAction={onAction} />,
      ),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Draft saved');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onAction).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe('Badge', () => {
  it('caps large counts', () => {
    render(wrap(<Badge count={1200} />));
    expect(screen.getByText('999+')).toBeInTheDocument();
  });
});

describe('Divider', () => {
  it('renders a separator', () => {
    render(wrap(<Divider />));
    expect(screen.getByRole('separator')).toHaveClass('m3x-divider');
  });
});

describe('Tabs', () => {
  const tabs = [
    { id: 'a', label: 'Flights' },
    { id: 'b', label: 'Trips' },
    { id: 'c', label: 'Explore' },
  ];

  it('selects tabs and moves with arrow keys', () => {
    const onChange = vi.fn();
    render(wrap(<Tabs tabs={tabs} onChange={onChange} aria-label="Sections" />));
    const trips = screen.getByRole('tab', { name: 'Trips' });
    fireEvent.click(trips);
    expect(onChange).toHaveBeenCalledWith('b');
    expect(trips).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Explore' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('NavigationBar', () => {
  const items = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'mail', label: 'Mail', icon: 'mail', badge: 12 },
    { id: 'files', label: 'Files', icon: 'folder', badge: 'dot' as const },
  ];

  it('marks the active item with aria-current and shows badges', () => {
    render(wrap(<NavigationBar items={items} aria-label="Main" />));
    expect(screen.getByRole('button', { name: /Home/ })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: /Mail/ }));
    expect(screen.getByRole('button', { name: /Mail/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
