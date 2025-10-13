/*!
* Well defined schema for Redis models.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {z} from 'zod';

export type SurveyConfig = z.input<typeof Schema.surveyConfig>;

export class Schema {

    /* ==================== Question Config ==================== */

    static surveyIdRegex = /^sv_[0-9a-zA-Z]{10}$/;
    static questionIdRegex = /^sq_[0-9a-zA-Z]{10}$/;
    static optionIdRegex = /^sqo_[0-9a-zA-Z]{10}$/;

    static questionOption = z
        .strictObject({
            label: z.string().min(1),
            value: z.string().regex(Schema.optionIdRegex, {
                error: 'Not a valid option ID string'
            })
        });

    static commonQuestionProps = z
        .strictObject({
            id: z.string().regex(Schema.questionIdRegex, {
                error: 'Not a valid question ID string'
            }),
            title: z.string().min(1),
            description: z.string(),
            required: z.boolean()
        });

    static textQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps.shape,
            type: z.literal('text'),
            min: z.number().min(0),
            max: z.number().min(0)
        });

    static scaleKind = z.union([
        z.literal('otf'),
        z.literal('ott')
    ]);

    static scaleQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps.shape,
            type: z.literal('scale'),
            kind: Schema.scaleKind,
            min: z.number().min(1),
            max: z.number().min(5),
            minLabel: z.string().min(1),
            midLabel: z.string(),
            maxLabel: z.string().min(1)
        });

    static multiOptionQuestionTypes = z.union([
        z.literal('multi'),
        z.literal('checkbox'),
        z.literal('rank')
    ]);

    static multiOptionQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps.shape,
            type: Schema.multiOptionQuestionTypes,
            options: z.array(Schema.questionOption)
        });

    static question = z.union([
        Schema.textQuestion,
        Schema.scaleQuestion,
        Schema.multiOptionQuestion
    ]);

    static surveyQuestionList = z.array(Schema.question);

    static surveyConfig = z
        .strictObject({
            id: z.string().regex(Schema.surveyIdRegex, {
                error: 'Not a valid survey ID string'
            }),
            owner: z.string().min(1),
            title: z.string().min(1),
            intro: z.string(),
            outro: z.string(),
            allowMultiple: z.boolean(),
            createDate: z.number(),
            publishDate: z.number().nullable(),
            closeDate: z.number().nullable(),
            responseCount: z.number()
        });

    static surveyConfigWithQuestions = z
        .strictObject({
            ...Schema.surveyConfig.shape,
            questions: Schema.surveyQuestionList
        });

    static stringArray = z.array(z.string());
}
