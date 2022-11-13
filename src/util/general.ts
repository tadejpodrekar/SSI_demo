import type { ToastServiceMethods } from 'primevue/toastservice';

export const showError = (toast: ToastServiceMethods, message: string = 'Error Message', detail: string = 'Message Content') => {
    toast.add({ severity: 'error', summary: message, detail: detail, group: 'br', life: 3000 });
}

export const showSuccess = (toast: ToastServiceMethods, title: string = 'Success', message: string = 'Message Content') => {
    toast.add({ severity: 'success', summary: title, detail: message, group: 'br', life: 3000 });
}

/**
 * Function to show a success or error toast message based on the response from the function.
 * For PrimeVue Buttons, will set loading state until the function is complete and then show the toast.
 * If the function return type is void, no toast will be shown.
 * @param toast ToastServiceMethods from PrimeVue
 * @param func function to execute
 * @param loading loading state
 */
export const funcWrapper = async (toast: ToastServiceMethods, func: Function, loading: {value: Boolean}) => {
    loading.value = true;
    try {
        const successMsg = await func();
        if (typeof successMsg === 'string') showSuccess(toast, successMsg);
    } catch (err: any) {
        showError(toast, 'Error', err.message);
    }
    loading.value = false;
}