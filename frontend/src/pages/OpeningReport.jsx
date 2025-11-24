import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import institutionalTheme from '../theme/theme';
import {
  Container, Box, Card, CardContent, Typography, Button, Table,
  TableHead, TableBody, TableRow, TableCell, CircularProgress,
  Alert, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';

export default function OpeningReport() {
  const theme = institutionalTheme;
  const { tenderId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportDialog, setExportDialog] = useState(false);

  useEffect(() => {
    setPageTitle('محضر الفتح');
    loadOpeningReport();
  }, [tenderId]);

  const loadOpeningReport = async () => {
    try {
      setLoading(true);
      const res = await procurementAPI.get(`/opening-reports/tenders/${tenderId}/opening-report`);
      setReport(res.data.report);
    } catch (err) {
      setError('خطأ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await procurementAPI.get(`/opening-reports/${report.id}/export?format=${format}`);
      const dataStr = JSON.stringify(res.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `opening-report-${tenderId}.${format}`;
      link.click();
      setExportDialog(false);
    } catch (err) {
      setError('خطأ في التنزيل');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  if (!report) {
    return <Container maxWidth="md" sx={{ py: '40px' }}><Alert severity="error">{error}</Alert></Container>;
  }

  const offersData = Array.isArray(report.offers_data) ? report.offers_data : JSON.parse(report.offers_data || '[]');

  return (
    <Box sx={{ backgroundColor: '#FAFAFA', paddingY: '40px', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: '16px' }}>رجوع</Button>

        <Card sx={{ border: '1px solid #E0E0E0', borderRadius: '4px', mb: '24px' }}>
          <CardContent sx={{ padding: '24px' }}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, mb: '8px' }}>📋 محضر الفتح</Typography>
            <Typography sx={{ fontSize: '14px', color: '#666666' }}>تقرير رسمي بتفاصيل جميع العروض</Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: '1px solid #E0E0E0', borderRadius: '4px', mb: '24px' }}>
          <CardContent sx={{ padding: '24px' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', mb: '24px' }}>
              <Box><Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#999999' }}>رقم المناقصة</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>#{report.tender_number || 'N/A'}</Typography>
              </Box>
              <Box><Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#999999' }}>وقت الفتح</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>{new Date(report.opened_at).toLocaleString('ar-TN')}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', p: '16px', backgroundColor: '#F5F5F5', borderRadius: '4px' }}>
              <Box><Typography sx={{ fontSize: '12px', color: '#666666' }}>العروض الكلية</Typography>
                <Typography sx={{ fontSize: '24px', fontWeight: 700, color: theme.palette.primary.main }}>{report.total_offers_received || 0}</Typography>
              </Box>
              <Box><Typography sx={{ fontSize: '12px', color: '#666666' }}>الصالحة</Typography>
                <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#4caf50' }}>{report.total_valid_offers || 0}</Typography>
              </Box>
              <Box><Typography sx={{ fontSize: '12px', color: '#666666' }}>غير الصالحة</Typography>
                <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#d32f2f' }}>{report.total_invalid_offers || 0}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ border: '1px solid #E0E0E0', borderRadius: '4px', mb: '24px' }}>
          <CardContent sx={{ padding: '24px' }}>
            <Typography variant="h6" sx={{ mb: '16px', fontWeight: 600 }}>📊 العروض</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>المورد</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>المبلغ</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الوقت</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {offersData.map((offer, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{offer.supplier_name}</TableCell>
                      <TableCell>{offer.total_amount.toLocaleString('ar-TN', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{new Date(offer.submitted_at).toLocaleString('ar-TN')}</TableCell>
                      <TableCell><Chip icon={<VerifiedIcon />} label="مستقبل" color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={2} sx={{ mb: '24px' }}>
          <Button startIcon={<PrintIcon />} onClick={() => window.print()} variant="outlined">طباعة</Button>
          <Button startIcon={<DownloadIcon />} onClick={() => setExportDialog(true)} variant="contained" sx={{ backgroundColor: theme.palette.primary.main }}>تنزيل</Button>
        </Stack>

        <Dialog open={exportDialog} onClose={() => setExportDialog(false)}>
          <DialogTitle>تنزيل محضر الفتح</DialogTitle>
          <DialogContent><Typography>اختر صيغة التنزيل:</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialog(false)}>إلغاء</Button>
            <Button onClick={() => handleExport('json')} variant="contained">JSON</Button>
            <Button onClick={() => handleExport('pdf')} variant="contained">PDF</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
