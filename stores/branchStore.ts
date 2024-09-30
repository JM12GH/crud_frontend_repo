import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from '#app';
import type {AxiosInstance} from 'axios';
import {useNotification} from '~/composables/useNotification';
import {usePagination} from '~/composables/usePagination';

export interface Branch {
    id?: number;
    name: string;

}

export const useBranchStore = defineStore(' branch', () => {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios as AxiosInstance;
    const initialBranch: Branch = {name: ''};

    const branch = ref<Branch>({...initialBranch});
    const currentId = ref<number | null>(null);
    const branches = ref<Branch[]>([]);

    const {
        notificationMessage,
        isNotificationError,
        setNotification,
        clearNotification
    } = useNotification();

    const {pagination, updatePage} = usePagination();
    const fetch = async (page: number = pagination.value.current_page) => {
        try {
            const response = await $axios.get('/branches', {params: {page}});
            branches.value = response.data.data || [];
            pagination.value = {
                current_page: response.data.meta.current_page ?? 1,
                last_page: response.data.meta.last_page ?? 1,
            };
        } catch (error) {
            setNotification('Failed to fetch branch.', true);
        }
    };

    const fetchById = async (id: number) => {
        try {
            const response = await $axios.get(`/branches/${id}`);
            branch.value = response.data.data;
            currentId.value = id;
        } catch (error) {
            setNotification('Failed to fetch branch.', true);
        }
    };

    const submit = async () => {
        try {
            if (currentId.value) {
                await $axios.put(`/branches/${currentId.value}`, branch.value);
                const index = branches.value.findIndex((a) => a.id === currentId.value);
                if (index !== -1) {
                    branches.value[index] = {...branch.value};
                }
                setNotification(' Branch updated successfully.', false);
            } else {
                const response = await $axios.post('/branches', branch.value);
                branches.value.push(response.data.data);
                setNotification(' Branch created successfully.', false);
            }
            branch.value = {...initialBranch};
            currentId.value = null;
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat();
                setNotification(errorMessages.join(', '), true);
            } else {
                setNotification('Failed to submit form.', true);
            }
        }
    };


    const remove = async (id: number) => {
        try {
            await $axios.delete(`/branches/${id}`);
            branches.value = branches.value.filter((a) => a.id !== id);
            setNotification(' Branch deleted successfully.', false);
        } catch (error) {
            setNotification('Failed to delete branch.', true);
        }
    };
    const fetchAll = async () => {
        try {
            let branchesData: { id: number; name: string }[] = [];
            let branchesPage = 1;
            let branchesTotalPages = 1;
            do {
                const response = await $axios.get('/branches', {params: {page: branchesPage}});
                branchesData = branchesData.concat(response.data.data || []);
                branchesTotalPages = response.data.meta.last_page ?? 1;
                branchesPage++;
            } while (branchesPage <= branchesTotalPages);

            branches.value = Array.from(new Map(branchesData.map(branch => [branch.id, branch])).values());
        } catch (error) {
            setNotification('Failed to fetch all branches.', true);
        }
    };

    const resetBranch = () => {
        branch.value = {...initialBranch};
        currentId.value = null;
    };

    return {
        branch,
        branches,
        currentId,
        pagination,
        notificationMessage,
        isNotificationError,
        fetch,
        fetchById,
        submit,
        remove,
        clearNotification,
        updatePage: updatePage(fetch),
        fetchAll,
        resetBranch,
    };
});
