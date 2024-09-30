// ~/stores/studentStore.ts

import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from '#app';
import type {AxiosInstance} from 'axios';
import {useNotification} from '~/composables/useNotification';
import {usePagination} from '~/composables/usePagination';
import type {Branch} from '~/stores/branchStore';
import type {StCategory} from '~/stores/studentCategoryStore';
import type {Book} from '~/stores/bookStore';


export interface Student {
    id?: number;
    first_name: string;
    last_name: string;
    year: number;
    email: string;
    is_approved: boolean;
    branch: Branch;
    student_category: StCategory;
    books: Book[];
}

export const useStudentStore = defineStore('studentStore', () => {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios as AxiosInstance;

    const initialStudent: Student = {
        first_name: '',
        last_name: '',
        year: 0,
        email: '',
        is_approved: false,
        branch: {id: 0, name: ''},
        student_category: {id: 0, name: '', max_allow: 0},
        books: [],
    };
    const student = ref<Student>({...initialStudent});
    const currentId = ref<number | null>(null);
    const students = ref<Student[]>([]);
    const selectedBranch = ref<string | number>('');
    const selectedCategory = ref<string | number>('');
    const selectedYear = ref<string | number>('');
    const {pagination, updatePage} = usePagination();
    const {notificationMessage, isNotificationError, setNotification, clearNotification} = useNotification();

    const fetch = async (page = pagination.value.current_page) => {
        try {
            const response = await $axios.get('/students', {
                params: {
                    page,
                    branch_id: selectedBranch.value,
                    student_category_id: selectedCategory.value,
                    year: selectedYear.value,
                },
            });
            students.value = response.data.data || [];
            pagination.value.current_page = response.data.meta.current_page ?? 1;
            pagination.value.last_page = response.data.meta.last_page ?? 1;
        } catch (error) {
            setNotification('Failed to fetch students', true);
        }
    };

    const fetchById = async (id: number) => {
        try {
            const response = await $axios.get(`/students/${id}`);
            const studentData = response.data.data;
            student.value = {
                ...studentData,
                is_approved: !!studentData.is_approved,
            };
            currentId.value = id;
        } catch (error) {
            setNotification('Failed to fetch student.', true);
        }
    };


    const submit = async () => {
        try {
            const payload = {
                ...student.value,
                branch_id: student.value.branch.id,
                student_category_id: student.value.student_category.id,
                books: student.value.books.map(book => book.id),
            };

            if (currentId.value) {
                await $axios.put(`/students/${currentId.value}`, payload);
                const index = students.value.findIndex((a) => a.id === currentId.value);
                if (index !== -1) {
                    students.value[index] = {...student.value};
                }
                setNotification('Student updated successfully.', false);
            } else {

                const response = await $axios.post('/students', payload);
                students.value.push(response.data.data);
                setNotification('Student created successfully.', false);
            }
            student.value = {...initialStudent};
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
            await $axios.delete(`/students/${id}`);
            students.value = students.value.filter((a) => a.id !== id);
            setNotification('Student deleted successfully!', false);
        } catch (error) {
            setNotification('Failed to delete student', true);
        }
    };

    const resetStudent = () => {
        student.value = {...initialStudent};
        currentId.value = null;
    };

    return {
        student,
        students,
        currentId,
        pagination,
        notificationMessage,
        isNotificationError,
        selectedBranch,
        selectedCategory,
        selectedYear,
        fetch,
        fetchById,
        submit,
        remove,
        clearNotification,
        updatePage: updatePage(fetch),
        resetStudent,
    };
});