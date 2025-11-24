import { useEffect } from 'react';
import institutionalTheme from '../theme/theme';
import {
  Container,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Chip,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { setPageTitle } from '../utils/pageTitle';
import { useOptimizedFetch } from '../hooks/useOptimizedFetch';

export default function InvoiceManagement() {
  const theme = institutionalTheme;
  const { data, loading, error, pagination, goToPage, fetchData } = useOptimizedFetch('/api/procurement/invoices');

  useEffect(() => {
    setPageTitle('Gestion des factures');
    fetchData('/api/procurement/invoices', { page: pagination.page, limit: 20 });
  }, [pagination.page]);

  const invoices = data?.invoices || [];

  const getStatusColor = (status) => {
    const colors = { 'paid': '#4caf50', 'pending': '#ff9800', 'overdue': '#f44336' };
    return colors[status] || '#757575';
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: theme.palette.primary.main, mb: 3 }}>
          Gestion des factures
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'إجمالي الفواتير', value: pagination?.total || '0' },
            { label: 'حالة الدفع', value: invoices.length > 0 ? invoices.length : '0' },
            { label: 'المبلغ الإجمالي', value: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0).toLocaleString() + ' TND' }
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ backgroundColor: '#FFF', p: 2, borderRadius: '8px', border: '1px solid #E0E0E0' }}>
                <Typography sx={{ color: '#616161', fontSize: '12px' }}>{stat.label}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '20px', color: theme.palette.primary.main }}>{stat.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>N° de facture</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Montant</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Date d'échéance</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} sx={{ '&:hover': { backgroundColor: theme.palette.background.default } }}>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>{inv.amount.toLocaleString()} TND</TableCell>
                  <TableCell>
                    <Chip label={inv.status} size="small" sx={{ backgroundColor: getStatusColor(inv.status) + '30', color: getStatusColor(inv.status) }} />
                  </TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.dueDate}</TableCell>
                  <TableCell align="center">
                    <Button size="small" startIcon={<VisibilityIcon />} sx={{ color: theme.palette.primary.main, mr: 1 }}>Afficher</Button>
                    <Button size="small" startIcon={<DownloadIcon />} sx={{ color: theme.palette.primary.main }}>Télécharger</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
}
