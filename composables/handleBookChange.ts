import {useStudentStore} from '~/stores/studentStore';
import type {Book} from '~/stores/bookStore';

type StudentStore = ReturnType<typeof useStudentStore>;

export const handleChange = (event: Event, book: Book, store: StudentStore) => {
    const target = event.target as HTMLInputElement;
    const bookId = book.id;

    if (target.checked) {
        if (!store.student.books.some((a: Book) => a.id === bookId)) {
            store.student.books.push(book);
        }
    } else {
        store.student.books = store.student.books.filter((a: Book) => a.id !== bookId);
    }
};
