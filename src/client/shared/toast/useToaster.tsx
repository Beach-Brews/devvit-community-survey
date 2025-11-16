/*!
* Hook for managing toaster messages.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { AddToast, RemoveToast, Toast } from './toastTypes';
import { useCallback, useState } from 'react';
import { genToastId } from '../../../shared/redis/uuidGenerator';

export const useToaster = (): [Toast[], AddToast, RemoveToast] => {

    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast: AddToast = useCallback((toast: Toast): void => {
        toast.id = toast?.id || genToastId();
        setToasts(s => {
            const sliced = s.length >= 5
                ? s.slice(s.length - 4, 5)
                : s;
            return [...sliced, toast];
        });
    }, [setToasts]);
    
    const removeToast: RemoveToast = useCallback((toastId: string) => {
        setToasts(s => s.filter(t => t.id !== toastId));
    }, [setToasts]);

    return [toasts, addToast, removeToast];
};
