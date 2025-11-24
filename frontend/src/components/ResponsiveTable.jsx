/**
 * 📱 Responsive Table Component - Mobile-First Design
 * 
 * Features:
 * - Desktop: Full table view
 * - Tablet: Compact table with horizontal scroll
 * - Mobile: Card-based stack view with collapsible rows
 * - 100% MUI-based, zero custom CSS
 * - Theme-compliant colors and spacing
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Box,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Typography,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { CONSISTENT_SX } from '../utils/consistencyHelper';

/**
 * Responsive Table - Adapts to screen size
 * 
 * Props:
 * - columns: Array of { id, label (French), width? }
 * - rows: Array of row objects
 * - renderCell: (value, column, row) => JSX (optional)
 * - onRowClick: (row) => void (optional)
 * - actions: Array of action buttons (optional)
 */
export const ResponsiveTable = ({
  columns,
  rows,
  renderCell,
  onRowClick,
  actions,
  title,
  emptyMessage = 'Aucune donnée',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpansion = (rowIndex) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  if (rows.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  // Mobile: Card-based stack view
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
        {rows.map((row, rowIndex) => (
          <Card key={rowIndex} sx={CONSISTENT_SX.card(theme)}>
            <CardContent sx={{ p: theme.spacing(2) }}>
              {/* Header row with expand button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: theme.spacing(1),
                }}
                onClick={() => toggleRowExpansion(rowIndex)}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {row[columns[0]?.id] || `${title} ${rowIndex + 1}`}
                </Typography>
                <IconButton size="small">
                  {expandedRows[rowIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              {/* Collapsible content */}
              <Collapse in={expandedRows[rowIndex]} timeout="auto" unmountOnExit>
                <Box sx={{ mt: theme.spacing(2) }}>
                  {columns.map(column => (
                    <Box
                      key={column.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: theme.spacing(1),
                        borderTop: `1px solid ${theme.palette.divider}`,
                        '&:first-of-type': { borderTop: 'none' },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
                      >
                        {column.label}:
                      </Typography>
                      <Typography variant="body2">
                        {renderCell
                          ? renderCell(row[column.id], column, row)
                          : row[column.id]}
                      </Typography>
                    </Box>
                  ))}

                  {/* Actions */}
                  {actions && (
                    <Box sx={{ mt: theme.spacing(2), display: 'flex', gap: theme.spacing(1) }}>
                      {actions.map((action, idx) => (
                        <Box key={idx} sx={{ flex: 1 }}>
                          {action.render(row, rowIndex)}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Tablet: Compact table with horizontal scroll
  if (isTablet) {
    return (
      <TableContainer
        component={Paper}
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Table size="small" sx={CONSISTENT_SX.table(theme)}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    p: theme.spacing(1),
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': onRowClick
                    ? { backgroundColor: theme.palette.action.hover }
                    : {},
                }}
              >
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    sx={{
                      p: theme.spacing(1),
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: column.width || '150px',
                    }}
                  >
                    {renderCell
                      ? renderCell(row[column.id], column, row)
                      : row[column.id]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center" sx={{ p: theme.spacing(1) }}>
                    {actions.map((action, idx) => (
                      <Box key={idx} sx={{ display: 'inline', mr: theme.spacing(0.5) }}>
                        {action.render(row, rowIndex)}
                      </Box>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Desktop: Full table view
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Table sx={CONSISTENT_SX.table(theme)}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
            {columns.map(column => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  p: theme.spacing(2),
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {actions && (
              <TableCell align="center" sx={{ fontWeight: theme.typography.fontWeightBold }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': onRowClick
                  ? { backgroundColor: theme.palette.action.hover }
                  : {},
              }}
            >
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  sx={{
                    p: theme.spacing(2),
                    width: column.width,
                  }}
                >
                  {renderCell
                    ? renderCell(row[column.id], column, row)
                    : row[column.id]}
                </TableCell>
              ))}
              {actions && (
                <TableCell align="center" sx={{ p: theme.spacing(2) }}>
                  {actions.map((action, idx) => (
                    <Box key={idx} sx={{ display: 'inline', mr: theme.spacing(1) }}>
                      {action.render(row, rowIndex)}
                    </Box>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;
