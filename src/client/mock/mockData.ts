/*!
 * Mock data responses for testing survey post cards locally.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { genOptionId, genQuestionId, genSurveyId } from '../../shared/redis/uuidGenerator';
import { SurveyQuestionList, SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';

const smallCase = true;

const title = smallCase ? 'This is the question? ' : 'This is the question title and is longer for test!';
const description = smallCase
    ? 'This is just a shorter test case description.'
    : `**Testing** *markdown* __parser__ ~~breaks~~  
in same paragraph.
And not a line break.

**bold *both*** | ***both* bold** | *italic **both*** | ***both** italic* | __**bold underline**__ | *~~crossed italic~~*

\\*test escape\\* and \\*\\*test escape\\*\\* and \\__Test Escape\\_\\\\_ and \\~~test escape\\~\\~

Finally a test of [***link** text*](https://google.com)`;

const options =  [1,2,3,4,5,6,7,8,9,10]
    .map(i => ({
        label: smallCase ? `Option ${i}` : `This is the text for option ${i} which is long to see if we it work`,
        value: genOptionId()
    }));

export const SampleQuestionList = [
    {
        id: genQuestionId(),
        title: title,
        description: description,
        required: true,
        type: 'multi',
        options: options
    },
    {
        id: genQuestionId(),
        title: title,
        description: description,
        required: true,
        type: 'checkbox',
        options: options
    },
    {
        id: genQuestionId(),
        title: title,
        description: description,
        required: true,
        type: 'scale',
        kind: 'otf',
        minLabel: 'Low end',
        min: 1,
        midLabel: 'Mid point',
        maxLabel: 'High end',
        max: 5
    },
    {
        id: genQuestionId(),
        title: title,
        description: description,
        required: true,
        type: 'scale',
        kind: 'ott',
        minLabel: 'Low end',
        min: 1,
        midLabel: '',
        maxLabel: 'High end',
        max: 10
    },
    {

        id: genQuestionId(),
        title: title,
        description: description,
        required: true,
        type: 'rank',
        options: options
    }
] satisfies SurveyQuestionList;

export const SampleSurveyList = [
    {
        id: genSurveyId(),
        title: "This is my awesome survey with a long title for me",
        intro: description,
        outro: "**Thank you** for your response.",
        allowMultiple: false,
        createDate: Date.now(),
        publishDate: null,
        closeDate: null,
        owner: 't2_1234',
        responseCount: 45,
        responderCriteria: {
            verifiedEmail: true,
            approvedUsers: true,
            minAge: 30,
            minKarma: { type: 'Post', value: 3000 },
            minSubKarma:  { type: 'Both', value: 1000 },
            userFlairs: [ { type: 'TxtEq', value: 'World' } ]
        },
        resultVisibility: 'Resp',
        questions: SampleQuestionList
    },
    {
        id: genSurveyId(),
        title: "Scheduled Survey - Scheduled to be published",
        intro: description,
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: Date.now(),
        publishDate: new Date('2027-01-01T00:00:00.0000').getTime(),
        closeDate: null,
        owner: 't2_1234',
        responseCount: 0,
        responderCriteria: null,
        resultVisibility: 'Resp',
        questions: SampleQuestionList
    },
    {
        id: genSurveyId(),
        title: "Live Survey - Has Close Date",
        intro: description,
        outro: description,
        allowMultiple: false,
        createDate: Date.now(),
        publishDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        closeDate: new Date('2026-10-31T00:00:00.0000').getTime(),
        owner: 't2_1234',
        responseCount: 73,
        responderCriteria: {
            verifiedEmail: true,
            approvedUsers: true,
            minAge: 30,
            minKarma: { type: 'Post', value: 3000 },
            minSubKarma:  { type: 'Both', value: 1000 },
            userFlairs: [ { type: 'TxtEq', value: 'World' } ]
        },
        resultVisibility: 'Always',
        postId: 't3_x89sk2',
        questions: SampleQuestionList
    },
    {
        id: genSurveyId(),
        title: "Live Survey - No Close Date",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: Date.now(),
        publishDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        closeDate: null,
        owner: 't2_1234',
        responseCount: 1432,
        responderCriteria: null,
        resultVisibility: 'Always',
        postId: 't3_x89sk2',
        questions: SampleQuestionList
    },
    {
        id: genSurveyId(),
        title: "Closed Survey - No More Responses",
        intro: "Hello",
        outro: "Thank you for your response.",
        allowMultiple: false,
        createDate: Date.now(),
        publishDate: new Date('2025-09-15T00:00:00.0000').getTime(),
        closeDate: new Date('2025-09-17T00:00:00.0000').getTime(),
        owner: 't2_1234',
        responseCount: 382,
        responderCriteria: {
            verifiedEmail: true,
            approvedUsers: true,
            minAge: 30,
            minKarma: { type: 'Post', value: 3000 },
            minSubKarma:  { type: 'Both', value: 1000 },
            userFlairs: [ { type: 'TxtEq', value: 'World' } ]
        },
        resultVisibility: 'Always',
        postId: 't3_x89sk2',
        questions: SampleQuestionList,
    }
] satisfies SurveyWithQuestionsDto[];

export const SampleUserInfo = {
    isMod: true,
    responseBlocked: 0,
    allowDev: true,
    username: 'Beach-Brews',
    userId: 't2_ds8dkw924l',
    snoovar: 'https://i.redd.it/snoovatar/avatars/39b6f849-b2de-4c8f-9c97-4946152dc878.png'
};

export const SampleSubInfo =  {
    name: 'TestingSubName',
    icon: 'https://styles.redditmedia.com/t5_gb360m/styles/communityIcon_m6nsf08mkobg1.png?width=64&height=64&frame=1&auto=webp&crop=64%3A64%2Csmart&s=8a8bcbc4ceb6438f1f573c94b86f0a6e77c8dacc'
};
