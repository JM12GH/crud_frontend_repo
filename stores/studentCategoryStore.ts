import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from '#app';
import type {AxiosInstance} from 'axios';
import {useNotification} from '~/composables/useNotification';
import {usePagination} from '~/composables/usePagination';

export interface StCategory {
    id?: number;
    name: string;
    max_allow: number;
}

export const useStCategoryStore = defineStore('studentcategory', () => {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios as AxiosInstance;
    const initialCategory: StCategory = {
        name: '',
        max_allow: 0,
    };

    const studentcategory = ref<StCategory>({...initialCategory});
    const currentId = ref<number | null>(null);
    const studentcategories = ref<StCategory[]>([]);

    const {
        notificationMessage,
        isNotificationError,
        setNotification,
        clearNotification
    } = useNotification();

    const {pagination, updatePage} = usePagination();
    const fetch = async (page: number = pagination.value.current_page) => {
        try {
            const response = await $axios.get('/student_categories', {params: {page}});
            studentcategories.value = response.data.data || [];
            pagination.value = {
                current_page: response.data.meta.current_page ?? 1,
                last_page: response.data.meta.last_page ?? 1,
            };
        } catch (error) {
            setNotification('Failed to fetch student categories.', true);
        }
    };

    const fetchById = async (id: number) => {
        try {
            const response = await $axios.get(`/student_categories/${id}`);
            studentcategory.value = response.data.data;
            currentId.value = id;
        } catch (error) {
            setNotification('Failed to fetch student category.', true);
        }
    };

    const submit = async () => {
        try {
            if (currentId.value) {
                await $axios.put(`/student_categories/${currentId.value}`, studentcategory.value);
                const index = studentcategories.value.findIndex((a) => a.id === currentId.value);
                if (index !== -1) {
                    studentcategories.value[index] = {...studentcategory.value};
                }
                setNotification('Student category updated successfully.', false);
            } else {
                const response = await $axios.post('/student_categories', studentcategory.value);
                studentcategories.value.push(response.data.data);
                setNotification('Student category created successfully.', false);
            }
            studentcategory.value = {...initialCategory};
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
            await $axios.delete(`/student_categories/${id}`);
            studentcategories.value = studentcategories.value.filter((a) => a.id !== id);
            setNotification('Student  Category deleted successfully!', false);
        } catch (error) {
            setNotification('Failed to delete student category', true);
        }
    };

    const fetchAll = async () => {
        try {
            let allCategories: StCategory[];
            let currentPage = 1;
            const fetchPage = async (page: number) => {
                const response = await $axios.get('/student_categories', {params: {page}});
                return response.data;
            };

            const firstPageData = await fetchPage(currentPage);
            allCategories = [...firstPageData.data];
            const totalPages = firstPageData.meta.last_page ?? 1;

            for (currentPage = 2; currentPage <= totalPages; currentPage++) {
                const pageData = await fetchPage(currentPage);
                allCategories = [...allCategories, ...pageData.data];
            }
            studentcategories.value = Array.from(new Map(allCategories.map(category => [category.id, category])).values());
        } catch (error) {
            setNotification('Failed to fetch all student categories.', true);
        }
    };
    const resetCategory = () => {
        studentcategory.value = {...initialCategory};
        currentId.value = null;
    };


    return {
        studentcategory,
        studentcategories,
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
        resetCategory,
    };
});
