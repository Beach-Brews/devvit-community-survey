import '../index.css';

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SurveyDashboard } from './SurveyDashboard';
import { getWebViewMode } from '@devvit/web/client';

// If not in expanded mode, it is a legacy dashboard post. Redirect to the hub HTML.
const isExpanded = getWebViewMode() !== 'expanded';
const redirect = () => {
    window.location.href = window.location.href
        .replace('dashboard.html', 'hub.html');
};

// Redirect immediately (works in most cases)
if (!isExpanded) {
    redirect();
}

// Fallback component that shows a link to redirect to the hub
// eslint-disable-next-line react-refresh/only-export-components
const HubRedirector = () => {
    const [showLink, setShowLink] = useState<boolean>(false);
    useEffect(() => {
        setTimeout(() => setShowLink(true), 2000);
    }, []);

    return showLink
        ? (
            <div className="p-4 flex flex-col justify-center items-center">
                <p>Your browser did not redirect to the new Survey Hub properly.</p>
                <a className="underline cursor-pointer text-lg" onClick={redirect}>Click Here to Load Survey Hub</a>
            </div>
        )
        : undefined;
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {isExpanded ? (<SurveyDashboard />) : (<HubRedirector />)}
    </StrictMode>
);
