import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyDashboard } from './SurveyDashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyDashboard />
  </StrictMode>
);
