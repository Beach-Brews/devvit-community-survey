/*!
* Well defined schema for Redis models.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { z } from 'zod';
import { OptionIdRegex, QuestionIdRegex, SurveyIdRegex } from '../../../shared/redis/uuidGenerator';
import { FlairType, KarmaType, ResultVisibility } from '../../../shared/redis/SurveyDto';

export class Schema {

    static stringArray = z.array(z.string());

    /* ==================== Question Config ==================== */

    static questionOption = z
        .looseObject({
            label: z.string().min(1, 'Option label missing'),
            value: z.string().regex(OptionIdRegex, 'Not a valid option ID string')
        });

    static commonQuestionProps = z
        .looseObject({
            id: z.string().regex(QuestionIdRegex, 'Not a valid question ID string'),
            title: z.string().min(1, 'Question title missing'),
            description: z.string().default(''),
            required: z.boolean().default(true)
        });

    static textQuestion = z
        .looseObject({
            ...Schema.commonQuestionProps.shape,
            type: z.literal('text'),
            min: z.number().min(0).default(0),
            max: z.number().min(0).default(0)
        });

    static scaleKind = z.union([
        z.literal('otf'),
        z.literal('ott')
    ]);

    static scaleQuestion = z
        .looseObject({
            ...Schema.commonQuestionProps.shape,
            type: z.literal('scale'),
            kind: Schema.scaleKind.default("otf"),
            min: z.number().min(1).default(1),
            max: z.number().max(10).default(5),
            minLabel: z.string().default(''),
            midLabel: z.string().default(''),
            maxLabel: z.string().default('')
        });

    static multiOptionQuestionTypes = z.union([
        z.literal('multi'),
        z.literal('checkbox'),
        z.literal('rank')
    ]);

    static multiOptionQuestion = z
        .looseObject({
            ...Schema.commonQuestionProps.shape,
            type: Schema.multiOptionQuestionTypes.default('multi'),
            options: z.array(Schema.questionOption).default([])
        });

    static question = z.union([
        Schema.textQuestion,
        Schema.scaleQuestion,
        Schema.multiOptionQuestion
    ]);

    static surveyQuestionList = z.array(Schema.question);

    static resultVisibility = z.enum(ResultVisibility);

    static karmaType = z.enum(KarmaType);

    static karmaCriteria = z
        .looseObject({
            type: Schema.karmaType,
            value: z.number()
        });

    static flairType = z.enum(FlairType);

    static flairCriteria = z
        .looseObject({
            type: Schema.flairType,
            value: z.string()
        });

    static responderCriteria = z
        .looseObject({
            verifiedEmail: z.boolean().default(false),
            approvedUsers: z.boolean().default(false),
            minAge: z.number().nullable().default(null),
            minKarma: Schema.karmaCriteria.nullable().default(null),
            minSubKarma: Schema.karmaCriteria.nullable().default(null),
            userFlairs: z.array(Schema.flairCriteria).nullable().default(null)
        });

    static surveyConfig = z
        .looseObject({
            id: z.string().regex(SurveyIdRegex, 'Not a valid survey ID string'),
            owner: z.string().min(1, 'Survey Owner missing'),
            title: z.string().min(1, 'Survey Title missing'),
            intro: z.string().default(''),
            outro: z.string().min(1, 'Survey Outro missing'),
            allowMultiple: z.boolean().default(false),
            responderCriteria: Schema.responderCriteria.nullish().default({
                verifiedEmail: false,
                approvedUsers: false,
                minAge: null,
                minKarma: null,
                minSubKarma: null,
                userFlairs: null
            }),
            resultVisibility: Schema.resultVisibility.default(ResultVisibility.Always),
            createDate: z.number().default(() => Date.now()),
            publishDate: z.number().nullable(),
            closeDate: z.number().nullable()
        });

    static surveyConfigWithQuestions = z
        .looseObject({
            ...Schema.surveyConfig.shape,
            questions: Schema.surveyQuestionList
        });
}
