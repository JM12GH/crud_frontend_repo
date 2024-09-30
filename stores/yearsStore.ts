import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from '#app';
import type {AxiosInstance} from 'axios';
import type {Student} from '~/stores/studentStore';

export const useYearsStore = defineStore('years', () => {
    const nuxtApp = useNuxtApp();
    const $axios = nuxtApp.$axios as AxiosInstance;
    const years = ref<number[]>([]);

    const fetch = async () => {
        let studentsData: Student[] = [];
        let studentsPage = 1;
        let studentsTotalPages = 1;

        try {
            do {
                const response = await $axios.get<{ data: Student[], meta: { last_page: number } }>('/students', {
                    params: {page: studentsPage},
                });

                studentsData = studentsData.concat(response.data.data || []);
                studentsTotalPages = response.data.meta.last_page ?? 1;
                studentsPage++;
            } while (studentsPage <= studentsTotalPages);

            const yearsSet = new Set(
                studentsData.map(student => student.year)
            );

            years.value = Array.from(yearsSet).sort((a, b) => b - a);
        } catch (error) {
            console.error('Failed to fetch unique years:', error);

        }
    };

    return {
        years,
        fetch,
    };
});