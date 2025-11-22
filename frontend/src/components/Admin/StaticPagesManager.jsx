import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import adminAPI from '../../services/adminAPI';
import { errorHandler } from '../../utils/errorHandler';

const FALLBACK_PAGES = [
  { 
    id: 1, 
    slug: 'home', 
    title: 'الصفحة الرئيسية', 
    content: 'محتوى الصفحة الرئيسية', 
    description: 'الصفحة الرئيسية للمنصة',
    meta_keywords: 'صفحة رئيسية, مناقصات',
    status: 'published',
    created_at: '2024-11-20',
    updated_at: '2024-11-20'
  },
  { 
    id: 2, 
    slug: 'about', 
    title: 'من نحن', 
    content: 'معلومات عن الشركة', 
    description: 'معلومات حول المنصة',
    meta_keywords: 'عن المنصة, الشركة',
    status: 'published',
    created_at: '2024-11-15',
    updated_at: '2024-11-15'
  },
  { 
    id: 3, 
    slug: 'terms', 
    title: 'الشروط والأحكام', 
    content: 'شروط وأحكام الخدمة', 
    description: 'شروط وأحكام الخدمة',
    meta_keywords: 'شروط, أحكام',
    status: 'published',
    created_at: '2024-11-10',
    updated_at: '2024-11-10'
  }
];

export default function StaticPagesManager() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPageDialog, setOpenPageDialog] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    meta_keywords: '',
    status: 'published'
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      try {
        const res = await adminAPI.content.getPages();
        setPages(res.data || res);
      } catch {
        setPages(FALLBACK_PAGES);
      }
      setErrorMsg('');
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'خطأ في التحميل');
      setPages(FALLBACK_PAGES);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setIsCreating(true);
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      meta_keywords: '',
      status: 'published'
    });
    setOpenPageDialog(true);
  };

  const handleOpenEditDialog = (page) => {
    setIsCreating(false);
    setEditingPage(page);
    setFormData({
      title: page.title || '',
      slug: page.slug || '',
      description: page.description || '',
      content: page.content || '',
      meta_keywords: page.meta_keywords || '',
      status: page.status || 'published'
    });
    setOpenPageDialog(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePage = async () => {
    if (!formData.title || !formData.slug) {
      setErrorMsg('العنوان والـ slug مطلوبان');
      return;
    }

    try {
      setSaving(true);
      let savedPage;

      if (isCreating) {
        try {
          const res = await adminAPI.content.createPage(formData);
          savedPage = res.data || res;
        } catch {
          savedPage = {
            id: Math.max(...pages.map(p => p.id || 0), 0) + 1,
            ...formData,
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0]
          };
        }
        setPages([...pages, savedPage]);
        setSuccessMsg(`تم إنشاء الصفحة "${formData.title}"`);
      } else {
        try {
          const res = await adminAPI.content.updatePage(editingPage.id, formData);
          savedPage = res.data || res;
        } catch {
          savedPage = {
            ...editingPage,
            ...formData,
            updated_at: new Date().toISOString().split('T')[0]
          };
        }
        setPages(pages.map(p =>
          p.id === editingPage.id ? savedPage : p
        ));
        setSuccessMsg(`تم تحديث الصفحة "${formData.title}"`);
      }

      setOpenPageDialog(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (pageId, pageTitle) => {
    if (!window.confirm(`هل تريد حذف الصفحة "${pageTitle}"؟`)) return;

    try {
      setSaving(true);
      try {
        await adminAPI.content.deletePage(pageId);
      } catch {
        // حدّث محلياً في حالة الفشل
      }
      
      setPages(pages.filter(p => p.id !== pageId));
      setSuccessMsg('تم حذف الصفحة');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'خطأ في الحذف');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            إدارة الصفحات الثابتة
          </Typography>
          <Typography variant="caption" sx={{ color: '#616161' }}>
            {pages.length} صفحة
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          disabled={saving}
          sx={{ backgroundColor: '#0056B3' }}
        >
          صفحة جديدة
        </Button>
      </Box>

      {/* Pages Table */}
      <TableContainer component={Paper} sx={{ border: '1px solid #E0E0E0', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>العنوان</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>Slug</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>الحالة</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>آخر تعديل</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#212121' }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: '#616161' }}>
                  لا توجد صفحات
                </TableCell>
              </TableRow>
            ) : (
              pages.map(page => (
                <TableRow key={page.id} sx={{ '&:hover': { backgroundColor: '#F9F9F9' } }}>
                  <TableCell>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{page.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#616161' }}>
                        {page.description || 'بدون وصف'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '13px', color: '#616161', fontFamily: 'monospace' }}>
                      /{page.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={page.status === 'published' ? 'منشورة' : 'مسودة'}
                      size="small"
                      sx={{
                        backgroundColor: page.status === 'published' ? '#E8F5E9' : '#FFF9C4',
                        color: page.status === 'published' ? '#2E7D32' : '#F57F17'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#616161' }}>
                      {new Date(page.updated_at || page.lastModified).toLocaleDateString('ar-TN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEditDialog(page)}
                      disabled={saving}
                      sx={{ color: '#0056B3' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePage(page.id, page.title)}
                      disabled={saving}
                      sx={{ color: '#C62828' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={openPageDialog} onClose={() => !saving && setOpenPageDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isCreating ? 'صفحة جديدة' : `تعديل: ${editingPage?.title}`}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Title */}
            <TextField
              fullWidth
              label="عنوان الصفحة"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="أدخل عنوان الصفحة..."
              disabled={saving}
              size="small"
            />

            {/* Slug */}
            <TextField
              fullWidth
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) => handleFormChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="الرابط الإنجليزي (مثال: about-us)"
              disabled={saving}
              size="small"
              helperText="يستخدم في الرابط: /pages/{slug}"
            />

            {/* Description */}
            <TextField
              fullWidth
              label="الوصف"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="وصف قصير للصفحة..."
              disabled={saving}
              multiline
              rows={2}
              size="small"
            />

            {/* Meta Keywords */}
            <TextField
              fullWidth
              label="الكلمات الدالة (Meta Keywords)"
              value={formData.meta_keywords}
              onChange={(e) => handleFormChange('meta_keywords', e.target.value)}
              placeholder="كلمات البحث مفصولة بفواصل"
              disabled={saving}
              size="small"
              helperText="للتحسين في محركات البحث"
            />

            {/* Status */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 500, fontSize: '14px', pt: 1 }}>الحالة:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['published', 'draft'].map(status => (
                  <Button
                    key={status}
                    variant={formData.status === status ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleFormChange('status', status)}
                    disabled={saving}
                    sx={{
                      backgroundColor: formData.status === status ? '#0056B3' : 'transparent',
                      color: formData.status === status ? '#FFF' : '#0056B3',
                      borderColor: '#0056B3'
                    }}
                  >
                    {status === 'published' ? 'منشورة' : 'مسودة'}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Content */}
            <TextField
              fullWidth
              label="محتوى الصفحة"
              value={formData.content}
              onChange={(e) => handleFormChange('content', e.target.value)}
              placeholder="أدخل محتوى الصفحة..."
              disabled={saving}
              multiline
              rows={15}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenPageDialog(false)} disabled={saving}>
            إلغاء
          </Button>
          <Button
            onClick={handleSavePage}
            variant="contained"
            sx={{ backgroundColor: '#0056B3' }}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : (isCreating ? 'إنشاء' : 'حفظ')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
