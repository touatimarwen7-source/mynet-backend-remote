import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { procurementAPI } from '../api';
import { useToastContext } from '../contexts/ToastContext';
import { setPageTitle } from '../utils/pageTitle';

export default function CreateTenderImproved() {
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    budget_min: '',
    budget_max: '',
    currency: 'TND',
    deadline: '',
    specifications: '',
    requirements: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle('Créer un Appel d\'Offres');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La description est requise');
      return false;
    }
    if (!formData.budget_min || !formData.budget_max) {
      setError('Les budgets minimum et maximum sont requis');
      return false;
    }
    if (parseFloat(formData.budget_min) > parseFloat(formData.budget_max)) {
      setError('Le budget minimum doit être inférieur au budget maximum');
      return false;
    }
    if (!formData.deadline) {
      setError('La date de fermeture est requise');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await procurementAPI.createTender({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
        currency: formData.currency,
        deadline: formData.deadline,
        specifications: formData.specifications,
        requirements: formData.requirements
      });

      addToast('Appel d\'offres créé avec succès', 'success', 2000);
      setTimeout(() => {
        navigate(`/tenders`);
      }, 500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erreur lors de la création de l\'appel d\'offres';
      setError(errorMsg);
      addToast(errorMsg, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Card sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', boxShadow: 'none' }}>
          <CardContent sx={{ padding: '40px' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '28px', 
                fontWeight: 500, 
                color: '#0056B3', 
                marginBottom: '8px' 
              }}
            >
              Créer un Appel d'Offres
            </Typography>
            <Typography 
              sx={{ 
                color: '#616161', 
                marginBottom: '32px',
                fontSize: '14px'
              }}
            >
              Remplissez les détails de votre appel d'offres. Tous les champs marqués d'une astérisque (*) sont obligatoires.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ marginBottom: '24px', backgroundColor: '#ffebee', color: '#c62828' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section Générale */}
              <Box>
                <Typography 
                  sx={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#212121',
                    marginBottom: '16px'
                  }}
                >
                  Informations Générales
                </Typography>

                <TextField
                  fullWidth
                  label="Titre *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Fourniture d'équipements informatiques"
                  required
                  disabled={loading}
                  sx={{ marginBottom: '16px' }}
                />

                <TextField
                  fullWidth
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez en détail l'objet de votre appel d'offres, les services attendus, et les conditions de participation..."
                  multiline
                  rows={4}
                  required
                  disabled={loading}
                  sx={{ marginBottom: '16px' }}
                />

                <TextField
                  fullWidth
                  label="Spécifications Techniques"
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="Détailez les spécifications techniques, normes à respecter, délais de livraison, etc."
                  multiline
                  rows={3}
                  disabled={loading}
                  sx={{ marginBottom: '16px' }}
                />

                <TextField
                  fullWidth
                  label="Conditions et Exigences"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Mentionnez les exigences d'expérience, certifications, garanties, conditions de paiement, etc."
                  multiline
                  rows={3}
                  disabled={loading}
                />
              </Box>

              {/* Section Classification */}
              <Box>
                <Typography 
                  sx={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#212121',
                    marginBottom: '16px'
                  }}
                >
                  Classification
                </Typography>

                <FormControl fullWidth disabled={loading}>
                  <InputLabel>Catégorie *</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Catégorie"
                  >
                    <MenuItem value="technology">Technologie & Informatique</MenuItem>
                    <MenuItem value="supplies">Fournitures & Matériaux</MenuItem>
                    <MenuItem value="construction">Construction & Travaux</MenuItem>
                    <MenuItem value="services">Services</MenuItem>
                    <MenuItem value="consulting">Consulting & Expertise</MenuItem>
                    <MenuItem value="maintenance">Maintenance & Support</MenuItem>
                    <MenuItem value="training">Formation & Coaching</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Section Budget */}
              <Box>
                <Typography 
                  sx={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#212121',
                    marginBottom: '16px'
                  }}
                >
                  Budget
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '16px', marginBottom: '16px' }}>
                  <TextField
                    fullWidth
                    label="Budget Minimum (TND) *"
                    name="budget_min"
                    type="number"
                    inputProps={{ step: '0.01', min: '0' }}
                    value={formData.budget_min}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <TextField
                    fullWidth
                    label="Budget Maximum (TND) *"
                    name="budget_max"
                    type="number"
                    inputProps={{ step: '0.01', min: '0' }}
                    value={formData.budget_max}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Box>

                <FormControl fullWidth disabled={loading}>
                  <InputLabel>Devise</InputLabel>
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    label="Devise"
                  >
                    <MenuItem value="TND">Dinar Tunisien (TND)</MenuItem>
                    <MenuItem value="USD">Dollar Américain (USD)</MenuItem>
                    <MenuItem value="EUR">Euro (EUR)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Section Calendrier */}
              <Box>
                <Typography 
                  sx={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#212121',
                    marginBottom: '16px'
                  }}
                >
                  Calendrier
                </Typography>

                <TextField
                  fullWidth
                  label="Date de Fermeture *"
                  name="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  disabled={loading}
                  helperText="Sélectionnez la date et l'heure limite pour les soumissions"
                />
              </Box>

              {/* Boutons d'action */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '32px' }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    flex: 1,
                    backgroundColor: '#0056B3',
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: '44px',
                    fontSize: '14px',
                    '&:hover': { backgroundColor: '#0d47a1' },
                    '&:disabled': { backgroundColor: '#bdbdbd' }
                  }}
                >
                  {loading ? 'Création en cours...' : 'Créer l\'Appel d\'Offres'}
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => navigate('/tenders')}
                  disabled={loading}
                  startIcon={<CancelIcon />}
                  sx={{
                    flex: 1,
                    color: '#0056B3',
                    borderColor: '#0056B3',
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: '44px',
                    fontSize: '14px',
                    '&:hover': { 
                      backgroundColor: '#f0f7ff',
                      borderColor: '#0056B3'
                    }
                  }}
                >
                  Annuler
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
