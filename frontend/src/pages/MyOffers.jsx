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
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { setPageTitle } from '../utils/pageTitle';
import { useOptimizedFetch } from '../hooks/useOptimizedFetch';

export default function MyOffers() {
  const theme = institutionalTheme;
  const { data, loading, error, pagination, goToPage, fetchData } = useOptimizedFetch('/api/procurement/my-offers');

  useEffect(() => {
    setPageTitle('Mes offres');
    fetchData('/api/procurement/my-offers', { page: pagination.page, limit: 20 });
  }, [pagination.page]);

  const getStatusColor = (status) => {
    const colors = { 'submitted': '#4caf50', 'rejected': '#f44336', 'pending': '#ff9800', 'opened': '#2196f3' };
    return colors[status] || '#757575';
  };

  const offers = data?.offers || [];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: theme.palette.primary.main, mb: 3 }}>
          Mes offres
        </Typography>
        
        {error && <Alert severity="error">{error}</Alert>}
        
        {loading ? <CircularProgress /> : (
          <>
            <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>N° d'offre</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Montant</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id} sx={{ '&:hover': { backgroundColor: theme.palette.background.default } }}>
                      <TableCell>{offer.offer_number}</TableCell>
                      <TableCell>{offer.total_amount?.toLocaleString()} {offer.currency || 'TND'}</TableCell>
                      <TableCell>
                        <Chip label={offer.status} size="small" sx={{ backgroundColor: getStatusColor(offer.status) + '30', color: getStatusColor(offer.status) }} />
                      </TableCell>
                      <TableCell>{new Date(offer.submitted_at).toLocaleDateString('fr-TN')}</TableCell>
                      <TableCell align="center">
                        <Button size="small" startIcon={<EditIcon />} sx={{ color: theme.palette.primary.main, mr: 1 }}>Modifier</Button>
                        <Button size="small" startIcon={<DeleteIcon />} sx={{ color: '#C62828' }}>Supprimer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            
            {pagination && pagination.total > pagination.limit && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button disabled={pagination.page === 1} onClick={() => goToPage(pagination.page - 1)}>السابق</Button>
                <Typography sx={{ alignSelf: 'center' }}>{pagination.page} / {Math.ceil(pagination.total / pagination.limit)}</Typography>
                <Button disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)} onClick={() => goToPage(pagination.page + 1)}>التالي</Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
