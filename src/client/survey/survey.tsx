import '../index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyResponseView } from './SurveyResponseView';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SurveyResponseView />
    </StrictMode>
);
