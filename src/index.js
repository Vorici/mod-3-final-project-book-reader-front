const BOOK_URL = "http://localhost:3000/api/v1/books/"
const USER_URL = "http://localhost:3000/api/v1/users/"
const PAGE_URL = "http://localhost:3000/api/v1/pages/"
const GOOGLE_DRIVE_URL = "https://drive.google.com/uc?export=view&id="

const ADMIN_USER_NAME = 'Admin';

const mainHTML            = document.getElementById("container");
const bookSidebarHTML     = document.getElementById("sidebar");
const bookPageHTML      = document.getElementById("book-page");
let myBooksBtn;
let allBooksBtn;
let searchField;

let booksList = [];
let usersList = [];
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
displayLoginPage();

function getBooksFromApi() {
  if (booksList.length) {
    booksList.length = 0
  }
  fetch(BOOK_URL).then(r => r.json()).then(b =>
    {
      b.forEach(book => { booksList.push(book) })
    })
}

function getUsersFromApi() {
  if (usersList.length) {
    usersList.length = 0
  }
  fetch(USER_URL).then(r => r.json()).then(u =>
    {
      u.forEach(user => {
        usersList.push(user)
        if (user.name === ADMIN_USER_NAME) {
            adminUserId = user.id
        }
      })
    })
}

function displayLoginPage() {
  bookSidebarHTML.innerHTML = `<div class="w3-container">
    <h2>Book Reader</h2>
    <button onclick="document.getElementById('id01').style.display='block'" class="w3-button w3-green w3-large">Login</button>

    <div id="id01" class="w3-modal">
      <div class="w3-modal-content w3-card-4 w3-animate-zoom" style="max-width:600px">

        <div class="w3-center"><br>
          <span onclick="document.getElementById('id01').style.display='none'" class="w3-button w3-xlarge w3-hover-red w3-display-topright" title="Close Modal">&times;</span>
          <img src="https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png" alt="Avatar" style="width:30%" class="w3-circle w3-margin-top">
        </div>

          <div id="login-section" class="w3-section">
            <label><b>Name</b></label>
            <input id="input-name" class="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter Your Name" name="usrname" required>
          <button data-action="login" class="w3-btn w3-block w3-teal">Enter</button>
          </div>

        <div class="w3-container w3-border-top w3-padding-16 w3-light-grey">
          <button onclick="document.getElementById('id01').style.display='none'" type="button" class="w3-button w3-red">Cancel</button>
                <span class="w3-right w3-padding w3-hide-small">Please provide a login name. We will automatically create an account for you if you do not have one! </span>
        </div>

      </div>
    </div>
  </div>`
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
  bookSidebarHTML.innerHTML = `<h3 id="titles-count">Titles (${titlesCount} listed)</h3>
  <fieldset>
      <label>Select Book List</label>

      <div>
          <input type="radio" id="all-books" name="books-filter" />
          <label for="all-books">All Books</label>
      </div>

      <div>
          <input type="radio" id="my-books" name="books-filter" />
          <label for="my-books">My Books</label>
      </div>

  </fieldset>`
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

  myBooksBtn = document.getElementById("my-books");
  allBooksBtn = document.getElementById("all-books");
  searchField = document.getElementById("search-field")

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

function displayNoPagesFound() {
  bookPageHTML.innerHTML = `<h3>Sorry, there are no paqes for that title</h3>`
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

/*
*******EVENT LOGIC**************************
*/

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', function(event) {

    if (event.target.dataset.item === "book title") {
      currentBookId = parseInt(event.target.dataset.id)
      currentBook = booksList.find(book => (book.id === currentBookId))
      if (currentBook.api_image_count) {
        getPagesFromApi(currentBookId)
      }
      else {
        displayNoPagesFound()
      }
    }

    else if (event.target.dataset.action === "login") {

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

      searchField.innerHTML = `
          <label>Search</label>
          <input id="input-search" type="text"></input>
          `
      searchField.addEventListener('keyup', event => {
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

    else if (event.target.dataset.action === 'drop-book') {
      // need to persist this
      currentBook.user.id = adminUserId
      updateBookUser(currentBook.user.id)
    }

    else if (event.target.dataset.action === 'add-book') {
      // need to persist this
      currentBook.user.id = currentUserId
      updateBookUser(currentBook.user.id)
    }

  })
})

function updateBookUser(userId) {

  const detailURL = BOOK_URL + '/' + currentBookId

  configObj = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({user_id: userId })
  }

  fetch(detailURL, configObj).then(r => r.json()).then(patchResult => {
    console.log(patchResult)
  })
}
