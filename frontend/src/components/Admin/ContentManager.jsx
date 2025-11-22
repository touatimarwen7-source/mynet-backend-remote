import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import StorageIcon from '@mui/icons-material/Storage';
import DescriptionIcon from '@mui/icons-material/Description';
import StaticPagesManager from './StaticPagesManager';

export default function ContentManager() {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    {
      label: '📄 الصفحات الثابتة',
      icon: <ArticleIcon />,
      component: <StaticPagesManager />
    },
    {
      label: '📁 الملفات',
      icon: <StorageIcon />,
      component: <Box sx={{ p: 2 }}><Typography sx={{ color: '#616161' }}>قيد التطوير...</Typography></Box>
    },
    {
      label: '🖼️ الصور',
      icon: <ImageIcon />,
      component: <Box sx={{ p: 2 }}><Typography sx={{ color: '#616161' }}>قيد التطوير...</Typography></Box>
    },
    {
      label: '📋 الوثائق',
      icon: <DescriptionIcon />,
      component: <Box sx={{ p: 2 }}><Typography sx={{ color: '#616161' }}>قيد التطوير...</Typography></Box>
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
      <Tabs
        value={currentTab}
        onChange={(e, value) => setCurrentTab(value)}
        sx={{
          borderBottom: '1px solid #E0E0E0',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 500,
            color: '#616161',
            padding: '12px 16px',
            '&.Mui-selected': {
              color: '#0056B3',
              backgroundColor: '#F0F4FF'
            }
          }
        }}
      >
        {tabs.map((tab, idx) => (
          <Tab
            key={idx}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
            sx={{ minWidth: 'auto' }}
          />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {tabs[currentTab].component}
      </Box>
    </Box>
  );
}
