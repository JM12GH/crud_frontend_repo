import {ref} from 'vue';

const notificationMessage = ref('');
const isNotificationError = ref(false);

const setNotification = (message: string, isError: boolean) => {
    notificationMessage.value = message;
    isNotificationError.value = isError;
};

const clearNotification = () => {
    notificationMessage.value = '';
    isNotificationError.value = false;
};

export const useNotification = () => {
    return {
        notificationMessage,
        isNotificationError,
        setNotification,
        clearNotification,
    };
}