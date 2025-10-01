/*!
* API to fetch survey list from server.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto, SurveyQuestionList } from '../../shared/redis/SurveyDto';

const questions: SurveyQuestionList = [
    {
        id: 'sq_766',
        order: 0,
        title: 'This is question one',
        description: 'Here are some details about the question.',
        required: true,
        type: 'multi',
        options: [
            {
                label: 'Option One',
                value: '1'
            },
            {
                label: 'Option Two',
                value: '2'
            },
            {
                label: 'Option Three',
                value: '3'
            }
        ]
    },
    {
        id: 'sq_764',
        order: 1,
        title: 'This is question two',
        description: 'Here are some details about the question.',
        required: true,
        type: 'checkbox',
        options: [
            {
                label: 'Option One',
                value: '1'
            },
            {
                label: 'Option Two',
                value: '2'
            },
            {
                label: 'Option Three',
                value: '3'
            }
        ]
    },
    {
        id: 'sq_763',
        order: 2,
        title: 'This is question three',
        description: 'Here are some details about the question.',
        required: true,
        type: 'scale',
        minLabel: 'Low end',
        min: 1,
        maxLabel: 'High end',
        max: 5
    },
    {

        id: 'sq_762',
        order: 3,
        title: 'This is question Four',
        description: 'Here are some details about the question.',
        required: true,
        type: 'rank',
        options: [
            {
                label: 'Option One',
                value: '1'
            },
            {
                label: 'Option Two',
                value: '2'
            },
            {
                label: 'Option Three',
                value: '3'
            }
        ]
    }
];

const tmpList: SurveyDto[] = [
    {
        id: "sv_534",
        title: "Draft Survey - No Publish Date",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: null,
        closeDate: null,
        responseCount: null,
        questions: questions
    },
    {
        id: "sv_533",
        title: "Scheduled Survey - Scheduled to be published",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2026-01-01T00:00:00.0000').getTime(),
        closeDate: null,
        responseCount: null,
        questions: questions
    },
    {
        id: "sv_532",
        title: "Live Survey - Has Close Date",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        closeDate: new Date('2025-09-30T00:00:00.0000').getTime(),
        responseCount: 73,
        questions: questions
    },
    {
        id: "sv_531",
        title: "Live Survey - No Close Date",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        closeDate: null,
        responseCount: 1432,
        questions: questions
    },
    {
        id: "sv_530",
        title: "Closed Survey - No More Responses",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: new Date().getTime(),
        publishDate: new Date('2025-09-15T00:00:00.0000').getTime(),
        closeDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        responseCount: 382,
        questions: questions
    }
];

export const getSurveyList = async (): Promise<SurveyDto[]> => {
    return await new Promise<SurveyDto[]>((res, _rej) => {
        setTimeout(() => {
            res(tmpList);
        }, 250);
    });
};

export const getSurveyById = async (id: string): Promise<SurveyDto | undefined> => {
    return new Promise((res, _rej) => {
        setTimeout(() => res(tmpList.find(s => s.id == id)), 250);
    });
};

export const deleteSurveyById = async (id: string): Promise<boolean> => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (id === 'sv_530') {
                return rej(false);
            }
            const itemIdx = tmpList.findIndex(s => s.id == id);
            if (itemIdx > -1) {
                tmpList.splice(itemIdx, 1);
                return res(true);
            }
            return rej(false);
        }, 250);
    });
};

export const closeSurveyById = async (id: string): Promise<boolean> => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (id === 'sv_532') {
                return rej(false);
            }
            const item = tmpList.find(s => s.id == id);
            if (item) {
                item.closeDate = new Date().getTime();
                return res(true);
            }
            return rej(false);
        }, 250);
    });
};
