import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@m3x/primitives';
import { TopAppBar } from './app-bar/TopAppBar';
import { NavigationRail } from './navigation-rail/NavigationRail';
import { Menu } from './menu/Menu';
import { List, ListItem } from './list/List';
import { Tooltip } from './tooltip/Tooltip';
import { BottomSheet } from './bottom-sheet/BottomSheet';
import { IconButton } from './icon-button/IconButton';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('TopAppBar', () => {
  it('renders sizes with title and actions', () => {
    render(
      wrap(
        <TopAppBar
          size="large"
          title="Inbox"
          navigationIcon="menu"
          actions={<IconButton icon="search" aria-label="Search" />}
        />,
      ),
    );
    expect(screen.getByRole('banner')).toHaveClass('m3x-top-app-bar--large');
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
});

describe('NavigationRail', () => {
  const items = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'mail', label: 'Mail', icon: 'mail' },
  ];

  it('selects items; expanded renders inline labels', () => {
    const { rerender } = render(wrap(<NavigationRail items={items} aria-label="Rail" />));
    fireEvent.click(screen.getByRole('button', { name: /Mail/ }));
    expect(screen.getByRole('button', { name: /Mail/ })).toHaveAttribute('aria-current', 'page');
    rerender(wrap(<NavigationRail items={items} expanded aria-label="Rail" />));
    expect(document.querySelector('.m3x-nav-rail--expanded')).toBeTruthy();
  });
});

describe('Menu', () => {
  it('renders items, selects, and closes on Escape', () => {
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      wrap(
        <div style={{ position: 'relative' }}>
          <Menu
            open
            onClose={onClose}
            items={[
              { label: 'Rename', leadingIcon: 'edit', onSelect },
              { divider: true, label: '' },
              { label: 'Delete', leadingIcon: 'delete' },
            ]}
          />
        </div>,
      ),
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onSelect).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe('List', () => {
  it('renders 2-line interactive items', () => {
    const onClick = vi.fn();
    render(
      wrap(
        <List aria-label="Mail">
          <ListItem
            headline="Lunch?"
            supportingText="Are we still on for noon"
            leadingIcon="person"
            trailingText="12:02"
            onClick={onClick}
          />
        </List>,
      ),
    );
    const item = screen.getByRole('button', { name: /Lunch/ });
    expect(item).toHaveClass('m3x-list-item--2-line');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Tooltip', () => {
  it('shows on focus and links via aria-describedby', () => {
    render(
      wrap(
        <Tooltip content="Save to favorites">
          <button>fav</button>
        </Tooltip>,
      ),
    );
    const btn = screen.getByRole('button', { name: 'fav' });
    const tip = screen.getByRole('tooltip');
    expect(btn).toHaveAttribute('aria-describedby', tip.id);
    expect(tip).not.toHaveAttribute('data-visible');
    fireEvent.focus(btn);
    expect(tip).toHaveAttribute('data-visible');
  });
});

describe('BottomSheet', () => {
  it('opens modally and closes via handle', () => {
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
    const onClose = vi.fn();
    render(
      wrap(
        <BottomSheet open onClose={onClose} aria-label="Share">
          Content
        </BottomSheet>,
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close sheet' }));
    expect(onClose).toHaveBeenCalled();
  });
});
