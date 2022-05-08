// Book Class: Represents a Book
class Book {
  constructor(title, author, publisher, isbn){
    this.title = title;
    this.author = author;
    this.publisher = publisher;
    this.isbn = isbn;
  }
}
// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBook(book));
  }
  static addBook(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
     <td>${book.title}</td>
     <td>${book.author}</td>
     <td>${book.publisher}</td>
     <td>${book.isbn}</td>
     <td><a href="#" class="button delete">X</a></td>
    `;
    list.appendChild(row);
  }
  static deleteBook(element) {
    if(element.classList.contains('delete')){
      element.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    // 3 second timeout
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#publisher').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    
    books.push(book);
    
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}
// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) =>
{
  // Prevent Actual Submit
  e.preventDefault();

  //Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const publisher = document.querySelector('#publisher').value;
  const isbn = document.querySelector('#isbn').value;
  // Validate
  if(title === '' || author === '' || publisher === '' || isbn === ''){
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
  // Instantiate Book
  const book = new Book(title, author, publisher, isbn);

  // Add Book to UI
  UI.addBook(book);

  //Add Book to Storage
  Store.addBook(book);

  // Show Success Message
  UI.showAlert('Book Added', 'success');

  // Clear Fields
  UI.clearFields();
 }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove Book From UI
  UI.deleteBook(e.target);
  // Remove Book From Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // Show Success Message
  UI.showAlert('Book Removed', 'success');

})