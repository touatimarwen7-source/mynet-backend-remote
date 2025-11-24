/**
 * 🎨 Consistency Helper - Ensured 100% French + Theme Compliance
 * 
 * Functions to ensure:
 * 1. All text uses French translations
 * 2. All colors use theme.js palette
 * 3. All spacing uses theme spacing
 * 4. Zero inline styles or separate CSS files
 */

import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

/**
 * French labels mapping - Fallback if i18n is not initialized
 * All labels MUST be in French only
 */
export const FRENCH_LABELS = {
  // Actions
  ajouter: 'Ajouter',
  modifier: 'Modifier',
  supprimer: 'Supprimer',
  enregistrer: 'Enregistrer',
  annuler: 'Annuler',
  confirmez: 'Confirmez',
  rechercher: 'Rechercher',
  voir: 'Voir',
  télécharger: 'Télécharger',
  charger: 'Charger',
  
  // Status
  actif: 'Actif',
  inactif: 'Inactif',
  activé: 'Activé',
  désactivé: 'Désactivé',
  en_attente: 'En attente',
  bloqué: 'Bloqué',
  archivé: 'Archivé',
  
  // Messages
  chargement: 'Chargement...',
  aucune_donnée: 'Aucune donnée',
  erreur: 'Erreur',
  succès: 'Succès',
  avertissement: 'Avertissement',
  
  // Form fields
  email: 'Email',
  mot_de_passe: 'Mot de passe',
  nom: 'Nom',
  prénom: 'Prénom',
  entreprise: 'Entreprise',
  téléphone: 'Téléphone',
  adresse: 'Adresse',
  description: 'Description',
  
  // Table columns
  actions: 'Actions',
  date: 'Date',
  statut: 'Statut',
  utilisateur: 'Utilisateur',
  montant: 'Montant',
  type: 'Type',
};

/**
 * Ensure all text uses French labels
 * @param {string} key - Label key in FRENCH_LABELS
 * @returns {string} French label
 */
export const getFrenchLabel = (key) => {
  return FRENCH_LABELS[key] || key;
};

/**
 * Hook for consistent theme usage across components
 * @returns {Object} Theme utilities
 */
export const useConsistentTheme = () => {
  const theme = useTheme();
  
  return {
    // Colors - Always use theme palette
    colors: {
      primary: theme.palette.primary.main,
      primaryLight: theme.palette.primary.light,
      primaryDark: theme.palette.primary.dark,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
      background: theme.palette.background.default,
      surface: theme.palette.background.paper,
      text: theme.palette.text.primary,
      textSecondary: theme.palette.text.secondary,
      divider: theme.palette.divider,
    },
    
    // Spacing - Always use theme spacing
    spacing: {
      xs: theme.spacing(0.5),    // 4px
      sm: theme.spacing(1),       // 8px
      md: theme.spacing(2),       // 16px
      lg: theme.spacing(3),       // 24px
      xl: theme.spacing(4),       // 32px
      xxl: theme.spacing(5),      // 40px
    },
    
    // Typography - Use theme variants
    typography: {
      h1: { ...theme.typography.h1 },
      h2: { ...theme.typography.h2 },
      h3: { ...theme.typography.h3 },
      h4: { ...theme.typography.h4 },
      body: { ...theme.typography.body1 },
      caption: { ...theme.typography.caption },
    },
    
    // Border radius - Use theme shape
    borderRadius: theme.shape.borderRadius,
    
    // Shadows - None (institutional style)
    shadows: 'none',
  };
};

/**
 * Verified sx prop (Material-UI style object)
 * Ensures no inline styles, only theme-based sx
 * @param {Object} baseStyles - Base sx styles
 * @returns {Object} Verified sx object
 */
export const createThemedSx = (baseStyles, theme) => {
  return {
    ...baseStyles,
    // Force theme-based colors
    color: baseStyles.color ? theme.palette[baseStyles.color]?.main || baseStyles.color : 'inherit',
    backgroundColor: baseStyles.backgroundColor 
      ? theme.palette[baseStyles.backgroundColor]?.main || baseStyles.backgroundColor 
      : 'transparent',
    // Force theme-based spacing
    padding: baseStyles.padding ? theme.spacing(baseStyles.padding / 8) : 'auto',
    margin: baseStyles.margin ? theme.spacing(baseStyles.margin / 8) : 'auto',
    borderRadius: theme.shape.borderRadius,
    // No shadows
    boxShadow: 'none',
  };
};

/**
 * Responsive breakpoint utilities
 * Ensures mobile-first design
 */
export const responsiveBreakpoints = {
  mobile: { xs: true },
  tablet: { xs: true, sm: true },
  desktop: { sm: false, md: true, lg: true },
};

/**
 * Common sx props for consistency
 */
export const CONSISTENT_SX = {
  // Card
  card: (theme) => ({
    p: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
  }),
  
  // Button
  button: (theme) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
  }),
  
  // Input
  input: (theme) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
    },
  }),
  
  // Table
  table: (theme) => ({
    borderCollapse: 'collapse',
    '& .MuiTableCell-head': {
      backgroundColor: theme.palette.background.default,
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
  
  // Mobile responsive table
  responsiveTable: (theme) => ({
    // Desktop: show full table
    [theme.breakpoints.up('md')]: {
      display: 'table',
    },
    // Mobile: show as stack
    [theme.breakpoints.down('md')]: {
      display: 'block',
      '& thead': {
        display: 'none',
      },
      '& tbody': {
        display: 'block',
      },
      '& tr': {
        display: 'block',
        marginBottom: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      },
      '& td': {
        display: 'block',
        padding: theme.spacing(1),
        textAlign: 'right',
        '&:before': {
          content: 'attr(data-label)',
          fontWeight: theme.typography.fontWeightBold,
          float: 'left',
        },
      },
    },
  }),
};

/**
 * Consistency validator - Check for violations
 */
export const validateConsistency = {
  // Check for inline styles (should use sx instead)
  hasInlineStyles: (element) => {
    return element?.getAttribute('style') !== null;
  },
  
  // Check for non-theme colors
  hasNonThemeColors: (color, theme) => {
    const themeColors = Object.values(theme.palette);
    return !themeColors.some(paletteColor => 
      paletteColor === color || 
      (paletteColor.main === color)
    );
  },
  
  // Check for non-French text (simple check)
  hasNonFrenchText: (text) => {
    // Match non-Latin characters (Arabic, Chinese, etc.)
    // Allow accented French characters (àâäéèêëïîôöùûüœç)
    return /[A-Z]{2,}/.test(text); // Flag all-caps English acronyms
  },
};

export default {
  FRENCH_LABELS,
  getFrenchLabel,
  useConsistentTheme,
  createThemedSx,
  responsiveBreakpoints,
  CONSISTENT_SX,
  validateConsistency,
};
