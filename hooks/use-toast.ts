// hooks/use-toast.ts
"use client";

import * as React from "react";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

type ToastVariant = "default" | "destructive" | "success";

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    open: boolean;
}

interface ToastState {
    toasts: Toast[];
}

type Action =
    | { type: "ADD_TOAST"; toast: Toast }
    | { type: "UPDATE_TOAST"; toast: Partial<Toast> & Pick<Toast, "id"> }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string };

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({ type: "REMOVE_TOAST", toastId });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

function reducer(state: ToastState, action: Action): ToastState {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case "DISMISS_TOAST": {
            const { toastId } = action;

            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((t) => addToRemoveQueue(t.id));
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? { ...t, open: false }
                        : t
                ),
            };
        }

        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return { ...state, toasts: [] };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };

        default:
            return state;
    }
}

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
}

interface ToastOptions {
    title?: string;
    description?: string;
    variant?: ToastVariant;
}

function toast(options: ToastOptions) {
    const id = genId();

    const update = (props: ToastOptions) =>
        dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...options,
            id,
            open: true,
        },
    });

    // Auto dismiss after delay
    setTimeout(() => dismiss(), TOAST_REMOVE_DELAY);

    return { id, dismiss, update };
}

function useToast() {
    const [state, setState] = React.useState<ToastState>(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) listeners.splice(index, 1);
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) =>
            dispatch({ type: "DISMISS_TOAST", toastId }),
    };
}

export { useToast, toast };
