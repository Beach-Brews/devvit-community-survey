/*!
* Component for displaying toaster messages.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { RemoveToast, Toast, ToastType } from '../shared/toast/toastTypes';
import { useEffect } from 'react';
import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export interface PostToastCardProps {
    toast: Toast;
    removeToast: RemoveToast;
}

const PostToastCard = (props: PostToastCardProps) => {

    const { toast, removeToast } = props;

    const { id: toastId, time: toastTime } = toast;
    useEffect(() => {
        if (!toastId) return;

        const timeoutId = setTimeout(() => {
            removeToast(toastId);
        }, toastTime ?? 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [toastId, toastTime, removeToast]);

    const [borderColor, defaultIcon] = (() => {
        switch (toast.type) {
            case ToastType.Success: return ["border-green-500", <CheckIcon className="size-6" />];
            case ToastType.Alert: return ["border-yellow-500", <ExclamationTriangleIcon className="size-6" />];
            case ToastType.Error: return ["border-red-500", <XCircleIcon className="size-6" />];
            case ToastType.Info: default: return ["border-blue-500", <InformationCircleIcon className="size-6" />];
        }
    })();

    const icon = toast.icon === undefined ? defaultIcon : toast.icon;

    return (
        <div className={`w-full p-2 border-1 border-l-6 ${borderColor} rounded flex gap-2 items-center text-neutral-900 bg-neutral-50 dark:text-neutral-100 dark:bg-neutral-950`}>
            {icon && (<div className="size-6">{icon}</div>)}
            <div className="flex-grow">
                {toast.heading && (<strong>{toast.heading}</strong>)}
                {toast.message}
            </div>
        </div>
    );
};

export interface PostToasterProps {
    toasts: Toast[];
    removeToast: RemoveToast;
}

export const PostToaster = (props: PostToasterProps)=> {
    return (
        <div key="toast-container" className="w-2/3 fixed top-2 right-2 flex flex-col justify-center items-center gap-2">
            {props.toasts.map(t => <PostToastCard key={t.id} toast={t} removeToast={props.removeToast} />)}
        </div>
    )
};
