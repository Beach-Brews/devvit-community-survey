import { SurveyDto, SurveyQuestionDto } from '../../shared/redis/SurveyDto';

const questions: SurveyQuestionDto[] = [
    {
        id: 'sq_766',
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
        title: 'This is question three',
        description: 'Here are some details about the question.',
        required: true,
        type: 'scale',
        kind: 'otf',
        minLabel: 'Low end',
        min: 1,
        midLabel: '',
        maxLabel: 'High end',
        max: 5
    },
    {

        id: 'sq_762',
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

export const sampleDataTmp: SurveyDto[] = [
    {
        id: "sv_534",
        title: "Draft Survey - No Publish Date",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: Date.now(),
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
        createDate: Date.now(),
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
        createDate: Date.now(),
        publishDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        closeDate: new Date('2025-12-30T00:00:00.0000').getTime(),
        responseCount: 73,
        questions: questions
    },
    {
        id: "sv_531",
        title: "Live Survey - No Close Date",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: Date.now(),
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
        createDate: Date.now(),
        publishDate: new Date('2025-09-15T00:00:00.0000').getTime(),
        closeDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        responseCount: 382,
        questions: questions
    }
];
