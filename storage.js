const STORAGE_KEY = "BOOKLIST_APPS";
const DATA_SAVED = "data_save";
const DATA_LOADED = "data_load";

let books = [];

// memeriksa apakah localStorage didukung oleh browser atau tidak
function isStorage() {
    if(typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

// menyimpan data ke localStorage
function saveBook () {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("DATA_SAVED"));
}

// memuat data dari localStorage
function loadBooksFromStorage() {
    const getBook = localStorage.getItem(STORAGE_KEY);
    
    let data = JSON.parse(getBook);
    
    if(data !== null) {
        for(book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event("DATA_LOADED"));
}

function composeBookObject(judul, penulis, tahun, isCompleted) {
    return {
        id: +new Date(),
        judul,
        penulis,
        tahun,
        isCompleted
    };
}

function searchBook(bookId) {
    for(book of books){
        if(book.id === bookId)
            return book;
    }
    return null;
}

function searchBookId(bookId) {
    let index = 0
    for (book of books) {
        if(book.id === bookId)
            return index;
        index++;
    }

    return -1;
}

function updateStorage() {
    if(isStorage()) {
        saveBook();
    };
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null)
    books = data;

    document.dispatchEvent(new Event("DATA_LOADED"));
}
