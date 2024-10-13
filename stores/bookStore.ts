import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from '#app';
import type {AxiosInstance} from 'axios';
import {useNotification} from '~/composables/useNotification';
import {usePagination} from '~/composables/usePagination';
import type {Author} from '~/stores/authorStore';
import type {BookCategory} from '~/stores/bookCategoryStore';

export interface Book {
    id?: number;
    title: string;
    description: string;
    shelf_number: string;
    preview_photo: File | null;
    total_nr_of_copies: number;
    book_category: BookCategory;
    authors: Author[];

    [key: string]: any;
}

export const useBookStore = defineStore('bookStore', () => {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios as AxiosInstance;

    const initialBook: Book = {
        title: '',
        description: '',
        shelf_number: '',
        preview_photo: null as File | null,
        total_nr_of_copies: 0,
        book_category: {
            id: 0,
            name: '',
        },
        authors: [],
    };

    const book = ref<Book>({...initialBook});
    const currentId = ref<number | null>(null);
    const books = ref<Book[]>([]);

    const selectedCategory = ref<string | number>('');
    const {pagination, updatePage} = usePagination();
    const {notificationMessage, isNotificationError, setNotification, clearNotification} = useNotification();

    const fetch = async (page = pagination.value.current_page) => {
        try {
            const response = await $axios.get('/books', {
                params: {
                    page,
                    book_category_id: selectedCategory.value,
                },
            });
            books.value = response.data.data || [];
            pagination.value.current_page = response.data.meta.current_page ?? 1;
            pagination.value.last_page = response.data.meta.last_page ?? 1;
        } catch (error) {
            setNotification('Failed to fetch books', true);
        }
    };

    const fetchById = async (id: number) => {
        try {
            const response = await $axios.get(`/books/${id}`);
            book.value = response.data.data;
            currentId.value = id;
        } catch (error) {
            setNotification('Failed to fetch book.', true);
        }
    };

    const submit = async () => {
        try {
            const formData = new FormData();
            formData.append('title', book.value.title);
            formData.append('shelf_number', book.value.shelf_number.toString());
            formData.append('total_nr_of_copies', book.value.total_nr_of_copies.toString());
            formData.append('description', book.value.description || '');
            formData.append('book_category_id', String(book.value.book_category.id));

            if (book.value.preview_photo instanceof File) {
                formData.append('preview_photo', book.value.preview_photo);
            }

            book.value.authors.forEach((author) => {
                formData.append('authors[]', String(author.id));
            });

            if (currentId.value) {
                formData.append('_method', 'PUT');
                await $axios.post(`/books/${currentId.value}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const index = books.value.findIndex((a) => a.id === currentId.value);
                if (index !== -1) {
                    books.value[index] = {...book.value};
                }
                setNotification('Book updated successfully.', false);
            } else {
                const response = await $axios.post('/books', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                books.value.push(response.data.data);
                setNotification('Book created successfully.', false);
            }

            book.value = {...initialBook};
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


    const fetchAll = async () => {
        try {
            let booksData: Book[] = [];
            let booksPage = 1;
            let booksTotalPages = 1;
            do {
                const response = await $axios.get('/books', {params: {page: booksPage}});
                booksData = booksData.concat(response.data.data || []);
                booksTotalPages = response.data.meta.last_page ?? 1;
                booksPage++;
            } while (booksPage <= booksTotalPages);

            books.value = booksData;
        } catch (error) {
            setNotification('Failed to fetch all books.', true);
        }
    };

    const remove = async (id: number) => {
        try {
            await $axios.delete(`/books/${id}`);
            books.value = books.value.filter((a) => a.id !== id);
            setNotification('Book deleted successfully!', false);
        } catch (error) {
            setNotification('Failed to delete book', true);
        }
    };

    const resetBook = () => {
        book.value = {...initialBook};
        currentId.value = null;
    };


    return {
        book,
        books,
        currentId,
        pagination,
        notificationMessage,
        isNotificationError,
        selectedCategory,
        fetch,
        fetchById,
        fetchAll,
        submit,
        remove,
        clearNotification,
        updatePage: updatePage(fetch),
        resetBook,

    };
});
