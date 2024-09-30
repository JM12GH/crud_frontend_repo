import {ref} from 'vue';

export const useDeletePopup = () => {
    const isPopupVisible = ref(false);
    const popupDataType = ref('');
    const popupRecordId = ref<number | null>(null);

    const confirmDelete = (id: number, dataType: string) => {
        popupRecordId.value = id;
        popupDataType.value = dataType;
        isPopupVisible.value = true;
    };

    const handleDelete = async (store: any) => {
        if (popupRecordId.value !== null) {
            await store.remove(popupRecordId.value);
            isPopupVisible.value = false;
        }
    };

    const closePopup = () => {
        isPopupVisible.value = false;
    };

    return {
        isPopupVisible,
        popupDataType,
        popupRecordId,
        confirmDelete,
        handleDelete,
        closePopup,
    };
}
