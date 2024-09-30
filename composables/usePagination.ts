import {ref} from 'vue';

interface Pagination {
    current_page: number;
    last_page: number;
}

const pagination = ref<Pagination>({
    current_page: 1,
    last_page: 1,
});

const updatePage = (fetch: (page: number) => Promise<void>) => (page: number) => {
    if (page > 0 && page <= pagination.value.last_page) {
        pagination.value.current_page = page;
        fetch(page).then(() => {
        })
            .catch((error) => {
                console.error("Failed to fetch page:", error);
            });
    }
};

export function usePagination() {
    return {
        pagination,
        updatePage,
    };
}