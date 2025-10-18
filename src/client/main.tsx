import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//import { SurveyDashboard } from './dashboard/SurveyDashboard';
//import { SurveyPost } from './survey/SurveyPost';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div>
            This is the index. Choose either dashboard or survey for now.
        </div>
    </StrictMode>
);
