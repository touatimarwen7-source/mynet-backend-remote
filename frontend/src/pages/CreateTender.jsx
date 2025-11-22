import { useState, useEffect, useCallback } from 'react';
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
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';

const STEPS = [
  { label: 'Infos de base', icon: '📋' },
  { label: 'Classification', icon: '🏷️' },
  { label: 'Budget & Devise', icon: '💰' },
  { label: 'Calendrier', icon: '📅' },
  { label: 'Exigences', icon: '✅' },
  { label: 'Critères', icon: '📊' },
  { label: 'Pièces jointes', icon: '📎' },
  { label: 'Révision', icon: '✔️' }
];

export default function CreateTender() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    budget_min: '',
    budget_max: '',
    currency: 'TND',
    deadline: '',
    opening_date: '',
    queries_start_date: '',
    queries_end_date: '',
    offer_validity_days: '90',
    alert_type: 'before_48h',
    is_public: true,
    requirements: [],
    attachments: [],
    evaluation_criteria: {
      price: 30,
      quality: 40,
      delivery: 20,
      experience: 10
    }
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [autoSaved, setAutoSaved] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [stepsCompleted, setStepsCompleted] = useState({});

  useEffect(() => {
    setPageTitle('Créer un Appel d\'Offres - Assistant');
    const saved = localStorage.getItem('tenderDraft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        // Brouillon corrompu, ignorer
      }
    }
  }, []);

  const autoSaveDraft = useCallback(() => {
    localStorage.setItem('tenderDraft', JSON.stringify(formData));
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCriteriaChange = (criterion, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      evaluation_criteria: {
        ...prev.evaluation_criteria,
        [criterion]: numValue
      }
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(f => ({ name: f.name, size: f.size }))]
    }));
  };

  const removeAttachment = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Infos de base
        if (!formData.title.trim() || formData.title.length < 5) {
          setError('Le titre doit contenir au moins 5 caractères');
          return false;
        }
        if (!formData.description.trim()) {
          setError('La description est requise');
          return false;
        }
        break;
      case 1: // Classification
        if (!formData.category) {
          setError('La catégorie est requise');
          return false;
        }
        break;
      case 2: // Budget
        if (!formData.budget_min || !formData.budget_max) {
          setError('Les budgets minimum et maximum sont requis');
          return false;
        }
        if (parseFloat(formData.budget_min) > parseFloat(formData.budget_max)) {
          setError('Le budget minimum doit être inférieur au budget maximum');
          return false;
        }
        break;
      case 3: // Calendrier
        if (!formData.deadline) {
          setError('La date de fermeture est requise');
          return false;
        }
        if (new Date(formData.deadline) <= new Date()) {
          setError('La date de fermeture doit être dans le futur');
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      autoSaveDraft();
      setStepsCompleted(prev => ({
        ...prev,
        [activeStep]: true
      }));
      setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const totalCriteria = Object.values(formData.evaluation_criteria).reduce((a, b) => a + b, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep(2) || !validateStep(3)) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
        opening_date: formData.opening_date || new Date(formData.deadline).toISOString(),
      };

      const response = await procurementAPI.createTender(submitData);
      localStorage.removeItem('tenderDraft');
      navigate(`/tender/${response.data.tender.id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erreur lors de la création de l\'appel d\'offres';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Basic Info
  const Step1Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TextField
        fullWidth
        label="Titre de la Manaçaise *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Ex: Fourniture d'équipements informatiques"
        disabled={loading}
        helperText={`${formData.title.length}/100 caractères`}
        inputProps={{ maxLength: 100 }}
      />

      <TextField
        fullWidth
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Décrivez en détail l'objet de votre appel d'offres..."
        multiline
        rows={4}
        disabled={loading}
      />

      <FormControlLabel
        control={
          <Checkbox
            name="is_public"
            checked={formData.is_public}
            onChange={handleChange}
            disabled={loading}
          />
        }
        label="Appel d'offres public (visible pour tous les fournisseurs)"
      />
    </Box>
  );

  // Step 2: Classification
  const Step2Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
      <Typography sx={{ color: '#616161', fontSize: '13px', marginTop: '8px' }}>
        La classification aide à diriger votre appel d'offres vers les fournisseurs pertinents via le système UNSPSC.
      </Typography>
    </Box>
  );

  // Step 3: Budget
  const Step3Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '16px' }}>
        <TextField
          fullWidth
          label="Budget Minimum (TND) *"
          name="budget_min"
          type="number"
          inputProps={{ step: '0.01', min: '0' }}
          value={formData.budget_min}
          onChange={handleChange}
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
  );

  // Step 4: Timeline
  const Step4Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TextField
        fullWidth
        label="Date de Fermeture (Submission Deadline) *"
        name="deadline"
        type="datetime-local"
        value={formData.deadline}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        disabled={loading}
        helperText="Date limite pour soumettre les offres"
      />

      <TextField
        fullWidth
        label="Date d'Ouverture (Decryption Date)"
        name="opening_date"
        type="datetime-local"
        value={formData.opening_date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        disabled={loading}
        helperText="Date où les offres cryptées seront déchiffrées"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '16px' }}>
        <TextField
          fullWidth
          label="Début des Enquêtes"
          name="queries_start_date"
          type="datetime-local"
          value={formData.queries_start_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Fin des Enquêtes"
          name="queries_end_date"
          type="datetime-local"
          value={formData.queries_end_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          disabled={loading}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '16px' }}>
        <TextField
          fullWidth
          label="Validité des Offres (jours)"
          name="offer_validity_days"
          type="number"
          inputProps={{ min: '1' }}
          value={formData.offer_validity_days}
          onChange={handleChange}
          disabled={loading}
        />
        <FormControl fullWidth disabled={loading}>
          <InputLabel>Système d'Alerte</InputLabel>
          <Select
            name="alert_type"
            value={formData.alert_type}
            onChange={handleChange}
            label="Système d'Alerte"
          >
            <MenuItem value="before_48h">48 heures avant fermeture</MenuItem>
            <MenuItem value="before_24h">24 heures avant fermeture</MenuItem>
            <MenuItem value="before_1h">1 heure avant fermeture</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  // Step 5: Requirements
  const Step5Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <TextField
          fullWidth
          label="Ajouter une exigence"
          value={newRequirement}
          onChange={(e) => setNewRequirement(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
          disabled={loading}
          placeholder="Ex: Expérience minimale de 3 ans"
        />
        <Button
          variant="outlined"
          onClick={addRequirement}
          disabled={loading || !newRequirement.trim()}
          sx={{ color: '#0056B3', borderColor: '#0056B3', minWidth: '44px' }}
        >
          <AddIcon />
        </Button>
      </Box>

      {formData.requirements.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formData.requirements.map((req, index) => (
            <Chip
              key={index}
              label={req}
              onDelete={() => removeRequirement(index)}
              sx={{ backgroundColor: '#e3f2fd', color: '#0056B3' }}
            />
          ))}
        </Box>
      )}
    </Box>
  );

  // Step 6: Criteria
  const Step6Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography sx={{ color: '#616161', fontSize: '13px' }}>
        Réglez le poids de chaque critère d'évaluation (total: {totalCriteria}%)
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '16px' }}>
        {Object.entries(formData.evaluation_criteria).map(([key, value]) => (
          <TextField
            key={key}
            label={`${key === 'price' ? 'Prix' : key === 'quality' ? 'Qualité' : key === 'delivery' ? 'Livraison' : 'Expérience'} (%)`}
            type="number"
            inputProps={{ min: '0', max: '100', step: '1' }}
            value={value}
            onChange={(e) => handleCriteriaChange(key, e.target.value)}
            disabled={loading}
          />
        ))}
      </Box>

      {totalCriteria !== 100 && (
        <Alert severity="warning" sx={{ backgroundColor: '#fff3cd', color: '#856404' }}>
          Le total des critères doit égaler 100% (actuellement: {totalCriteria}%)
        </Alert>
      )}
    </Box>
  );

  // Step 7: Attachments
  const Step7Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        disabled={loading}
        sx={{ color: '#0056B3', borderColor: '#0056B3' }}
      >
        Télécharger des fichiers
        <input
          type="file"
          multiple
          hidden
          onChange={handleFileUpload}
        />
      </Button>

      {selectedFiles.length > 0 && (
        <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#212121' }}>Nom du fichier</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#212121' }}>Taille</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#212121' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell align="right">{(file.size / 1024).toFixed(2)} KB</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => removeAttachment(index)}
                      disabled={loading}
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  // Step 8: Review
  const Step8Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Alert severity="info" sx={{ backgroundColor: '#e3f2fd', color: '#01579b' }}>
        Veuillez vérifier tous les détails avant de soumettre votre appel d'offres.
      </Alert>

      <Paper sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" sx={{ color: '#0056B3', marginBottom: '12px' }}>Résumé</Typography>
        <Stack spacing={1} sx={{ fontSize: '13px' }}>
          <Box><strong>Titre:</strong> {formData.title}</Box>
          <Box><strong>Catégorie:</strong> {formData.category}</Box>
          <Box><strong>Budget:</strong> {formData.budget_min} - {formData.budget_max} {formData.currency}</Box>
          <Box><strong>Fermeture:</strong> {new Date(formData.deadline).toLocaleDateString('fr-TN')}</Box>
          <Box><strong>Public:</strong> {formData.is_public ? 'Oui' : 'Non'}</Box>
          <Box><strong>Exigences:</strong> {formData.requirements.length}</Box>
          <Box><strong>Pièces jointes:</strong> {selectedFiles.length}</Box>
        </Stack>
      </Paper>
    </Box>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return <Step1Content />;
      case 1: return <Step2Content />;
      case 2: return <Step3Content />;
      case 3: return <Step4Content />;
      case 4: return <Step5Content />;
      case 5: return <Step6Content />;
      case 6: return <Step7Content />;
      case 7: return <Step8Content />;
      default: return null;
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
              {STEPS[activeStep].icon} {STEPS[activeStep].label}
            </Typography>
            <Typography 
              sx={{ 
                color: '#616161', 
                marginBottom: '32px',
                fontSize: '14px'
              }}
            >
              Étape {activeStep + 1} sur {STEPS.length}
            </Typography>

            {/* Progress Bar */}
            <LinearProgress 
              variant="determinate" 
              value={(activeStep / (STEPS.length - 1)) * 100}
              sx={{ marginBottom: '24px', height: '4px' }}
            />

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ marginBottom: '32px', display: { xs: 'none', sm: 'flex' } }}>
              {STEPS.map((step, index) => (
                <Step key={index} completed={stepsCompleted[index] || false}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ marginBottom: '24px', backgroundColor: '#ffebee', color: '#c62828' }}>
                {error}
              </Alert>
            )}

            {/* Auto-save Notification */}
            {autoSaved && (
              <Alert severity="success" sx={{ marginBottom: '16px', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                ✓ Brouillon enregistré automatiquement
              </Alert>
            )}

            {/* Step Content */}
            <Box sx={{ minHeight: '300px', marginBottom: '32px' }}>
              {renderStepContent()}
            </Box>

            {/* Navigation Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '32px' }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={activeStep === 0 || loading}
                sx={{
                  color: '#0056B3',
                  borderColor: '#0056B3',
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: '44px',
                }}
              >
                Précédent
              </Button>

              {activeStep === STEPS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || totalCriteria !== 100}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
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
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    flex: 1,
                    backgroundColor: '#0056B3',
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: '44px',
                  }}
                >
                  Suivant
                </Button>
              )}

              <Button
                variant="outlined"
                type="button"
                onClick={() => setShowExitDialog(true)}
                disabled={loading}
                startIcon={<CancelIcon />}
                sx={{
                  color: '#d32f2f',
                  borderColor: '#d32f2f',
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: '44px',
                }}
              >
                Annuler
              </Button>
            </Stack>

            {/* Save Draft Button */}
            <Button
              variant="text"
              size="small"
              onClick={autoSaveDraft}
              startIcon={<SaveIcon />}
              sx={{
                marginTop: '16px',
                color: '#616161',
                textTransform: 'none'
              }}
            >
              Enregistrer le brouillon
            </Button>
          </CardContent>
        </Card>

        {/* Exit Confirmation Dialog */}
        <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
          <DialogTitle>Quitter l'Assistante?</DialogTitle>
          <DialogContent>
            <Typography>
              Votre brouillon a été sauvegardé. Vous pouvez le reprendre plus tard.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowExitDialog(false)} sx={{ color: '#0056B3' }}>
              Continuer
            </Button>
            <Button
              onClick={() => {
                setShowExitDialog(false);
                navigate('/tenders');
              }}
              sx={{ color: '#d32f2f' }}
            >
              Quitter
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
