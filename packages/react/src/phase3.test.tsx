import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@m3x/primitives';
import { Checkbox } from './checkbox/Checkbox';
import { Radio } from './checkbox/Radio';
import { Switch } from './switch/Switch';
import { Slider } from './slider/Slider';
import { AssistChip, FilterChip, InputChip, SuggestionChip } from './chips/Chips';
import { TextField } from './text-field/TextField';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('Checkbox', () => {
  it('toggles via label click and supports indeterminate', () => {
    const { rerender } = render(wrap(<Checkbox label="Terms" />));
    const box = screen.getByRole('checkbox', { name: 'Terms' });
    expect(box).not.toBeChecked();
    fireEvent.click(box);
    expect(box).toBeChecked();
    rerender(wrap(<Checkbox label="Terms" indeterminate />));
    expect((box as HTMLInputElement).indeterminate).toBe(true);
  });

  it('flags error with aria-invalid', () => {
    render(wrap(<Checkbox label="Req" error />));
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Radio', () => {
  it('selects within a group', () => {
    render(
      wrap(
        <>
          <Radio name="g" value="a" label="A" />
          <Radio name="g" value="b" label="B" />
        </>,
      ),
    );
    fireEvent.click(screen.getByRole('radio', { name: 'B' }));
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
  });
});

describe('Switch', () => {
  it('has switch role and toggles', () => {
    render(wrap(<Switch label="Wi-Fi" />));
    const sw = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(sw).not.toBeChecked();
    fireEvent.click(sw);
    expect(sw).toBeChecked();
  });

  it('supports controlled usage', () => {
    const onChange = vi.fn();
    render(wrap(<Switch label="Data" checked onChange={onChange} />));
    const sw = screen.getByRole('switch');
    expect(sw).toBeChecked();
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalled();
    expect(sw).toBeChecked(); // still controlled true
  });
});

describe('Slider', () => {
  it('exposes a native range input and reports changes', () => {
    const onChange = vi.fn();
    render(wrap(<Slider aria-label="Volume" min={0} max={10} defaultValue={5} onChange={onChange} />));
    const input = screen.getByRole('slider', { name: 'Volume' });
    fireEvent.change(input, { target: { value: '7' } });
    expect(onChange).toHaveBeenCalledWith(7);
    expect(input).toHaveValue('7');
  });
});

describe('Chips', () => {
  it('filter chip toggles selection', () => {
    render(wrap(<FilterChip icon="tune">Vegan</FilterChip>));
    const chip = screen.getByRole('button', { name: 'Vegan' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('input chip removes', () => {
    const onRemove = vi.fn();
    render(wrap(<InputChip onRemove={onRemove}>Alice</InputChip>));
    fireEvent.click(screen.getByRole('button', { name: /Remove/ }));
    expect(onRemove).toHaveBeenCalled();
  });

  it('assist + suggestion render as buttons', () => {
    render(
      wrap(
        <>
          <AssistChip icon="event">Add to calendar</AssistChip>
          <SuggestionChip>Sounds good</SuggestionChip>
        </>,
      ),
    );
    expect(screen.getByRole('button', { name: 'Add to calendar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sounds good' })).toBeInTheDocument();
  });
});

describe('TextField', () => {
  it('binds label, floats on value, and wires supporting text', () => {
    render(wrap(<TextField label="Email" supportingText="We never share it" />));
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('We never share it');
    const host = input.closest('.m3x-text-field')!;
    expect(host).not.toHaveAttribute('data-populated');
    fireEvent.change(input, { target: { value: 'a@b.c' } });
    expect(host).toHaveAttribute('data-populated');
  });

  it('error state swaps supporting text and sets aria-invalid', () => {
    render(
      wrap(
        <TextField label="Name" error errorText="Required" supportingText="Your full name" />,
      ),
    );
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Your full name')).not.toBeInTheDocument();
  });

  it('outlined renders the notch outline', () => {
    const { container } = render(wrap(<TextField variant="outlined" label="City" />));
    expect(container.querySelector('.m3x-text-field__outline')).toBeTruthy();
  });

  it('supports prefix/suffix and trailing icon action', () => {
    const onClick = vi.fn();
    render(
      wrap(
        <TextField
          label="Amount"
          prefix="$"
          suffix="USD"
          trailingIcon="close"
          onTrailingIconClick={onClick}
        />,
      ),
    );
    expect(screen.getByText('$')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Amount/ }));
    expect(onClick).toHaveBeenCalled();
  });
});
