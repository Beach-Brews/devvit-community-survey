/*!
 * Helper methods for API responses.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { ApiResponse, MessageResponse } from '../../shared/types/api';
import { Response } from 'express';
import { isMod } from './userUtils';
import { context } from '@devvit/web/server';

export const successResponse =
    <T>(res: Response, result: T, status?: number, message?: string, code?: number): void => {
        const obj = {message: message ?? 'Success', code: code ?? status ?? 200, result: result } as ApiResponse<T>;
        res.status(status ?? 200).json(obj);
    };

export const messageResponse =
    (res: Response, status: number, message: string, code?: number): void => {
        const obj = {message: message, code: code ?? status, result: undefined } as MessageResponse;
        res.status(status).json(obj);
    };

export const errorIfNotMod =
    async (res: Response): Promise<boolean> => {
        if (await isMod()) return false;
        messageResponse(res, 403, 'You are not a moderator', 788);
        return true;
    };

export const errorIfNoUserId =
    async (res: Response): Promise<string | undefined> => {
        const { userId } = context;
        if (!userId)
            messageResponse(res, 400, 'User context unknown', 740);
        return userId;
    };

export const surveyNotFoundResponse =
    async (res: Response, id: string): Promise<void> => {
        messageResponse(res, 404, 'Survey not found with ID: ' + id);
    };
