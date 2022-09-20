document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    })

    if(isStorage()){
        loadBooksFromStorage();
    }   
})

document.addEventListener("DATA_SAVED", function() {
    console.log("Data berhasil disimpan.");
    });
    
    document.addEventListener("DATA_LOADED", function() {
    refreshDataBuku();
    });

const BOOK_ID = "bookId";
const incompletebook = "incompleteBookshelfList";
const completebook = "completeBookshelfList";

function makeBook(judulBuku, namaPenulis, tahunTerbit, isCompleted) {
    const textTitle = document.createElement("h1");
    textTitle.innerText = judulBuku;

    const textAuthor = document.createElement("h5");
    textAuthor.innerText = "Penulis: " + namaPenulis;

    const textYear = document.createElement("h5");
    textYear.innerText = "Tahun: " + tahunTerbit;

    const textContainer =  document.createElement("article");
    textContainer.classList.add("book_item");
    textContainer.append(textTitle, textAuthor, textYear);

    const buttonContainer =  document.createElement("div");
    buttonContainer.classList.add("action");

    if (isCompleted) {
        buttonContainer.append(tombolBelumSelesai("Belum Selesai Dibaca"), buttonWarnaMerah("Hapus Buku"));
    } else {
        buttonContainer.append(tombolSelesaiBaca("Selesai Dibaca"), buttonWarnaMerah("Hapus Buku"));
    }

    textContainer.append(buttonContainer);

    return textContainer;
}

function tombolBelumSelesai(isBookCompleted) {
    return createButton("green", function(event) {
        selesaiBaca(event.target.parentElement.parentElement);
    }, isBookCompleted);
}

function tombolSelesaiBaca(isBookCompleted) {
    return createButton("green", function(event) {
        belumSelesaiBaca(event.target.parentElement.parentElement);
    }, isBookCompleted);
}

function buttonWarnaMerah(isBookCompleted) {
    return createButton("red", function(event) {
        const pesanPertama = confirm("Apakah Anda yakin mau menghapus buku ini?");
        const pesanKedua = confirm("Buku berhasil dihapus");
        if (pesanPertama, pesanKedua) {
            removeBook(event.target.parentElement.parentElement);
        }
    }, isBookCompleted);
}

function createButton(buttonTypeClass, eventListener, isBookCompleted) {
    const button = document.createElement("button");
    button.innerText = isBookCompleted;
    button.classList.add(buttonTypeClass);
    
    button.addEventListener("click", function(event) {
        eventListener(event);
    });

    return button;
}

function addBook () {
    const incompleteBooksList = document.getElementById(incompletebook);
    const completeBooksList = document.getElementById(completebook); 

    const judulBuku = document.getElementById("inputBookTitle").value;
    const namaPenulis = document.getElementById("inputBookAuthor").value;
    const tahunTerbit = document.getElementById("inputBookYear").value;
    const kotakCheckBox = document.getElementById("inputBookIsComplete").checked;
// books menampung bookObject
    const createBook = makeBook(judulBuku, namaPenulis, tahunTerbit, kotakCheckBox);
    const bookObject = composeBookObject(judulBuku, namaPenulis, tahunTerbit, kotakCheckBox);
    createBook[BOOK_ID] = bookObject.id;
    books.push(bookObject);

    if (kotakCheckBox) {
        completeBooksList.append(createBook);
        updateStorage();
    } else {
        incompleteBooksList.append(createBook);
        updateStorage();
    }
}

function belumSelesaiBaca(book) {
    const judul = book.querySelector(".book_item > h1").innerText;
    const penulis = book.querySelectorAll(".book_item > h5")[0].innerText.slice(8);
    const tahun = book.querySelectorAll(".book_item > h5")[1].innerText.slice(7);

    const newBook = makeBook(judul, penulis, tahun, true);
    const bookFound = searchBook(book[BOOK_ID]);
    bookFound.isCompleted = true;
    newBook[BOOK_ID] = bookFound.id;

    const completeBooksList = document.getElementById(completebook); 
    completeBooksList.append(newBook);
    book.remove();

    updateStorage();
}

function selesaiBaca(book) {
    const judul = book.querySelector(".book_item > h1").innerText;
    const penulis = book.querySelectorAll(".book_item > h5")[0].innerText.slice(8);
    const tahun = book.querySelectorAll(".book_item > h5")[1].innerText.slice(7);

    const newBook = makeBook(judul, penulis, tahun, false);
    const bookFound = searchBook(book[BOOK_ID]);
    bookFound.isCompleted = false;
    newBook[BOOK_ID] = bookFound.id;

    const incompleteBooksList = document.getElementById(incompletebook);
    incompleteBooksList.append(newBook);
    book.remove();
    updateStorage();
}

function removeBook(book) {
    const posisiBuku = searchBookId(book[BOOK_ID]);
    books.splice(posisiBuku, 1);
    book.remove();
    updateStorage();
}

function refreshDataBuku() {
    const incompleteBooksList = document.getElementById(incompletebook);
    const completeBooksList = document.getElementById(completebook); 

    for (book of books) {
        const newBook = makeBook(book.judul, book.penulis, book.tahun, book.isCompleted);
        newBook[BOOK_ID] = book.id;

        if (book.isCompleted) {
            completeBooksList.append(newBook);
        } else {
            incompleteBooksList.append(newBook);
        }
    }
}