/*!
 * Registers all paths to internal devvit actions (like menus, triggers and scheduler tasks).
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { registerCreateDashboardMenu } from './menu/createDashboard';
import { registerPublishCheckTask } from './tasks/publishCheckTask';
import { registerAppUpgradeTrigger } from './triggers/upgradeTrigger';
import { registerAppInstallTrigger } from './triggers/installTrigger';

export const registerInternalRoutes: PathFactory = (router: Router) => {
    registerCreateDashboardMenu(router);
    registerPublishCheckTask(router);
    registerAppInstallTrigger(router);
    registerAppUpgradeTrigger(router);
};
