/*!
* API to fetch survey list from server.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto } from '../../shared/redis/SurveyDto';

const tmpList: SurveyDto[] = [
    {
        title: "Draft Survey - No Publish Date",
        intro: "Hello",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: null,
        closeDate: null,
        responseCount: null,
        questions: []
    },
    {
        title: "Scheduled Survey - Scheduled to be published",
        intro: "Hello",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2026-01-01T00:00:00.0000').getTime(),
        closeDate: null,
        responseCount: null,
        questions: []
    },
    {
        title: "Live Survey - Has Close Date",
        intro: "Hello",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        closeDate: new Date('2025-09-30T00:00:00.0000').getTime(),
        responseCount: 73,
        questions: []
    },
    {
        title: "Live Survey - No Close Date",
        intro: "Hello",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        closeDate: null,
        responseCount: 1432,
        questions: []
    },
    {
        title: "Closed Survey - No More Responses",
        intro: "Hello",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2025-09-15T00:00:00.0000').getTime(),
        closeDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        responseCount: 382,
        questions: []
    }
];

export const getSurveyList = async (): Promise<SurveyDto[]> => {
    return new Promise((res, _rej) => {
        setTimeout(() => res([]), 3000);
    });
};
