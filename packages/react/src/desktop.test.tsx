import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@tankmrap/m3x-primitives';
import { Sidebar } from './desktop/Sidebar';
import { NavBar } from './desktop/NavBar';
import { Breadcrumbs } from './desktop/Breadcrumbs';
import { TextField } from './text-field/TextField';
import { Select } from './select/Select';
import { Switch } from './switch/Switch';
import { Slider } from './slider/Slider';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('Sidebar', () => {
  const sections = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'home' },
        {
          id: 'projects',
          label: 'Projects',
          icon: 'folder',
          children: [
            { id: 'active', label: 'Active' },
            { id: 'archived', label: 'Archived' },
          ],
        },
      ],
    },
    { title: 'Workspace', items: [{ id: 'settings', label: 'Settings', icon: 'settings', badge: 2 }] },
  ];

  it('selects items and expands nested groups', () => {
    const onChange = vi.fn();
    render(wrap(<Sidebar sections={sections} onChange={onChange} />));
    expect(screen.getByRole('button', { name: /Home/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('Archived')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Projects/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Archived' }));
    expect(onChange).toHaveBeenCalledWith('archived');
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('collapsed mode hides row labels (they move into tooltips)', () => {
    render(wrap(<Sidebar sections={sections} collapsed />));
    expect(document.querySelector('.m3x-sidebar__label')).toBeNull();
    expect(document.querySelector('.m3x-sidebar--collapsed')).toBeTruthy();
    // label still reachable via the tooltip for accessibility
    expect(screen.getByText('Settings')).toHaveAttribute('role', 'tooltip');
  });
});

describe('NavBar', () => {
  it('switches active link and renders brand/actions', () => {
    const onChange = vi.fn();
    render(
      wrap(
        <NavBar
          brand={<span>Acme</span>}
          links={[
            { id: 'docs', label: 'Docs' },
            { id: 'pricing', label: 'Pricing' },
          ]}
          onChange={onChange}
          actions={<button>Sign in</button>}
        />,
      ),
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Pricing' }));
    expect(onChange).toHaveBeenCalledWith('pricing');
    expect(screen.getByRole('button', { name: 'Pricing' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});

describe('Breadcrumbs', () => {
  it('marks the last item as current page', () => {
    render(
      wrap(
        <Breadcrumbs
          items={[
            { label: 'Home', href: '#', icon: 'home' },
            { label: 'Projects', onClick: () => {} },
            { label: 'm3x' },
          ]}
        />,
      ),
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('m3x')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Home/ })).toBeInTheDocument();
  });
});

describe('input sizes', () => {
  it('TextField and Select apply size classes', () => {
    render(
      wrap(
        <>
          <TextField label="Small" size="s" />
          <Select label="Large" size="l" options={[{ value: 'a', label: 'A' }]} />
        </>,
      ),
    );
    expect(document.querySelector('.m3x-text-field--size-s')).toBeTruthy();
    expect(document.querySelector('.m3x-select.m3x-text-field--size-l')).toBeTruthy();
  });

  it('Switch scales its track; Slider applies size class', () => {
    render(
      wrap(
        <>
          <Switch size="l" aria-label="Big switch" />
          <Slider size="m" aria-label="Chunky slider" />
        </>,
      ),
    );
    const track = document.querySelector('.m3x-switch__track') as HTMLElement;
    expect(track.style.width).toBe('61.75px');
    expect(document.querySelector('.m3x-slider--size-m')).toBeTruthy();
  });

  it('multi-select options have no checkbox glyph, use check like single', () => {
    render(
      wrap(
        <Select
          label="Colors"
          multiple
          defaultValue={['red']}
          options={[
            { value: 'red', label: 'Red' },
            { value: 'green', label: 'Green' },
          ]}
        />,
      ),
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(document.querySelector('.m3x-select__option-checkbox')).toBeNull();
    const red = screen.getByRole('option', { name: /Red/ });
    expect(red).toHaveAttribute('aria-selected', 'true');
    expect(red.textContent).toContain('check');
  });
});
