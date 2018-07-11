const BOOK_URL = "http://localhost:3000/api/v1/books/"
const USER_URL = "http://localhost:3000/api/v1/users/"

const ADMIN_USER_NAME = 'Admin'
var mainHTML            = document.getElementById("container")
var bookSidebarHTML     = document.getElementById("sidebar")
var bookDetailHTML      = document.getElementById("book-detail")
var booksList;
var usersList;
var adminUserId;
var currentUserId;
var booksListFilter;

getBooksFromApi();
getUsersFromApi();

function getBooksFromApi() {
  fetch(BOOK_URL).then(r => r.json()).then(b => pushBooks(b))
}

function getUsersFromApi() {
  fetch(USER_URL).then(r => r.json()).then(u =>
    {
      pushUsers(u);
      adminUserId = usersList.find(user => (user.name === ADMIN_USER_NAME)).id
    })
}

function pushUsers(users) {
    usersList = users;
  // console.log(usersList)
}

function pushBooks(books) {
  booksList = books;
  bookSidebarHTML.innerHTML = ""
}

function addUserToDatabase(name) {
  return fetch(`${USER_URL}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'name': name
    })
  })
}

function displaySideBooks(userId) {
  bookSidebarHTML.innerHTML = ""
  booksList.forEach(book => {
      if ( (book.user.id === userId && booksListFilter === "My Books")
            || booksListFilter === "All Books"  ) {
        bookSidebarHTML.innerHTML +=
          `<ul class="list-group">
          <li data-item="book title" data-action="${book.id}" class="list-group-item">${book.title}</li>
          </ul>
        </div>`
      }
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

    if (event.target.dataset.item === "book title") {
      booksList.forEach(function(b) {
        if (event.target.dataset.action === `${b.id}`) {
            displayMainBook(b);
        }
      })
    }

    else if (event.target.id === "login-user") {

      event.preventDefault()
      var loginField = document.getElementById("input-name")
      var loginFieldValue = loginField.value

      var user = usersList.find(n => n.name === loginFieldValue)

      if (!user) {
        addUserToDatabase(loginFieldValue).then(() => {
          fetch(USER_URL).then(r => r.json()).then(u => {
            console.log(u)
            debugger
            currentUserId = usersList[usersList.length-1].id
  //          authenticateGoogleDrive(currentUserId)
            booksListFilter = "All Books"
            displaySideBooks(adminUserId);
          })
        })
      }
      else {
        currentUserId = user.id
        booksListFilter = "My Books"
        displaySideBooks(currentUserId);
      }
    }

    else if (event.target.id === "my-books") {
      event.preventDefault()
      console.log("My Books")
      booksListFilter = "My Books"
    }

    else if (event.target.id === "all-books") {
      event.preventDefault()
      console.log("All Books")
      booksListFilter = "All Books"
    }

  })
})
