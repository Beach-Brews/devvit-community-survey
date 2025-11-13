import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyDashboard } from './SurveyDashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyDashboard userInfo={{
        userId: 't2_1a3euo740x',
        username: 'beach-brews',
        isMod: true,
        allowDev: true,
        snoovar: ''
    }} />
  </StrictMode>
);
