import '../index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyHub } from './SurveyHub';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SurveyHub />
    </StrictMode>
);
