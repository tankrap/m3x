import * as React from 'react';
import { Icon } from '@ibx34/m3x-primitives';
import { Checkbox } from '../checkbox/Checkbox';
import { IconButton } from '../icon-button/IconButton';
import { Table, TableBody, TableCell, TableHead, TableRow } from './Table';

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  /** cell renderer; defaults to `row[key]` */
  render?: (row: T) => React.ReactNode;
  /** value used for sorting; defaults to `row[key]` */
  sortValue?: (row: T) => string | number;
  sortable?: boolean;
  numeric?: boolean;
  width?: number | string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** checkbox row selection */
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  /** initial sort */
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
  /** enable pagination with this page size */
  pageSize?: number;
  density?: 'compact' | 'standard' | 'comfortable';
  striped?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * DataTable: sortable columns, checkbox selection with a tri-state header,
 * optional pagination — built on the styled Table primitives.
 * Extras component.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selectable = false,
  selected,
  defaultSelected = [],
  onSelectedChange,
  defaultSort,
  pageSize,
  density = 'standard',
  striped = false,
  className,
  ...aria
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState(defaultSort ?? null);
  const [page, setPage] = React.useState(0);
  const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelected);
  const selectedKeys = selected ?? internalSelected;

  const setSelected = (keys: string[]) => {
    if (selected === undefined) setInternalSelected(keys);
    onSelectedChange?.(keys);
  };

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = col.sortValue ?? ((row: T) => (row as Record<string, unknown>)[col.key] as string | number);
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [rows, sort, columns]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const clampedPage = Math.min(page, pageCount - 1);
  const visible = pageSize
    ? sorted.slice(clampedPage * pageSize, (clampedPage + 1) * pageSize)
    : sorted;

  const visibleKeys = visible.map(rowKey);
  const allVisibleSelected =
    visibleKeys.length > 0 && visibleKeys.every((k) => selectedKeys.includes(k));
  const someVisibleSelected = visibleKeys.some((k) => selectedKeys.includes(k));

  const toggleAll = () => {
    if (allVisibleSelected) setSelected(selectedKeys.filter((k) => !visibleKeys.includes(k)));
    else setSelected([...new Set([...selectedKeys, ...visibleKeys])]);
  };

  const toggleRow = (key: string) => {
    setSelected(
      selectedKeys.includes(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key],
    );
  };

  const cycleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    setSort((prev) =>
      prev?.key !== col.key
        ? { key: col.key, direction: 'asc' }
        : prev.direction === 'asc'
          ? { key: col.key, direction: 'desc' }
          : null,
    );
  };

  return (
    <div className={['m3x-data-table', className].filter(Boolean).join(' ')}>
      <Table density={density} striped={striped} aria-label={aria['aria-label']}>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell header className="m3x-data-table__select-cell">
                <Checkbox
                  aria-label="Select all rows"
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected && !allVisibleSelected}
                  onChange={toggleAll}
                  size="s"
                />
              </TableCell>
            )}
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <TableCell
                  key={col.key}
                  header
                  numeric={col.numeric}
                  style={{ width: col.width }}
                  aria-sort={active ? (sort!.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="m3x-data-table__sort"
                      data-active={active || undefined}
                      onClick={() => cycleSort(col)}
                    >
                      {col.header}
                      <Icon size={16} className="m3x-data-table__sort-icon">
                        {active && sort!.direction === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                      </Icon>
                    </button>
                  ) : (
                    col.header
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((row) => {
            const key = rowKey(row);
            const isSelected = selectedKeys.includes(key);
            return (
              <TableRow key={key} selected={isSelected}>
                {selectable && (
                  <TableCell className="m3x-data-table__select-cell">
                    <Checkbox
                      aria-label={`Select row ${key}`}
                      checked={isSelected}
                      onChange={() => toggleRow(key)}
                      size="s"
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} numeric={col.numeric}>
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {pageSize && (
        <div className="m3x-data-table__footer">
          <span>
            {sorted.length === 0
              ? '0 of 0'
              : `${clampedPage * pageSize + 1}–${Math.min((clampedPage + 1) * pageSize, sorted.length)} of ${sorted.length}`}
          </span>
          <IconButton
            icon="chevron_left"
            aria-label="Previous page"
            disabled={clampedPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
          <IconButton
            icon="chevron_right"
            aria-label="Next page"
            disabled={clampedPage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          />
        </div>
      )}
    </div>
  );
}
