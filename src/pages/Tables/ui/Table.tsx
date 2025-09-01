import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <table className={`w-full ${className}`}>
      {children}
    </table>
  );
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={className}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={className}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', isHeader = false }: TableCellProps) {
  const Component = isHeader ? 'th' : 'td';
  
  return (
    <Component className={className}>
      {children}
    </Component>
  );
}