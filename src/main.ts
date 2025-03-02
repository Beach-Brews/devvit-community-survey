/*!
 * Loader file for the app.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

// First, configure capabilities
import './configure.js';

// Define app settings
import './createSettings.js';

// Setup post menu item
import './createPostMenuItem.js';

// Register the custom post type
import './createCustomPostType.js';

// Finally, necessary export of Devvit
import {Devvit} from "@devvit/public-api";
export default Devvit;
