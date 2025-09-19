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

    static questionOption = z
        .strictObject({
            label: z.string().min(1),
            value: z.string()
        });

    static commonQuestionProps = z
        .strictObject({
            id: z.string().min(1),
            order: z.number().min(1),
            title: z.string().min(1),
            description: z.string(),
            required: z.boolean()
        });

    static textQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps,
            type: z.literal('text'),
            min: z.number().min(0),
            max: z.number().min(0)
        });

    static scaleQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps,
            type: z.literal('scale'),
            min: z.number().min(1),
            max: z.number().min(10),
            minLabel: z.string().min(1),
            maxLabel: z.string().min(1)
        });

    static rankQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps,
            type: z.literal('rank'),
            options: z.array(Schema.questionOption)
        });

    static multiChoiceQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps,
            type: z.literal('multi'),
            options: z.array(Schema.questionOption)
        });

    static checkboxesQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps,
            type: z.literal('checkbox'),
            options: z.array(Schema.questionOption)
        });

    static descriptionQuestion = z
        .strictObject({
            ...Schema.commonQuestionProps,
            type: z.literal('description')
        });

    static question = z.union([
        Schema.textQuestion,
        Schema.scaleQuestion,
        Schema.rankQuestion,
        Schema.multiChoiceQuestion,
        Schema.checkboxesQuestion,
        Schema.descriptionQuestion
    ]);

    static surveyQuestionList = z.array(Schema.question);

    static surveyConfig = z
        .strictObject({
            id: z.string().min(1),
            owner: z.string().min(1),
            title: z.string().min(1),
            intro: z.string(),
            allowMultiple: z.boolean(),
            createDate: z.iso.datetime(),
            publishDate: z.iso.datetime().nullable(),
            closeDate: z.iso.datetime().nullable(),
            questions: Schema.surveyQuestionList
        });
}
