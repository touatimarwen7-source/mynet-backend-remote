/* ================================================
   Material-UI Institutional Theme
   نظام المظهر الرسمي المؤسسي
   Strict Government Standards - No Custom CSS Override
   ================================================ */

import { createTheme } from '@mui/material/styles';

export const institutionalTheme = createTheme({
  // ================================================
  // PALETTE - Official Government Colors
  // ================================================
  palette: {
    primary: {
      main: '#007bff',           // Government Blue
      dark: '#0056b3',           // Dark Blue
      light: '#e7f1ff',          // Light Blue
      contrastText: '#ffffff',   // White text on blue
    },
    secondary: {
      main: '#f8f8f8',           // Light Gray
      dark: '#cccccc',           // Medium Gray
      light: '#ffffff',          // White
      contrastText: '#333333',   // Dark text
    },
    success: {
      main: '#28a745',           // Success Green
      dark: '#1e7e34',           // Dark Green
      light: '#d4edda',          // Light Green
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffc107',           // Warning Yellow
      dark: '#e0a800',           // Dark Yellow
      light: '#fff3cd',          // Light Yellow
      contrastText: '#000000',
    },
    error: {
      main: '#dc3545',           // Error Red
      dark: '#c82333',           // Dark Red
      light: '#f8d7da',          // Light Red
      contrastText: '#ffffff',
    },
    info: {
      main: '#0d6efd',           // Info Blue
      dark: '#0a58ca',           // Dark Info Blue
      light: '#cfe2ff',          // Light Info Blue
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',        // Default background
      paper: '#ffffff',          // Paper/Card background
    },
    text: {
      primary: '#333333',        // Dark Gray - Primary text
      secondary: '#666666',      // Medium Gray - Secondary text
      disabled: '#999999',       // Light Gray - Disabled text
    },
    divider: '#e0e0e0',          // Divider color
    action: {
      active: '#007bff',
      hover: '#f8f8f8',
      selected: '#e7f1ff',
      disabled: '#cccccc',
      disabledBackground: '#f0f0f0',
    },
  },

  // ================================================
  // TYPOGRAPHY - Single Font Family + 3 Weights
  // ================================================
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Oxygen"',
      '"Ubuntu"',
      '"Cantarell"',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),

    // Font Size Hierarchy
    h1: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.3px',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.3px',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontSize: '14px',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0px',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
  },

  // ================================================
  // COMPONENT OVERRIDES - Institutional Styling
  // ================================================
  components: {
    // Button Component
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: '44px',
          padding: '10px 24px',
          borderRadius: '2px',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        contained: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
          '&:disabled': {
            backgroundColor: '#cccccc',
            color: '#999999',
          },
        },
        outlined: {
          borderColor: '#e0e0e0',
          color: '#333333',
          '&:hover': {
            backgroundColor: '#f8f8f8',
            borderColor: '#007bff',
            color: '#007bff',
          },
        },
        text: {
          color: '#007bff',
          '&:hover': {
            backgroundColor: '#f8f8f8',
          },
        },
        sizeSmall: {
          minHeight: '36px',
          padding: '8px 16px',
          fontSize: '13px',
        },
        sizeLarge: {
          minHeight: '52px',
          padding: '16px 32px',
          fontSize: '16px',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'success' },
          style: {
            backgroundColor: '#28a745',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1e7e34',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'error' },
          style: {
            backgroundColor: '#dc3545',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#c82333',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'warning' },
          style: {
            backgroundColor: '#ffc107',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#e0a800',
            },
          },
        },
      ],
    },

    // TextField/Input Component
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: '2px',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#cccccc',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007bff',
              boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '14px',
            fontWeight: 400,
            padding: '12px 16px',
          },
          '& .MuiInputLabel-outlined': {
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            color: '#333333',
          },
        },
      },
    },

    // Table Component
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f8f8',
          borderBottom: '2px solid #e0e0e0',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '12px',
          fontWeight: 700,
          color: '#007bff',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          padding: '16px',
        },
        body: {
          fontSize: '14px',
          color: '#333333',
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f8f8f8',
          },
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
      },
    },

    // Card Component
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '2px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'all 250ms ease-in-out',
          '&:hover': {
            borderColor: '#007bff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },

    // Modal Component
    MuiModal: {
      styleOverrides: {
        backdrop: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '2px',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '20px',
          fontWeight: 700,
          color: '#007bff',
          borderBottom: '1px solid #e0e0e0',
        },
      },
    },

    // Alert Component
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: '#d4edda',
          color: '#1e7e34',
          border: '1px solid #28a745',
          borderLeft: '4px solid #28a745',
        },
        standardWarning: {
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffc107',
          borderLeft: '4px solid #ffc107',
        },
        standardError: {
          backgroundColor: '#f8d7da',
          color: '#c82333',
          border: '1px solid #dc3545',
          borderLeft: '4px solid #dc3545',
        },
        standardInfo: {
          backgroundColor: '#cfe2ff',
          color: '#0a58ca',
          border: '1px solid #0d6efd',
          borderLeft: '4px solid #0d6efd',
        },
      },
    },

    // Chip Component (Badge)
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          height: '24px',
        },
        filledSuccess: {
          backgroundColor: '#28a745',
          color: '#ffffff',
        },
        filledWarning: {
          backgroundColor: '#ffc107',
          color: '#000000',
        },
        filledError: {
          backgroundColor: '#dc3545',
          color: '#ffffff',
        },
        filledInfo: {
          backgroundColor: '#0d6efd',
          color: '#ffffff',
        },
      },
    },

    // Checkbox Component
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#cccccc',
          '&.Mui-checked': {
            color: '#007bff',
          },
        },
      },
    },

    // Select Component
    MuiSelect: {
      styleOverrides: {
        outlined: {
          fontSize: '14px',
          fontWeight: 400,
          backgroundColor: '#ffffff',
        },
      },
    },

    // Paper Component
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '2px',
        },
      },
    },

    // AppBar Component
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#333333',
          border: 'none',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: 'none',
        },
      },
    },

    // Tab Component
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 500,
          textTransform: 'none',
          color: '#666666',
          '&.Mui-selected': {
            color: '#007bff',
          },
        },
      },
    },
  },

  // ================================================
  // SHAPE - Minimal Radius
  // ================================================
  shape: {
    borderRadius: 2,
  },

  // ================================================
  // SPACING - 8px Grid
  // ================================================
  spacing: 8,

  // ================================================
  // BREAKPOINTS
  // ================================================
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default institutionalTheme;
