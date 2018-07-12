const BOOK_URL = "http://localhost:3000/api/v1/books/"
const USER_URL = "http://localhost:3000/api/v1/users/"
const PAGE_URL = "http://localhost:3000/api/v1/pages/"
const GOOGLE_DRIVE_URL = "https://drive.google.com/uc?export=view&id="

const ADMIN_USER_NAME = 'Admin';

const mainHTML            = document.getElementById("container");
const bookSidebarHTML     = document.getElementById("sidebar");
const bookPageHTML      = document.getElementById("book-page");
const myBooksBtn          = document.getElementById("my-books");
const allBooksBtn          = document.getElementById("all-books");
const loginSearchFields = document.getElementById("login-search-fields")

var booksList;
var usersList;
var adminUserId;
var currentUserId;
var booksListFilter;
const pagesList = [];
let currentPageIndex;
let booksListSearchValue;
let titlesCount;
let currentBookId;
let currentBook;

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
  titlesCount = 0
  bookSidebarHTML.innerHTML = `<h3 id="titles-count">Titles (${titlesCount} listed)</h3>`
  booksList.forEach(book => {
    if ( (book.user.id === userId && booksListFilter === "My Books")
          || booksListFilter === "All Books"  ) {
      if (booksListSearchValue) {
        let titleUpperCase = book.title.toUpperCase()
        if (titleUpperCase.includes(booksListSearchValue.toUpperCase())) {
          titlesCount++
          bookSidebarHTML.innerHTML +=
            `<ul class="list-group">
            <li data-item="book title" data-id="${book.id}" class="list-group-item">${book.title}</li>
            </ul>
          </div>`
        }
      }
      else {
        titlesCount++
        bookSidebarHTML.innerHTML +=
          `<ul class="list-group">
          <li data-item="book title" data-id="${book.id}" class="list-group-item">${book.title}</li>
          </ul>
        </div>`
      }
    }
  })
  const titlesCountElement = document.getElementById("titles-count")
  titlesCountElement.innerText = `Titles (${titlesCount} listed)`

}

function displayPage() {
  bookPageHTML.innerHTML = `
    <button data-action="first">First</button>
    <button data-action="previous">Previous</button>
    <button data-action="next">Next</button>
    <button data-action="last">Last</button>`

    if (currentBook.user.id === currentUserId) {
        bookPageHTML.innerHTML += `<button data-action="drop-book">Remove from My Books</button>`
    }
    else {
      bookPageHTML.innerHTML += `<button data-action="add-book">Add to My Books</button>`
    }

    bookPageHTML.innerHTML += `<br><img src="${ GOOGLE_DRIVE_URL + pagesList[currentPageIndex].file_id }">`

}

function getPagesFromApi(book_id) {
  fetch(BOOK_URL + book_id).then(r => r.json()).then(p => {
    if (pagesList.length) {
      pagesList.length = 0
    }
    p.forEach(page => {
      pagesList.push(page)
    })
    currentPageIndex = 0
    displayPage()
  })
}


document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', function(event) {

    if (event.target.dataset.item === "book title") {
      currentBookId = parseInt(event.target.dataset.id)
      currentBook = booksList.find(book => (book.id === currentBookId))
      getPagesFromApi(currentBookId)
      // booksList.forEach(function(b) {
      //   if (event.target.dataset.action === `${b.id}`) {
      //       getPagesFromApi(b.id);
      //   }
      // })
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
            currentUserId = usersList[usersList.length-1].id
            fetch(USER_URL)
              booksListFilter = "All Books"
              displaySideBooks(adminUserId);
              myBooksBtn.checked = false;
              allBooksBtn.checked = true;

          })
        })
      }
      else {
        currentUserId = user.id
        booksListFilter = "My Books"
        displaySideBooks(currentUserId);
        myBooksBtn.checked = true;
        allBooksBtn.checked = false;

      }

      loginSearchFields.innerHTML = `
          <label>Search</label>
          <input id="input-search" type="text"></input>
          `
      loginSearchFields.addEventListener('keyup', event => {
        if (event.target.id === "input-search") {
          booksListSearchValue = document.getElementById("input-search").value
          displaySideBooks(currentUserId);
        }
      })

    }

    else if (event.target.id === "my-books") {
      booksListFilter = "My Books"
      displaySideBooks(currentUserId);
      myBooksBtn.checked = true;
      allBooksBtn.checked = false;
    }

    else if (event.target.id === "all-books") {
      booksListFilter = "All Books"
      displaySideBooks(currentUserId);
      myBooksBtn.checked = false;
      allBooksBtn.checked = true;
    }

    else if (event.target.dataset.action === 'first') {
      currentPageIndex = 0
      displayPage()
    }

    else if (event.target.dataset.action === 'next') {
      if (currentPageIndex < pagesList.length - 1) {
        ++currentPageIndex
        displayPage()
      }
    }

    else if (event.target.dataset.action === 'previous') {
      if (currentPageIndex) {
        --currentPageIndex
        displayPage()
      }
    }

    else if (event.target.dataset.action === 'last') {
      currentPageIndex = pagesList.length - 1
      displayPage()
    }

  })

})
