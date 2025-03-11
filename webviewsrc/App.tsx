import { Page, PageProps } from './pages/pageDefs';
import { SurveyPage } from './pages/survey';
import { ConfigurePage } from './pages/configure';
import {usePage, useSetPage} from './hooks/pageContext';
import { useState } from 'react';
import {sendToAndListenFromDevvit} from "./devvit";
import {InitFromDevvit} from "./devvit/defs";

const getPage = (page: Page, props: PageProps) => {
    switch (page) {
        case 'survey':
            return <SurveyPage {...props} />;
        case 'configure':
            return <ConfigurePage {...props} />;
        default:
            throw new Error(`Unknown page: ${page satisfies never}`);
    }
};

const PageStyle = {
    maxWidth: "1000px",
    margin: "0 auto"
};

export const App = () => {

    const page = usePage();
    const setPage = useSetPage();

    const [initialData, setInitialData] = useState<InitFromDevvit>();
    sendToAndListenFromDevvit({ type: 'INIT' }, 'INIT_RESPONSE', (msg: InitFromDevvit) => {
        setInitialData(msg);
        setPage(msg.postConfig.isOwner ? 'configure' : 'survey');
    });

    if (!initialData) {
        return (
            <div>Loading...</div>
        );
    }

    return <div style={PageStyle}>{getPage(page, { initialData })}</div>;
};