import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from '#app';
import type {AxiosInstance} from 'axios';
import {useNotification} from '~/composables/useNotification';
import {usePagination} from '~/composables/usePagination';

export interface BookCategory {
    id?: number;
    name: string;
}

export const useBookCategoryStore = defineStore('bookcategory', () => {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios as AxiosInstance;

    const initialBookCat: BookCategory = {name: ''};
    const bookcategory = ref<BookCategory>({...initialBookCat});
    const currentId = ref<number | null>(null);
    const bookcategories = ref<BookCategory[]>([]);

    const {
        notificationMessage,
        isNotificationError,
        setNotification,
        clearNotification,
    } = useNotification();

    const {pagination, updatePage} = usePagination();

    const fetch = async (page: number = pagination.value.current_page) => {
        try {
            const response = await $axios.get('/book_categories', {params: {page}});
            bookcategories.value = response.data.data || [];
            pagination.value = {
                current_page: response.data.meta.current_page ?? 1,
                last_page: response.data.meta.last_page ?? 1,
            };
        } catch (error) {
            setNotification('Failed to fetch book categories.', true);
        }
    };

    const fetchById = async (id: number) => {
        try {
            const response = await $axios.get(`/book_categories/${id}`);
            bookcategory.value = response.data.data;
            currentId.value = id;
        } catch (error) {
            setNotification('Failed to fetch book category.', true);
        }
    };

    const submit = async () => {
        try {
            if (currentId.value) {
                await $axios.put(`/book_categories/${currentId.value}`, bookcategory.value);
                const index = bookcategories.value.findIndex((a) => a.id === currentId.value);
                if (index !== -1) {
                    bookcategories.value[index] = {...bookcategory.value};
                }
                setNotification('Book category updated successfully.', false);
            } else {
                const response = await $axios.post('/book_categories', bookcategory.value);
                bookcategories.value.push(response.data.data);
                setNotification('Book category created successfully.', false);
            }
            resetCategory();
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
            await $axios.delete(`/book_categories/${id}`);
            bookcategories.value = bookcategories.value.filter((a) => a.id !== id);
            setNotification('Book category deleted successfully.', false);
        } catch (error) {
            setNotification('Failed to delete book category.', true);
        }
    };

    const fetchAllPages = async (page: number): Promise<any> => {
        const response = await $axios.get('/book_categories', {params: {page}});
        return response.data;
    };

    const fetchAll = async () => {
        try {
            let allCategories: BookCategory[];
            const firstPageData = await fetchAllPages(1);
            allCategories = [...firstPageData.data];

            const totalPages = firstPageData.meta.last_page ?? 1;

            for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
                const pageData = await fetchAllPages(currentPage);
                allCategories = [...allCategories, ...pageData.data];
            }

            bookcategories.value = Array.from(new Map(allCategories.map((category) => [category.id, category])).values());
        } catch (error) {
            setNotification('Failed to fetch all book categories.', true);
        }
    };

    const resetCategory = () => {
        bookcategory.value = {...initialBookCat};
        currentId.value = null;
    };

    return {
        bookcategory,
        bookcategories,
        currentId,
        pagination,
        notificationMessage,
        isNotificationError,
        fetch,
        fetchById,
        submit,
        remove,
        fetchAll,
        clearNotification,
        updatePage: updatePage(fetch),
        resetCategory,
    };
});
