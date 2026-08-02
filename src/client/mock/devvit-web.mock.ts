export const context = {
    subredditName: 'UAT4CommunitySurvey',
    appVersion: 'LocalVite'
};

export const navigateTo = (url: string) => {
    console.log('Open new tab to:', url);
};

export const getWebViewMode = () => {
    throw new Error('not implemented');
};

export const requestExpandedMode = () => {
};

export const addWebViewModeListener = () => {
};

export const removeWebViewModeListener = () => {
};
