import axios from 'axios';
import type {AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig} from 'axios';
import {defineNuxtPlugin} from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const axiosInstance: AxiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api', // Base URL for your Laravel backend
    });

    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
            return config;
        },
        (error: AxiosError): Promise<AxiosError> => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => {
            return response;
        },
        (error: AxiosError): Promise<AxiosError> => {
            return Promise.reject(error);
        }
    );

    nuxtApp.provide('axios', axiosInstance);
});
