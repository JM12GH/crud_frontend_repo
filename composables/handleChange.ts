import {ref} from 'vue';
import {useBookStore} from '~/stores/bookStore';
import type {Author} from '~/stores/authorStore';

type BookStore = ReturnType<typeof useBookStore>;

const currentFileName = ref<string | null>(null);

export const handleFileChange = (event: Event, store: BookStore) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files[0]) {
        store.book.preview_photo = files[0];
        currentFileName.value = files[0].name;
        console.log('Selected file:', files[0]);
    }
}

export const handleAuthorChange = (event: Event, author: Author, store: BookStore) => {
    const target = event.target as HTMLInputElement;
    const authorId = author.id;

    if (target.checked) {
        if (!store.book.authors.some(a => a.id === authorId)) {
            store.book.authors.push(author);
        }
    } else {
        store.book.authors = store.book.authors.filter(a => a.id !== authorId);
    }
}
