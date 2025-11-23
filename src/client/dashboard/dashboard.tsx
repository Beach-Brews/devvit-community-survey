import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyDashboardInline } from './SurveyDashboardInline';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyDashboardInline />
  </StrictMode>
);
