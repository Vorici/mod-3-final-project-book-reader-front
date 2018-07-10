const BOOK_URL = "http://localhost:3000/api/v1/books/"

var mainHTML            = document.getElementById("container")
var bookSidebarHTML     = document.getElementById("sidebar")
var bookDetailHTML      = document.getElementById("book-detail")
var booksObj;

getBooksFromApi();

function getBooksFromApi() {
fetch(BOOK_URL).then(r => r.json()).then(b => pushBooks(b))

}

function pushBooks(books) {
booksObj = books;
bookSidebarHTML.innerHTML = ""

displaySideBooks();
}

function addBookToDatabase(bookID, content) {
 return fetch(`${BOOK_URL}/${bookID}`, {
  method: "PATCH",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    'content': content
  })
})
}

function displaySideBooks() {

booksObj.forEach(book => {
    bookSidebarHTML.innerHTML +=
      `<ul class="list-group">
      <li data-action="${book.id}" class="list-group-item">${book.title}</li>
      </ul>
    </div>`
})
}

function displayMainBook(book){
bookDetailHTML.innerHTML =
  ` <h1>${book.title}</h1>
    <h4>${book.author}</h4>
    <textarea id="edit-field" data-index="${book.id}">${book.content}</textarea>
      <button data-action="save" data-index="${book.id}" id="edit-book" class="btn btn-info">
        Save
      </button>`
}

document.addEventListener('DOMContentLoaded', () => {


document.body.addEventListener('click', function(event) {

  booksObj.forEach(function(b) {
    if (event.target.dataset.action === `${b.id}`) {

        displayMainBook(b);
    }
  })

    if (event.target.dataset.action === "save") {
      var editField           = document.getElementById("edit-field");
      var editFieldValue      = editField.value
      var bookId              = parseInt(event.target.dataset.index)

        addBookToDatabase(bookId, editFieldValue).then( ()=>getBooksFromApi() );

          if (!addBookToDatabase.error) {
              bookDetailHTML.innerHTML    = " BEER DESCRIPTION SAVED!"
          } else {
              bookDetailHTML.innerHTML    = "OOPS SOMETHING WENT WRONG..."
          }

            // fetch(BOOK_URL).then(r => r.json()).then(b => pushBooks(b))
            // console.log(booksObj)
            // displaySideBooks();

    }
  })
})
