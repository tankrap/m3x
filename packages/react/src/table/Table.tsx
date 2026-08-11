import * as React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** row height density */
  density?: 'compact' | 'standard' | 'comfortable';
  /** zebra-stripe the body rows */
  striped?: boolean;
  /** outline + rounded corners around the table */
  outlined?: boolean;
  children: React.ReactNode;
}

/** Styled semantic table. Compose with TableHead/TableBody/TableRow/TableCell. */
export function Table({
  density = 'standard',
  striped = false,
  outlined = true,
  className,
  children,
  ...rest
}: TableProps) {
  return (
    <div
      className={[
        'm3x-table__scroller',
        outlined ? 'm3x-table__scroller--outlined' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <table
        className={[
          'm3x-table',
          `m3x-table--${density}`,
          striped ? 'm3x-table--striped' : undefined,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** highlighted (e.g. selected) row */
  selected?: boolean;
}

export function TableRow({ selected, className, ...rest }: TableRowProps) {
  return (
    <tr
      className={[className].filter(Boolean).join(' ') || undefined}
      data-selected={selected || undefined}
      {...rest}
    />
  );
}

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** render as a header cell */
  header?: boolean;
  align?: 'left' | 'center' | 'right';
  /** numeric column (right-aligned, tabular figures) */
  numeric?: boolean;
}

export function TableCell({ header = false, align, numeric = false, className, ...rest }: TableCellProps) {
  const Tag = header ? 'th' : 'td';
  return (
    <Tag
      className={[
        'm3x-table__cell',
        numeric ? 'm3x-table__cell--numeric' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={align ? { textAlign: align, ...rest.style } : rest.style}
      {...(header ? { scope: 'col' } : {})}
      {...rest}
    />
  );
}
