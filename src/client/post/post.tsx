import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyPost } from './SurveyPost';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyPost />
  </StrictMode>
);
