import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@m3x/primitives';
import { DatePicker } from './date-picker/DatePicker';
import { TimePicker, TimeValue } from './time-picker/TimePicker';
import { SideSheet } from './side-sheet/SideSheet';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('DatePicker', () => {
  it('renders the month grid, selects a day, and navigates months', () => {
    const onChange = vi.fn();
    render(
      wrap(
        <DatePicker
          value={new Date(2026, 7, 9)}
          initialMonth={new Date(2026, 7, 1)}
          onChange={onChange}
        />,
      ),
    );
    expect(screen.getByText('August 2026')).toBeInTheDocument();
    const selected = screen.getByRole('button', { name: 'Sun Aug 09 2026' });
    expect(selected).toHaveAttribute('data-selected');
    fireEvent.click(screen.getByRole('button', { name: 'Fri Aug 21 2026' }));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 7, 21));
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('September 2026')).toBeInTheDocument();
  });

  it('August 2026 starts on Saturday with default week start', () => {
    render(wrap(<DatePicker initialMonth={new Date(2026, 7, 1)} />));
    expect(screen.getByRole('button', { name: 'Sat Aug 01 2026' })).toBeInTheDocument();
  });
});

describe('TimePicker', () => {
  function Harness({ initial }: { initial: TimeValue }) {
    const [v, setV] = React.useState(initial);
    return <TimePicker value={v} onChange={setV} />;
  }

  it('shows 12h display and switches period', () => {
    render(wrap(<Harness initial={{ hour: 14, minute: 5 }} />));
    expect(screen.getByLabelText('Hour')).toHaveValue('02');
    expect(screen.getByLabelText('Minute')).toHaveValue('05');
    const pm = screen.getByRole('button', { name: 'PM' });
    expect(pm).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'AM' }));
    expect(screen.getByLabelText('Hour')).toHaveValue('02'); // 2 AM now
    expect(screen.getByRole('button', { name: 'AM' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('clamps minute input', () => {
    render(wrap(<Harness initial={{ hour: 9, minute: 30 }} />));
    fireEvent.change(screen.getByLabelText('Minute'), { target: { value: '95' } });
    expect(screen.getByLabelText('Minute')).toHaveValue('59');
  });
});

describe('SideSheet', () => {
  it('standing sheet renders title and content', () => {
    render(
      wrap(
        <SideSheet title="Filters" onClose={() => {}}>
          Sheet body
        </SideSheet>,
      ),
    );
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close sheet' })).toBeInTheDocument();
  });

  it('modal sheet closes via close button', () => {
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
        <SideSheet title="Details" modal open onClose={onClose}>
          Body
        </SideSheet>,
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close sheet' }));
    expect(onClose).toHaveBeenCalled();
  });
});
