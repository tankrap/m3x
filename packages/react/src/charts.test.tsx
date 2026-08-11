import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@ibx34/m3x-primitives';
import { Gauge, SegmentedArcGauge } from './charts/Gauge';
import { PieChart } from './charts/PieChart';
import { ContributionChart } from './charts/ContributionChart';
import { BarChart } from './charts/BarChart';
import { AreaChart, LineChart } from './charts/LineChart';
import { niceTicks, smoothPath } from './charts/utils';
import { Table, TableBody, TableCell, TableHead, TableRow } from './table/Table';
import { DataTable } from './table/DataTable';

const wrap = (ui: React.ReactElement) => (
  <ThemeProvider seedColor="#6750A4">{ui}</ThemeProvider>
);

describe('chart utils', () => {
  it('niceTicks covers the max with round steps', () => {
    expect(niceTicks(87)).toEqual([0, 20, 40, 60, 80, 100]);
    expect(niceTicks(4)).toEqual([0, 1, 2, 3, 4]);
  });

  it('smoothPath emits cubic segments through all points', () => {
    const d = smoothPath([
      { x: 0, y: 0 },
      { x: 10, y: 20 },
      { x: 20, y: 5 },
    ]);
    expect(d.startsWith('M 0')).toBe(true);
    expect((d.match(/C /g) ?? []).length).toBe(2);
    expect(d).toContain('20.00 5.00');
  });
});

describe('Gauge', () => {
  it('exposes meter semantics and renders value + label', () => {
    render(wrap(<Gauge value={72} label="score" aria-label="Health score" />));
    const meter = screen.getByRole('meter', { name: 'Health score' });
    expect(meter).toHaveAttribute('aria-valuenow', '72');
    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('score')).toBeInTheDocument();
  });
});

describe('SegmentedArcGauge', () => {
  it('renders one arc per non-zero segment plus remainder track', () => {
    const { container } = render(
      wrap(
        <SegmentedArcGauge
          segments={[
            { value: 40, label: 'Apps' },
            { value: 20, label: 'Media' },
            { value: 0, label: 'Empty' },
          ]}
          total={100}
          legend
        />,
      ),
    );
    expect(container.querySelectorAll('.m3x-gauge__value')).toHaveLength(2);
    expect(container.querySelectorAll('.m3x-gauge__track')).toHaveLength(1);
    expect(screen.getByText('Apps')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument(); // center sum
  });
});

describe('PieChart', () => {
  it('renders slices and legend percentages', () => {
    const { container } = render(
      wrap(
        <PieChart
          slices={[
            { value: 3, label: 'A' },
            { value: 1, label: 'B' },
          ]}
        />,
      ),
    );
    expect(container.querySelectorAll('.m3x-pie__slice')).toHaveLength(2);
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});

describe('ContributionChart', () => {
  it('buckets values into levels and titles cells', () => {
    const { container } = render(
      wrap(
        <ContributionChart
          endDate={new Date(2026, 7, 10)}
          weeks={4}
          entries={[
            { date: '2026-08-10', value: 8 },
            { date: '2026-08-09', value: 2 },
          ]}
        />,
      ),
    );
    const cells = container.querySelectorAll('.m3x-heatmap__cell');
    expect(cells.length).toBeGreaterThan(20);
    expect(container.querySelectorAll('[data-level="4"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-level="1"]')).toHaveLength(1);
    // hovering a cell shows the floating tooltip
    fireEvent.pointerEnter(container.querySelector('[data-level="4"]')!);
    expect(container.querySelector('.m3x-heatmap__tooltip')?.textContent).toBe('2026-08-10: 8');
  });
});

describe('BarChart / LineChart / AreaChart', () => {
  it('renders bars with titles and grid ticks', () => {
    const { container } = render(
      wrap(
        <BarChart
          data={[
            { label: 'Mon', value: 12 },
            { label: 'Tue', value: 30 },
          ]}
          showValues
        />,
      ),
    );
    expect(container.querySelectorAll('.m3x-bar-chart__bar')).toHaveLength(2);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(container.querySelector('.m3x-bar-chart__bar title')?.textContent).toBe('Mon: 12');
  });

  it('line chart draws one path per series; area adds fills', () => {
    const series = [
      { label: 'North', values: [1, 4, 2, 8] },
      { label: 'South', values: [2, 3, 5, 1] },
    ];
    const { container, rerender } = render(wrap(<LineChart series={series} legend />));
    expect(container.querySelectorAll('.m3x-line-chart__line')).toHaveLength(2);
    expect(container.querySelectorAll('.m3x-line-chart__area')).toHaveLength(0);
    expect(screen.getAllByText('North').length).toBeGreaterThan(0); // legend + path title
    rerender(wrap(<AreaChart series={series} />));
    expect(container.querySelectorAll('.m3x-line-chart__area')).toHaveLength(2);
  });
});

describe('Table', () => {
  it('renders semantic structure with density class', () => {
    render(
      wrap(
        <Table density="compact" aria-label="Basic">
          <TableHead>
            <TableRow>
              <TableCell header>Name</TableCell>
              <TableCell header numeric>Qty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Widget</TableCell>
              <TableCell numeric>3</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      ),
    );
    expect(screen.getByRole('table', { name: 'Basic' })).toHaveClass('m3x-table--compact');
    expect(screen.getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument();
  });
});

describe('DataTable', () => {
  const rows = [
    { id: 'a', name: 'Cherry', qty: 5 },
    { id: 'b', name: 'Apple', qty: 12 },
    { id: 'c', name: 'Banana', qty: 2 },
  ];
  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'qty', header: 'Qty', sortable: true, numeric: true },
  ];

  const names = () =>
    screen.getAllByRole('row').slice(1).map((r) => r.textContent?.replace(/Select row \w/, ''));

  it('sorts asc → desc → none on header clicks', () => {
    render(wrap(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />));
    const sortBtn = screen.getByRole('button', { name: /Name/ });
    fireEvent.click(sortBtn);
    expect(names()).toEqual(['Apple12', 'Banana2', 'Cherry5']);
    fireEvent.click(sortBtn);
    expect(names()).toEqual(['Cherry5', 'Banana2', 'Apple12']);
    fireEvent.click(sortBtn);
    expect(names()).toEqual(['Cherry5', 'Apple12', 'Banana2']); // original order
  });

  it('selection: header checkbox is tri-state and toggles all', () => {
    const onSelectedChange = vi.fn();
    render(
      wrap(
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          selectable
          onSelectedChange={onSelectedChange}
        />,
      ),
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row a' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['a']);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectedChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);
  });

  it('paginates with footer controls', () => {
    render(
      wrap(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} pageSize={2} />),
    );
    expect(screen.getByText('1–2 of 3')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('3–3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
});
