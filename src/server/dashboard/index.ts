/*!
 * Registers all paths for the dashboard front-end.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { sampleDataTmp } from './sampleData';

let currentList = [...sampleDataTmp];

export const registerDashboardRoutes: PathFactory = (router: Router) => {
    router.get(
        "/api/survey/reset",
        async (_req, res): Promise<void> => {
            currentList = [...sampleDataTmp];
            res.status(200).json(true);
        }
    );

    router.get("/api/survey/list", (_req, res) => {
        res.send(currentList);
    });

    router.patch('/api/survey/:surveyId/close', (req, resp) => {
        const item = currentList.find(s => s.id === req.params.surveyId);
        if (item) {
            item.closeDate = Date.now();
            resp.send(true);
            return;
        }

        resp.status(404).send();
    });

    router.route('/api/survey/:surveyId')
        .get((req, resp) => {
            const found = currentList.find(s => s.id === req.params.surveyId && s.id !== 'sv_534');
            if (found) {
                resp.send(found);
                return;
            }

            resp.status(404).send();
        })
        .patch((req, resp) => {
            const survey = JSON.parse(req.body);
            const itemIdx = currentList.findIndex(s => s.id === req.params.surveyId && s.id !== 'sv_533');
            if (itemIdx > -1) {
                currentList[itemIdx] = survey;
            } else {
                currentList.push(survey);
            }

            resp.send(true);
        })
        .delete((req, resp) => {
            const itemIdx = currentList.findIndex(s => s.id === req.params.surveyId && s.id !== 'sv_530');
            if (itemIdx > -1) {
                currentList.splice(itemIdx, 1);
                resp.send(true);
                return;
            }

            resp.status(404).send();
        });
};
