/*!
 * General helper / utility type definitions.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

export type SyncHandler<T> = () => T;
export type AsyncHandler<T> = () => Promise<T>;

export enum PostType {
    Survey,
    Dashboard
}
