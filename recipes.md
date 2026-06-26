## Current Bugs
* Going to next question does not scroll back to top
* Results progress bar is wrong (last question shows space?)

* Rank drag-and-drop (using dnd-kit, lazy loaded)

## Roadmap
* Develop design system
* Mock designs
* Requirements docks
* Mock api with vite

* Update documentation
* Create demo video for ModEvents
* Setup GitHub Project

* 0.1.1
  * High - Fix welcome wiki link...
  * High - Export Results to CSV
  * Medium - Text fallback changes (update fallback text on delete)
  * Low - Fix hub "there are no closed/live surveys" copy styling
  * Low - ??Add "shareImageUrl" - Generate an image with survey text, upload??

* 0.2.0
    * High - Survey Post Expanded View
    * High - Survey Post Redesign (more Reddit Like)
      * Include subreddit theme coloring?

* 0.3.0
  * High - ??Text Responses??

* 0.4.0
  * High - Dashboard redesign
  * High - Results charts revamp

## General
* Update text fallback for old reddit to include link to new reddit (try markdown)
  * Update fallback text when survey is deleted. Would need trigger to update as well if mod deletes the post itself? Could fallback set it if config fetched and not exists.
* Migration Framework
  * Migrate postIds + hub API
* Discuss if there is a way to build in bot-bouncer checks (i.e. read wiki?)
* Add trigger to detect user bans immediately
* Text field support
  * Text response comments: anonymously posted or posted as user
  * If the app comments something, and it is removed (or flagged by Reddit filters), the app is likely to be banned? How can I avoid this?
* Allow image upload for description and options
    * Will need expanded view for these

## Dashboard
* ~~Auth-Token Timeout Modal/Message~~ (resolved by Reddit?)
* ~~Link to survey post for published surveys~~
* ~~View live survey config (settings, questions, etc.)~~
* ~~Intro and descriptions do not allow paragraphs/markdown~~
* ~~Import/Export Survey Config~~
* ~~Send Welcome Modmail on Install (link to Wiki for Tutorials/Setup)~~
* ~~Update notice + release notes within dashboard~~
* ~~Modify dashboard post for non-mods to a list of live/closed surveys~~
* Export Survey Responses to CSV/Xlsx
* When surveys are published, add new "shareImageUrl" => https://developers.reddit.com/docs/capabilities/creating_custom_post#custom-post-styles
* Provide feedback within dashboard (and post help)
* Handle cross-device/multi-tab editing. Channels? Lock?
    * Allow all mods to see all surveys?
* Survey settings
  * Add Flair to Survey Post
  * Background/button colors (use community theme defaults)
  * Allow multiple submissions
  * Anonymous (default), user choice
  * Application mode
  * Save default settings for future surveys
* Survey Question Settings
  * Required
  * Randomize question options
  * (Checkbox) Max selection (e.g. only 3 of 5 can be selected)
* Markdown support for images, including options
  * Maybe a media library?
* Preview survey (theme, mobile vs desktop, etc.)
* Duplicate/Copy survey (automatic export/import)
* Rolling/Repeating survey (i.e. monthly reposts)
* Repost live survey
* Better error handling with mute/mod/karma failing 500 errors
  * Site banned and shadowbanned user seem to throw 500s?
* Survey list filter / pagination
* Survey Post option to RunAs Author
  * is this possible as a scheduled post? Might only work as "immediate" posts.
  * May be possible at some point in the future, but no official confirmation yet.

## Survey Post
* Text responses (added as comment)
  * Choose anonymous
* Multiple responses
* Help screens
* Feedback / report issue -> Send mod mail with details
* Expanded view for taking survey

## Know Issues

**General**

* Bug: Safari does not follow user's Reddit theme preference. OS theme takes priority.

**Hub**

* Bug: Visual - iPad landscape is a bit wonky with the width being cut-off.
* Bug: Visual - Text for "there are no closed/live surveys" (filter selection is empty) should be centered

**Dashboard**

* Bug: Editing surveys on two separate devices at the same time
* Bug: If survey list is scrolled, the editor also starts already scrolled, which cuts off the setting tabs.
* Bug: Editing a "scheduled" survey, the publish dialog does not show the previously selected publish or close date.
* Bug: Visual - Flair criteria shows "code" (TxtEq)

**Survey Posts**

* Bug: Text fallback confusion - Update text on delete to show deleted. Add link to new reddit.
