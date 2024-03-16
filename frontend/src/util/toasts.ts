import {toast} from "react-toastify";

export const showInformationToast = (message: string) => {
    toast.info(message, {
        position: toast.POSITION.TOP_RIGHT,
    });
};
export const showSuccessToast = (message: string) => {
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
    });
};

export const showFailureToast = (message: string) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
    });
};