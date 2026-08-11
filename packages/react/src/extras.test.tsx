import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@ibx34/m3x-primitives';
import { createTheme } from '@ibx34/m3x-tokens';
import { Text } from './text/Text';
import { Avatar } from './avatar/Avatar';
import { Select } from './select/Select';
import { ComboBox } from './select/ComboBox';
import { SelectionCard } from './selection-card/SelectionCard';
import { Banner, InlineAlert } from './alert/Alert';
import { ToastProvider, useToast } from './alert/Toast';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('extended color roles', () => {
  it('theme exposes success/warning/info vars in both schemes', () => {
    const light = createTheme({ seedColor: '#6750A4' });
    const dark = createTheme({ seedColor: '#6750A4', dark: true });
    for (const v of ['--m3x-color-success', '--m3x-color-on-warning-container', '--m3x-color-info']) {
      expect(light.cssVars[v]).toMatch(/^#/);
      expect(dark.cssVars[v]).toMatch(/^#/);
      expect(light.cssVars[v]).not.toBe(dark.cssVars[v]);
    }
  });
});

describe('Text', () => {
  it('maps roles to semantic tags and typescale vars', () => {
    render(
      wrap(
        <>
          <Text variant="headlineSmall" emphasized>
            Heading
          </Text>
          <Text variant="bodyMedium" color="on-surface-variant">
            Body
          </Text>
          <Text variant="labelSmall" as="div">
            Label
          </Text>
        </>,
      ),
    );
    expect(screen.getByText('Heading').tagName).toBe('H2');
    expect(screen.getByText('Body').tagName).toBe('P');
    expect(screen.getByText('Label').tagName).toBe('DIV');
    expect(screen.getByText('Heading').style.fontSize).toContain('headline-small-size');
  });
});

describe('Avatar', () => {
  it('derives initials and stable color; falls back from broken image', () => {
    const { rerender } = render(wrap(<Avatar name="Ali Connors" />));
    const el = screen.getByRole('img', { name: 'Ali Connors' });
    expect(el).toHaveTextContent('AC');
    const bg = el.style.background;
    rerender(wrap(<Avatar name="Ali Connors" />));
    expect(screen.getByRole('img', { name: 'Ali Connors' }).style.background).toBe(bg);

    render(wrap(<Avatar name="Broken Img" src="http://x/404.png" />));
    const img = document.querySelector('.m3x-avatar__image')!;
    fireEvent.error(img);
    expect(screen.getByRole('img', { name: 'Broken Img' })).toHaveTextContent('BI');
  });
});

describe('Select', () => {
  const options = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue', disabled: true },
  ];

  it('opens, selects with mouse, and reflects value', () => {
    const onChange = vi.fn();
    render(wrap(<Select label="Color" options={options} onChange={onChange} />));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Green' }));
    expect(onChange).toHaveBeenCalledWith('green');
    expect(screen.getByRole('combobox')).toHaveTextContent('Green');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('full keyboard flow: arrows skip disabled, enter commits', () => {
    const onChange = vi.fn();
    render(wrap(<Select label="Color" options={options} onChange={onChange} />));
    const trigger = screen.getByRole('combobox');
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // opens
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // red → green
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // skips disabled blue → red
    fireEvent.keyDown(trigger, { key: 'ArrowUp' }); // back to green
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('green');
  });

  it('multiple: accumulates, stays open, joins labels', () => {
    const onChange = vi.fn();
    render(wrap(<Select label="Colors" multiple options={options} onChange={onChange} />));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Red' }));
    fireEvent.click(screen.getByRole('option', { name: 'Green' }));
    expect(onChange).toHaveBeenLastCalledWith(['red', 'green']);
    expect(screen.getByRole('listbox')).toBeInTheDocument(); // stays open
    expect(screen.getByRole('combobox')).toHaveTextContent('Red, Green');
    fireEvent.click(screen.getByRole('option', { name: 'Red' })); // deselect
    expect(onChange).toHaveBeenLastCalledWith(['green']);
  });

  it('tags mode renders removable chips', () => {
    const onChange = vi.fn();
    render(
      wrap(
        <Select
          label="Colors"
          multiple
          tags
          defaultValue={['red', 'green']}
          options={options}
          onChange={onChange}
        />,
      ),
    );
    expect(screen.getByText('Red')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Red' }));
    expect(onChange).toHaveBeenCalledWith(['green']);
  });
});

describe('ComboBox', () => {
  const options = ['Tokyo', 'Toronto', 'Turin', 'Oslo'].map((c) => ({ value: c, label: c }));

  it('filters as you type and commits on Enter', () => {
    const onSelect = vi.fn();
    render(wrap(<ComboBox label="City" options={options} onSelect={onSelect} />));
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'to' } });
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Tokyo',
      'Toronto',
    ]);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'Toronto' }));
    expect(input).toHaveValue('Toronto');
  });

  it('shows empty message for no matches', () => {
    render(wrap(<ComboBox label="City" options={options} />));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('multiple: picks become tags, query resets, backspace removes last', () => {
    const onSelectedChange = vi.fn();
    render(
      wrap(
        <ComboBox label="Cities" multiple options={options} onSelectedChange={onSelectedChange} />,
      ),
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'tok' } });
    fireEvent.click(screen.getByRole('option', { name: 'Tokyo' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['Tokyo']);
    expect(input).toHaveValue(''); // query reset
    expect(screen.getByText('Tokyo')).toBeInTheDocument(); // chip
    fireEvent.change(input, { target: { value: 'os' } });
    fireEvent.click(screen.getByRole('option', { name: 'Oslo' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['Tokyo', 'Oslo']);
    fireEvent.keyDown(input, { key: 'Backspace' }); // empty query → pop last tag
    expect(onSelectedChange).toHaveBeenLastCalledWith(['Tokyo']);
  });

  it('chosen options are excluded from the list', () => {
    render(wrap(<ComboBox label="Cities" multiple defaultSelected={['Tokyo']} options={options} />));
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.queryByRole('option', { name: 'Tokyo' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Toronto' })).toBeInTheDocument();
  });
});

describe('SelectionCard', () => {
  it('checkbox mode toggles; radio mode is exclusive', () => {
    const onChange = vi.fn();
    render(
      wrap(
        <>
          <SelectionCard title="Pro plan" description="For teams" onCheckedChange={onChange} />
          <SelectionCard mode="radio" name="plan" value="a" title="Plan A" defaultChecked />
          <SelectionCard mode="radio" name="plan" value="b" title="Plan B" />
        </>,
      ),
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]!);
    expect((radios[0] as HTMLInputElement).checked).toBe(false);
    expect((radios[1] as HTMLInputElement).checked).toBe(true);
  });
});

describe('alerts', () => {
  it('Banner uses alert role for warnings, status for info, and dismisses', () => {
    const onDismiss = vi.fn();
    render(
      wrap(
        <>
          <Banner severity="warning" title="Storage low" onDismiss={onDismiss}>
            Your archive is nearly full.
          </Banner>
          <InlineAlert severity="success">Saved successfully.</InlineAlert>
        </>,
      ),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Storage low');
    expect(screen.getByRole('status')).toHaveTextContent('Saved successfully.');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('toasts', () => {
  it('stacks, limits, and auto-dismisses', () => {
    vi.useFakeTimers();
    function Fire() {
      const { toast } = useToast();
      return (
        <button onClick={() => toast({ message: 'Saved', severity: 'success', duration: 1000 })}>
          fire
        </button>
      );
    }
    render(
      wrap(
        <ToastProvider limit={2}>
          <Fire />
        </ToastProvider>,
      ),
    );
    const btn = screen.getByRole('button', { name: 'fire' });
    act(() => {
      fireEvent.click(btn);
      fireEvent.click(btn);
      fireEvent.click(btn);
    });
    expect(screen.getAllByRole('status')).toHaveLength(2); // limit
    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
