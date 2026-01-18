import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyDashboard } from './SurveyDashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyDashboard userInfo={{
        userId: 't2_asdfg12345',
        username: 'Beach-Brews',
        snoovar: '',
        isMod: true,
        allowDev: true,
        responseBlocked: null
    }} />
  </StrictMode>
);
