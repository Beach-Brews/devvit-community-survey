import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { PageContextProvider } from './hooks/pageContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PageContextProvider>
            <App />
        </PageContextProvider>
    </StrictMode>
);