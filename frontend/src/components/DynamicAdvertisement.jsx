import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function DynamicAdvertisement() {
  const [advertisements] = useState([
    {
      id: 1,
      type: 'success',
      title: '🎉 Succès Client',
      message: 'Banque Tunisienne adopte MyNet.tn pour gérer 500M TND d\'achats annuels',
      cta: 'En savoir plus →'
    },
    {
      id: 2,
      type: 'webinar',
      title: '📺 Webinaire Gratuit',
      message: 'Masterclass: Optimiser vos appels d\'offres avec l\'IA - Jeudi 20h',
      cta: 'S\'inscrire gratuitement →'
    },
    {
      id: 3,
      type: 'promo',
      title: '🎁 Offre Limitée',
      message: 'Gold Plan à -30% pour les 3 premiers mois - Code: GROWTH30',
      cta: 'Profiter de l\'offre →'
    }
  ]);

  const [currentAd, setCurrentAd] = useState(0);

  const handleNext = () => {
    setCurrentAd((prev) => (prev + 1) % advertisements.length);
  };

  const ad = advertisements[currentAd];

  return (
    <Box className="dynamic-advertisement-container">
      <Card className={`dynamic-ad-card dynamic-ad-${ad.type}`}>
        <CardContent className="dynamic-ad-content">
          <Typography variant="h5" component="h3" className="dynamic-ad-title">
            {ad.title}
          </Typography>
          <Typography variant="body2" className="dynamic-ad-message">
            {ad.message}
          </Typography>
          <Button variant="contained" className="dynamic-ad-cta">
            {ad.cta}
          </Button>
        </CardContent>

        {/* Ad Controls */}
        <Stack
          direction="row"
          spacing={1}
          className="dynamic-ad-controls"
          justifyContent="center"
        >
          {advertisements.map((_, idx) => (
            <Box
              key={idx}
              component="button"
              onClick={() => setCurrentAd(idx)}
              className={`dynamic-ad-dot ${idx === currentAd ? 'active' : ''}`}
            />
          ))}
          <Button
            size="small"
            className="dynamic-ad-next-btn"
            onClick={handleNext}
          >
            <NavigateNextIcon />
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
