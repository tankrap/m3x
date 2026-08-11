import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@ibx34/m3x-primitives';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';
import { Tag } from './tag/Tag';
import { FormDialog } from './dialog/FormDialog';
import { PinInput } from './pin-input/PinInput';
import { TextField } from './text-field/TextField';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

const dialogPolyfill = () => {
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
};

describe('interactive BarChart', () => {
  it('renders tracks + hover rings and fires onActiveChange', () => {
    const onActiveChange = vi.fn();
    const { container } = render(
      wrap(
        <BarChart
          data={[
            { label: 'Mon', value: 10 },
            { label: 'Tue', value: 20 },
          ]}
          header={{ label: 'Earned', trailing: <span>+14%</span> }}
          onActiveChange={onActiveChange}
        />,
      ),
    );
    expect(container.querySelectorAll('.m3x-bar-chart__track')).toHaveLength(2);
    expect(container.querySelectorAll('.m3x-bar-chart__ring')).toHaveLength(2);
    expect(screen.getByText('Earned')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument(); // header total (count-up settled: reducedMotion? jsdom no matchMedia reduce → animates... initial display = target on mount)

    const svg = container.querySelector('svg')!;
    svg.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 420, height: 220, right: 420, bottom: 220 }) as DOMRect;
    fireEvent.mouseMove(svg, { clientX: 100, clientY: 100 });
    expect(onActiveChange).toHaveBeenCalledWith(0);
    fireEvent.mouseLeave(svg);
    expect(onActiveChange).toHaveBeenLastCalledWith(null);
  });
});

describe('interactive PieChart', () => {
  it('hovering a slice swaps the center and emphasizes it', () => {
    const { container } = render(
      wrap(
        <PieChart
          slices={[
            { value: 30, label: 'A' },
            { value: 10, label: 'B' },
          ]}
          label="total"
        />,
      ),
    );
    const slices = container.querySelectorAll('.m3x-pie__slice');
    fireEvent.pointerEnter(slices[1]!);
    expect(slices[1]).toHaveAttribute('data-active');
    expect(slices[0]).toHaveAttribute('data-dimmed');
    // center label swaps to the hovered slice
    expect(container.querySelector('.m3x-gauge__label')?.textContent).toBe('B');
  });
});

describe('Tag', () => {
  it('applies color variants and dot', () => {
    render(
      wrap(
        <>
          <Tag color="success" dot>Active</Tag>
          <Tag color="error" icon="block">Blocked</Tag>
        </>,
      ),
    );
    expect(screen.getByText('Active')).toHaveClass('m3x-tag--success');
    expect(screen.getByText('Active').querySelector('.m3x-tag__dot')).toBeTruthy();
    expect(screen.getByText('Blocked')).toHaveClass('m3x-tag--error');
  });
});

describe('FormDialog', () => {
  it('submits FormData from its fields and closes', async () => {
    dialogPolyfill();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      wrap(
        <FormDialog open onClose={onClose} onSubmit={onSubmit} headline="New project">
          <TextField label="Name" name="name" defaultValue="Apollo" />
        </FormDialog>,
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]![0].get('name')).toBe('Apollo');
    await vi.waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('stays open when onSubmit returns false', async () => {
    dialogPolyfill();
    const onClose = vi.fn();
    render(
      wrap(
        <FormDialog open onClose={onClose} onSubmit={() => false} headline="Invalid">
          <TextField label="Name" name="name" />
        </FormDialog>,
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await new Promise((r) => setTimeout(r, 10));
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('PinInput', () => {
  it('typing advances focus and fires onComplete when full', () => {
    const onComplete = vi.fn();
    render(wrap(<PinInput length={4} onComplete={onComplete} />));
    const boxes = screen.getAllByRole('textbox');
    fireEvent.change(boxes[0]!, { target: { value: '1' } });
    expect(document.activeElement).toBe(boxes[1]);
    fireEvent.change(boxes[1]!, { target: { value: '2' } });
    fireEvent.change(boxes[2]!, { target: { value: '3' } });
    fireEvent.change(boxes[3]!, { target: { value: '4' } });
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('pasting distributes characters across boxes', () => {
    const onChange = vi.fn();
    render(wrap(<PinInput length={6} onChange={onChange} />));
    const boxes = screen.getAllByRole('textbox');
    fireEvent.paste(boxes[0]!, { clipboardData: { getData: () => '123456' } });
    expect(onChange).toHaveBeenLastCalledWith('123456');
    expect(boxes[5]).toHaveValue('6');
  });

  it('numeric mode strips letters; backspace on empty moves back', () => {
    const onChange = vi.fn();
    render(wrap(<PinInput length={4} onChange={onChange} defaultValue="12" />));
    const boxes = screen.getAllByRole('textbox');
    fireEvent.paste(boxes[2]!, { clipboardData: { getData: () => 'a9b' } });
    expect(onChange).toHaveBeenLastCalledWith('129');
    fireEvent.keyDown(boxes[3]!, { key: 'Backspace' }); // empty → clears prev + moves
    expect(onChange).toHaveBeenLastCalledWith('12');
    expect(document.activeElement).toBe(boxes[2]);
  });

  it('mid-string edits overwrite in place', () => {
    const onChange = vi.fn();
    render(wrap(<PinInput length={4} defaultValue="1234" onChange={onChange} />));
    const boxes = screen.getAllByRole('textbox');
    fireEvent.change(boxes[1]!, { target: { value: '9' } });
    expect(onChange).toHaveBeenLastCalledWith('1934');
  });
});
