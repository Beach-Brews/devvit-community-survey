/*!
* Well defined schema for Redis models.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {z} from 'zod';

export type SurveyQuestionList = z.input<typeof Schema.surveyQuestionList>;
export type SurveyConfig = z.input<typeof Schema.surveyConfig>;
export type SurveyResponse = z.input<typeof Schema.surveyResponse>;

export class Schema {

    /* ==================== Question Config ==================== */

    static questionOption = z
        .object({
            label: z.string().min(1),
            value: z.string()
        })
        .strict();

    static commonQuestionProps = z
        .object({
            id: z.string().min(1),
            order: z.number().min(1),
            title: z.string().min(1),
            description: z.string(),
            required: z.boolean()
        })
        .strict();

    static textQuestion = z
        .object({
            type: z.literal('text'),
            min: z.number().min(0),
            max: z.number().min(0)
        })
        .strict()
        .merge(Schema.commonQuestionProps);

    static paragraphQuestion = z
        .object({
            type: z.literal('paragraph'),
            min: z.number().min(0),
            max: z.number().min(0)
        })
        .strict()
        .merge(Schema.commonQuestionProps);

    static scaleQuestion = z
        .object({
            type: z.literal('scale'),
            min: z.number().min(0),
            max: z.number().min(3),
            minLabel: z.string().min(1),
            maxLabel: z.string().min(1)
        })
        .strict()
        .merge(Schema.commonQuestionProps);

    static dropdownQuestion = z
        .object({
            type: z.literal('dropdown'),
            options: z.array(Schema.questionOption)
        })
        .strict()
        .merge(Schema.commonQuestionProps);

    static multiChoiceQuestion = z
        .object({
            type: z.literal('multi'),
            options: z.array(Schema.questionOption)
        })
        .strict()
        .merge(Schema.commonQuestionProps);

    static checkboxesQuestion = z
        .object({
            type: z.literal('checkbox'),
            options: z.array(Schema.questionOption)
        })
        .strict()
        .merge(Schema.commonQuestionProps);

    static descriptionQuestion = z
        .object({
            type: z.literal('description')
        })
        .strict()
        .merge(Schema.commonQuestionProps);

    static question = z.union([
        Schema.textQuestion,
        Schema.paragraphQuestion,
        Schema.scaleQuestion,
        Schema.dropdownQuestion,
        Schema.multiChoiceQuestion,
        Schema.checkboxesQuestion,
        Schema.descriptionQuestion
    ]);

    static surveyQuestionList = z.array(Schema.question);

    static surveyConfig = z
        .object({
            owner: z.string().min(1),
            title: z.string().min(1),
            intro: z.string().min(1),
            closeDate: z.string().datetime().nullable(),
            allowMultiple: z.boolean(),
            publishDate: z.string().datetime().nullable(),
            status: z.enum(['draft', 'live']),
            questions: Schema.surveyQuestionList
        })
        .strict();

    /* ==================== Responses ==================== */

    static surveyResponseValue = z
        .object({
            id: z.string().min(1),
            value: z.union([z.string(), z.number()])
        })
        .strict();

    static surveyResponseList = z.array(Schema.surveyResponseValue);

    static surveyResponse = z
        .object({
            owner: z.string().min(1),
            date: z.string().datetime(),
            responses: Schema.surveyResponseList
        })
        .strict();
}