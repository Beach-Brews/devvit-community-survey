import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyDashboardInline } from './dashboard/SurveyDashboardInline';
import { SurveyPost } from './survey/SurveyPost';
import { context } from '@devvit/web/client';
import { PostType } from '../shared/types/general';

const renderApp = () => {
    const postType = context?.postData?.postType ?? PostType[PostType.Dashboard];
    return postType === PostType[PostType.Dashboard]
        ? <SurveyDashboardInline />
        : <SurveyPost />;
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {renderApp()}
    </StrictMode>
);
