/*!
* Screen modal component.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { XMarkIcon } from '@heroicons/react/24/solid';
import { DashboardContext } from '../../DashboardContext';
import { MouseEvent, ReactElement, useCallback, useContext, useEffect } from 'react';
import { AsyncHandler, SyncHandler } from '../../../../shared/types/general';

export type ModalType = 'content' | 'notice' | 'confirm' | 'destroy';

export interface DashboardModalProps {
    title: string | ReactElement;
    children: ReactElement;
    type?: ModalType;
    disableClose?: boolean;
    disableAccept?: boolean;
    onAccept?: AsyncHandler<boolean>;
    onCancel?: AsyncHandler<void>;
    onClose?: AsyncHandler<void>;
    didClose?: SyncHandler<void>;
    processing?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
}

export const DashboardModal = (props: DashboardModalProps) => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const setModal = ctx.setModal;

    const onClose = props.onClose;
    const didClose = props.didClose;
    const processing = props.processing;
    const closeModal = useCallback(async ()=> {
        if (!processing && (!onClose || (await onClose()))) {
            setModal(undefined);
            didClose?.();
        }
    }, [onClose, didClose, processing, setModal]);

    useEffect(() => {
        if (props.disableClose) return;

        const escapeHandler = async (e: KeyboardEvent) => {
            if (e.key === 'Escape')
                await closeModal();
        };

        window.addEventListener('keyup', escapeHandler);

        return () => {
            window.removeEventListener('keyup', escapeHandler);
        };
    }, [props.disableClose, closeModal]);

    const onBgClick = async (e: MouseEvent<HTMLElement>) => {
        if (props.disableClose || (e.target as HTMLElement).id !== 'dashboard-modal') return;
        await closeModal();
    };

    const onCancel = async () => {
        await props.onCancel?.();
        await closeModal();
    };

    const onAccept = async () => {
        if (!props.onAccept || (await props.onAccept()))
            await closeModal();
    };

    return (
        <div className="z-10 fixed inset-0 w-full h-full flex justify-center items-center bg-black/70" id="dashboard-modal" onClick={onBgClick}>
            <div className="relative min-w-3/4 md:min-w-1/2 max-w-screen-lg min-h-[200px] flex flex-col justify-between rounded-md bg-neutral-100 dark:bg-neutral-900 border-1 border-neutral-400 dark:border-neutral-600">
                {!props.disableClose && (<div className="absolute top-4 right-4 rounded-md hover:bg-neutral-300 hover:dark:bg-neutral-600" onClick={closeModal}><XMarkIcon className="cursor-pointer size-6 lg:size-8"/></div>)}
                <div className="text-lg lg:text-2xl font-bold p-4 rounded-t-md bg-neutral-200 dark:bg-neutral-800">{props.title}</div>
                <div className="p-4">
                    {props.children}
                </div>
                {props.type === 'destroy' && (
                    <div className="p-4 pt-0 flex justify-between gap-4">
                        <button className="w-1/2 p-2 font-bold text-md cursor-pointer rounded-md bg-neutral-300 dark:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:dark:bg-neutral-800" disabled={props.processing} onClick={onCancel}>{props.cancelLabel ?? 'Cancel'}</button>
                        <button className="w-1/2 p-2 font-bold text-md cursor-pointer rounded-md bg-red-800 text-white disabled:cursor-not-allowed disabled:bg-red-950 disabled:text-white/50" disabled={props.processing || props.disableAccept} onClick={onAccept}>{props.confirmLabel ?? 'Delete'}</button>
                    </div>
                )}
                {props.type === 'confirm' && (
                    <div className="p-4 pt-0 flex justify-between gap-4">
                        <button className="w-1/2 p-2 font-bold text-md cursor-pointer rounded-md bg-neutral-300 dark:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:dark:bg-neutral-800" disabled={props.processing} onClick={onCancel}>{props.cancelLabel ?? 'Cancel'}</button>
                        <button className="w-1/2 p-2 font-bold text-md cursor-pointer rounded-md bg-blue-800 text-white disabled:cursor-not-allowed disabled:bg-blue-950 disabled:text-white/50" disabled={props.processing || props.disableAccept} onClick={onAccept}>{props.confirmLabel ?? 'Confirm'}</button>
                    </div>
                )}
            </div>
        </div>
    );
}
