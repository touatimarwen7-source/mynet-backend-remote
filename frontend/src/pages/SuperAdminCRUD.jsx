import { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Tabs,
  Tab,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ paddingTop: '24px' }}>{children}</Box>}
    </div>
  );
}

export default function SuperAdminCRUD() {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  const staticPages = [
    { id: 1, title: 'Accueil', slug: 'home', status: 'publié', updatedAt: '2025-01-20' },
    { id: 2, title: 'À Propos', slug: 'about', status: 'publié', updatedAt: '2025-01-19' },
    { id: 3, title: 'Solutions', slug: 'solutions', status: 'brouillon', updatedAt: '2025-01-18' },
    { id: 4, title: 'Tarification', slug: 'pricing', status: 'publié', updatedAt: '2025-01-17' },
    { id: 5, title: 'Contact', slug: 'contact', status: 'publié', updatedAt: '2025-01-15' },
  ];

  const files = [
    { id: 1, name: 'logo-mynet.png', type: 'Image', size: '245 KB', uploadedAt: '2025-01-20', url: '/storage/logo.png' },
    { id: 2, name: 'hero-banner.jpg', type: 'Image', size: '512 KB', uploadedAt: '2025-01-19', url: '/storage/banner.jpg' },
    { id: 3, name: 'terms-of-service.pdf', type: 'Document', size: '125 KB', uploadedAt: '2025-01-18', url: '/storage/terms.pdf' },
    { id: 4, name: 'privacy-policy.pdf', type: 'Document', size: '98 KB', uploadedAt: '2025-01-17', url: '/storage/privacy.pdf' },
  ];

  const openEditDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#212121', marginBottom: '32px' }}>
          Centre de Contrôle Super Admin
        </Typography>

        <Paper sx={{ border: '1px solid #e0e0e0' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                color: '#666',
                fontWeight: 500,
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: '#0056B3',
              },
            }}
          >
            <Tab label="Pages Statiques" />
            <Tab label="Gestion des Fichiers" />
            <Tab label="Documents" />
            <Tab label="Paramètres" />
          </Tabs>

          {/* Pages Statiques Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ padding: '24px' }}>
              <Stack direction="row" spacing={2} sx={{ marginBottom: '24px' }}>
                <Typography sx={{ fontWeight: 600, color: '#212121', flex: 1 }}>
                  Gestion des Pages Statiques
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => openEditDialog('page')}
                  sx={{ backgroundColor: '#0056B3' }}
                >
                  Créer une Page
                </Button>
              </Stack>

              <Paper sx={{ border: '1px solid #e0e0e0' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Titre</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Mise à jour</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staticPages.map((page) => (
                      <TableRow key={page.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{page.title}</TableCell>
                        <TableCell>/{page.slug}</TableCell>
                        <TableCell>
                          <Box sx={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            backgroundColor: page.status === 'publié' ? '#e8f5e9' : '#fff3e0',
                            color: page.status === 'publié' ? '#2e7d32' : '#e65100',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {page.status}
                          </Box>
                        </TableCell>
                        <TableCell>{page.updatedAt}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" startIcon={<VisibilityIcon />} sx={{ color: '#0056B3' }}>
                              Aperçu
                            </Button>
                            <Button size="small" startIcon={<EditIcon />} sx={{ color: '#0056B3' }}>
                              Modifier
                            </Button>
                            <Button size="small" startIcon={<DeleteIcon />} sx={{ color: '#c62828' }}>
                              Supprimer
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </TabPanel>

          {/* Fichiers Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ padding: '24px' }}>
              <Stack direction="row" spacing={2} sx={{ marginBottom: '24px' }}>
                <Typography sx={{ fontWeight: 600, color: '#212121', flex: 1 }}>
                  Galerie d'Images
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => openEditDialog('file')}
                  sx={{ backgroundColor: '#0056B3' }}
                >
                  Télécharger
                </Button>
              </Stack>

              <Paper sx={{ border: '1px solid #e0e0e0' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Taille</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Téléchargé</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{file.name}</TableCell>
                        <TableCell>{file.type}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.uploadedAt}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" startIcon={<VisibilityIcon />} sx={{ color: '#0056B3' }}>
                              Voir
                            </Button>
                            <Button size="small" startIcon={<DeleteIcon />} sx={{ color: '#c62828' }}>
                              Supprimer
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </TabPanel>

          {/* Documents Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ padding: '24px' }}>
              <Stack direction="row" spacing={2} sx={{ marginBottom: '24px' }}>
                <Typography sx={{ fontWeight: 600, color: '#212121', flex: 1 }}>
                  Gestion des Documents
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => openEditDialog('document')}
                  sx={{ backgroundColor: '#0056B3' }}
                >
                  Ajouter Document
                </Button>
              </Stack>

              <Card sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography sx={{ color: '#666' }}>
                    Gérez les documents avec versioning. Chaque version est automatiquement sauvegardée et traçable.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Paramètres Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ padding: '24px' }}>
              <Typography sx={{ fontWeight: 600, color: '#212121', marginBottom: '24px' }}>
                Paramètres Système
              </Typography>

              <Stack spacing={2}>
                <Card sx={{ border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#0056B3', marginBottom: '12px' }}>
                        Sauvegarde et Restauration
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Button variant="outlined" sx={{ color: '#0056B3', borderColor: '#0056B3' }}>
                          Créer une Sauvegarde
                        </Button>
                        <Button variant="outlined" sx={{ color: '#0056B3', borderColor: '#0056B3' }}>
                          Restaurer à partir d'une Sauvegarde
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#0056B3', marginBottom: '12px' }}>
                        Configuration du Système
                      </Typography>
                      <Typography sx={{ color: '#666', fontSize: '14px' }}>
                        Version: 1.0.0 • Dernière mise à jour: 2025-01-20 • Base de données: PostgreSQL
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#0056B3' }}>
          {dialogType === 'page' && 'Créer/Modifier une Page'}
          {dialogType === 'file' && 'Télécharger un Fichier'}
          {dialogType === 'document' && 'Ajouter un Document'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '20px' }}>
          <Stack spacing={2}>
            <TextField fullWidth label="Titre/Nom" variant="outlined" />
            <TextField fullWidth label="Description" variant="outlined" multiline rows={3} />
            <Typography sx={{ fontSize: '12px', color: '#999' }}>
              Remplissez les champs ci-dessus et cliquez sur Enregistrer
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button onClick={closeDialog} sx={{ color: '#666' }}>
            Annuler
          </Button>
          <Button variant="contained" onClick={closeDialog} sx={{ backgroundColor: '#0056B3' }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
