import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from '#app';
import type {AxiosInstance} from 'axios';
import {useNotification} from '~/composables/useNotification';
import {usePagination} from '~/composables/usePagination';

export interface Author {
    id?: number;
    first_name: string;
    last_name: string;
    description: string;
}

export const useAuthorStore = defineStore('author', () => {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios as AxiosInstance;

    const initialAuthor: Author = {
        first_name: '',
        last_name: '',
        description: '',
    };

    const author = ref<Author>({...initialAuthor});
    const currentId = ref<number | null>(null);
    const authors = ref<Author[]>([]);
    const {
        notificationMessage,
        isNotificationError,
        setNotification,
        clearNotification
    } = useNotification();

    const {pagination, updatePage} = usePagination();
    const fetch = async (page: number = pagination.value.current_page) => {
        try {
            const response = await $axios.get('/authors', {params: {page}});
            authors.value = response.data.data || [];
            pagination.value = {
                current_page: response.data.meta.current_page ?? 1,
                last_page: response.data.meta.last_page ?? 1,
            };
        } catch (error) {
            setNotification('Failed to fetch authors.', true);
        }
    };

    const fetchById = async (id: number) => {
        try {
            const response = await $axios.get(`/authors/${id}`);
            author.value = response.data.data;
            currentId.value = id;
        } catch (error) {
            setNotification('Failed to fetch author.', true);
        }
    };

    const submit = async () => {
        try {
            if (currentId.value) {
                await $axios.put(`/authors/${currentId.value}`, author.value);
                const index = authors.value.findIndex((a) => a.id === currentId.value);
                if (index !== -1) {
                    authors.value[index] = {...author.value};
                }
                setNotification('Author updated successfully.', false);
            } else {
                const response = await $axios.post('/authors', author.value);
                authors.value.push(response.data.data);
                setNotification('Author created successfully.', false);
            }

            author.value = {...initialAuthor};
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
            await $axios.delete(`/authors/${id}`);
            authors.value = authors.value.filter((a) => a.id !== id);
            setNotification('Author deleted successfully.', false);
        } catch (error) {
            setNotification('Failed to delete author.', true);
        }
    };
    const fetchAll = async () => {
        try {
            let authorsData: Author[] = [];
            let authorsPage = 1;
            let authorsTotalPages = 1;
            do {
                const response = await $axios.get('/authors', {params: {page: authorsPage}});
                authorsData = authorsData.concat(response.data.data || []);
                authorsTotalPages = response.data.meta.last_page ?? 1;
                authorsPage++;
            } while (authorsPage <= authorsTotalPages);

            authors.value = authorsData;
        } catch (error) {
            setNotification('Failed to fetch all authors.', true);
        }
    };
    const resetAuthor = () => {
        author.value = {...initialAuthor};
        currentId.value = null;
    };


    return {
        author,
        authors,
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
        resetAuthor,
    };
});
