import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@ibx34/m3x-primitives';
import { SearchBar } from './search/SearchBar';
import { SearchView } from './search/SearchView';
import { SegmentedButtons } from './segmented/SegmentedButtons';
import { RichTooltip } from './tooltip/RichTooltip';
import { NavigationDrawer } from './navigation-drawer/NavigationDrawer';
import { Carousel } from './carousel/Carousel';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('SearchBar', () => {
  it('shows suggestions on focus and selects one', () => {
    const onPick = vi.fn();
    render(
      wrap(
        <SearchBar
          placeholder="Search notes"
          aria-label="Search"
          suggestions={[{ label: 'meeting notes' }, { label: 'groceries' }]}
          onSuggestionSelect={onPick}
        />,
      ),
    );
    const input = screen.getByRole('searchbox');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'meeting notes' }));
    expect(onPick).toHaveBeenCalledWith(expect.objectContaining({ label: 'meeting notes' }));
  });
});

describe('SearchView', () => {
  it('opens full-screen, clears, and closes', () => {
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
    function Harness() {
      const [v, setV] = React.useState('mee');
      return (
        <SearchView
          open
          onClose={onClose}
          value={v}
          onChange={setV}
          suggestions={[{ label: 'meeting notes' }]}
        />
      );
    }
    render(wrap(<Harness />));
    expect(screen.getByRole('searchbox')).toHaveValue('mee');
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('SegmentedButtons', () => {
  const segments = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
  ];

  it('single-select swaps selection', () => {
    const onChange = vi.fn();
    render(wrap(<SegmentedButtons segments={segments} onChange={onChange} aria-label="Range" />));
    fireEvent.click(screen.getByRole('button', { name: 'Week' }));
    expect(onChange).toHaveBeenLastCalledWith(['week']);
    fireEvent.click(screen.getByRole('button', { name: 'Month' }));
    expect(onChange).toHaveBeenLastCalledWith(['month']);
  });

  it('multi-select accumulates', () => {
    const onChange = vi.fn();
    render(
      wrap(
        <SegmentedButtons segments={segments} multiSelect onChange={onChange} aria-label="Days" />,
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Day' }));
    fireEvent.click(screen.getByRole('button', { name: 'Week' }));
    expect(onChange).toHaveBeenLastCalledWith(['day', 'week']);
  });
});

describe('RichTooltip', () => {
  it('persistent mode toggles on click', () => {
    render(
      wrap(
        <RichTooltip persistent subhead="Grid" content="Snap items to the grid." actions={<button>Learn more</button>}>
          <button>anchor</button>
        </RichTooltip>,
      ),
    );
    const tip = screen.getByRole('tooltip');
    expect(tip).not.toHaveAttribute('data-visible');
    fireEvent.click(screen.getByRole('button', { name: 'anchor' }));
    expect(tip).toHaveAttribute('data-visible');
  });
});

describe('NavigationDrawer', () => {
  const items = [
    { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 24 },
    { id: 'sent', label: 'Sent', icon: 'send' },
    { divider: true, id: 'd1', label: '' },
    { headline: true, id: 'h1', label: 'Labels' },
    { id: 'work', label: 'Work', icon: 'label' },
  ];

  it('standing drawer selects items', () => {
    render(wrap(<NavigationDrawer items={items} aria-label="Mail folders" />));
    expect(screen.getByRole('button', { name: /Inbox/ })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: /Sent/ }));
    expect(screen.getByRole('button', { name: /Sent/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Labels')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
  });
});

describe('Carousel', () => {
  it('renders items; interactive items are buttons', () => {
    const onClick = vi.fn();
    render(
      wrap(
        <Carousel
          aria-label="Featured"
          items={[
            { key: 'a', node: <span>Alpha</span>, label: 'Alpha', onClick },
            { key: 'b', node: <span>Beta</span> },
          ]}
        />,
      ),
    );
    expect(screen.getByRole('list', { name: 'Featured' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('listitem')[0]!);
    expect(onClick).toHaveBeenCalled();
  });
});
