// src/components/ui/EmptyTable.tsx
import React from "react";

export const Table: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const TableBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const TableCell: React.FC<{ children?: React.ReactNode; colSpan?: number; isHeader?: boolean; className?: string }> = ({ children }) => (
  <div>{children}</div>
);

export const TableHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const TableRow: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children }) => (
  <div>{children}</div>
);
