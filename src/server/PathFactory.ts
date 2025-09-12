/*!
 * Defines type for registering backend routes.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { Router } from 'express';

export type PathFactory = (router: Router) => void;
