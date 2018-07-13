const BOOK_URL          = "http://localhost:3000/api/v1/books/"
const USER_URL          = "http://localhost:3000/api/v1/users/"
const PAGE_URL          = "http://localhost:3000/api/v1/pages/"
const GOOGLE_DRIVE_URL  = "https://drive.google.com/uc?export=view&id="

const ADMIN_USER_NAME   = 'Admin';

const pagesList = [];
const mainHTML          = document.getElementById("container");
const bookSidebarHTML   = document.getElementById("sidebar");
const bookPageHTML      = document.getElementById("book-page");

let myBooksBtn;
let allBooksBtn;
let searchField;

let booksList;
let usersList;
let adminUserId;
let currentUserId;
let booksListFilter;

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
  bookSidebarHTML.innerHTML = `<div class="w3-container">
    <h2>Book Reader</h2>
    <button onclick="document.getElementById('modal').style.display='block'" class="w3-button w3-green w3-large">Login</button>

    <div id="modal" class="w3-modal">
      <div class="w3-modal-content w3-card-4 w3-animate-zoom" style="max-width:600px">

        <div class="w3-center"><br>
          <span onclick="document.getElementById('modal').style.display='none'" class="w3-button w3-xlarge w3-hover-red w3-display-topright" title="Close Modal">&times;</span>
          <img src="https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png" alt="Avatar" style="width:30%" class="w3-circle w3-margin-top">
        </div>

          <div id="login-section" class="w3-section">
            <label><b>Name</b></label>
            <input id="input-name" class="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter Your Name" name="usrname" required>
          <button data-action="login" class="w3-btn w3-block w3-teal">Enter</button>
          </div>

        <div class="w3-container w3-border-top w3-padding-16 w3-light-grey">
          <button onclick="document.getElementById('modal').style.display='none'" type="button" class="w3-button w3-red">Cancel</button>
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
  bookSidebarHTML.innerHTML = `</br><h3 id="titles-count">Titles (${titlesCount} listed)</h3>

      <label>Select Book List</label>

      <div>
          <input class="ui toggle checkbox" type="radio" id="all-books" name="books-filter" />
          <label for="all-books">All Books</label>
      </div>

      <div>
          <input class="ui toggle checkbox" type="radio" id="my-books" name="books-filter" />
          <label for="my-books">My Books</label>
      </div></br>`

  booksList.forEach(book => {
    if ( (book.user.id === userId && booksListFilter === "My Books")
          || booksListFilter === "All Books"  ) {
      if (booksListSearchValue) {
        let titleUpperCase = book.title.toUpperCase()
        if (titleUpperCase.includes(booksListSearchValue.toUpperCase())) {
          titlesCount++
          bookSidebarHTML.innerHTML +=
          `<div class="item">
             <div data-item="book title" data-id="${book.id}"class="header">${book.title}</div>
               ${book.authors}
          </div>`
        }
      }
      else {
        titlesCount++
        bookSidebarHTML.innerHTML +=
           `<div class="item">
              <div data-item="book title" data-id="${book.id}"class="header">${book.title}</div>
                ${book.authors}
           </div>`
      }
    }
  })
  const titlesCountElement     = document.getElementById("titles-count")
  titlesCountElement.innerText = `Titles (${titlesCount} listed)`

  myBooksBtn   = document.getElementById("my-books");
  allBooksBtn  = document.getElementById("all-books");
  searchField  = document.getElementById("search-field")
}
function persistBody(){
  return document.body.innerHTML =  `<body>
    <div class="container">
    <div class="ui icon input"id="search-field">
      <!-- <label>User</label>
      <input id="input-name" type="text"></input>
      <button data-action="login" id="login-user">Login</button> -->
      <i class="inverted circular search link icon"></i>
    </div>


    <div class='row'>

      <div id="sidebardiv" class='col-md-4'>
        <div id="sidebar" class='ui selected list'>

        </div>

      </div>

      <div class='col-md-7'>
        <div id="book-page">
        </div>
      </div>
    </div>
  </div>
      <script src="src/index.js" charset="utf-8"></script>
  </body>`
}
function displayPage() {
  // bookPageHTML.innerHTML = `
  //   <button data-action="first">First</button>
  //   <button data-action="last">Last</button>`

    if (currentBook.user.id === currentUserId) {
      bookPageHTML.innerHTML = `
      <div data-action="drop-book" class="ui top attached button" tabindex="0">Remove Book</div>
        <div class="ui attached segment">
        <button data-action="previous" class="ui left attached button">Previous</button>
          <img src="${ GOOGLE_DRIVE_URL + pagesList[currentPageIndex].file_id }">
        <button data-action="next" class="right attached ui button">Next</button>
        </div>
    `
    }




    else {
      // bookPageHTML.innerHTML += `<button data-action="add-book">Add to My Books</button>`
      bookPageHTML.innerHTML = `


      <div data-action="add-book" class="ui top attached button" tabindex="0">Add Book</div>
        <div class="ui attached segment">
        <button data-action="previous" class="ui left attached button">Previous</button>
          <img src="${ GOOGLE_DRIVE_URL + pagesList[currentPageIndex].file_id }">
        <button data-action="next" class="right attached ui button">Next</button>
        </div>

      `


    }

    // bookPageHTML.innerHTML += `<button data-action="previous" class="ui left attached button">Previous</button>
    //   <img src="${ GOOGLE_DRIVE_URL + pagesList[currentPageIndex].file_id }">
    //   <button data-action="next" class="right attached ui button">Next</button>`

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
      getPagesFromApi(currentBookId)
      // booksList.forEach(function(b) {
      //   if (event.target.dataset.action === `${b.id}`) {
      //       getPagesFromApi(b.id);
      //   }
      // })
    }

    else if (event.target.dataset.action === "login") {

      event.preventDefault()

      let loginField = document.getElementById("input-name")
      let loginFieldValue = loginField.value

      let user = usersList.find(n => n.name === loginFieldValue)

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
          <input id="input-search" type="text" placeholder="Search..."></input>
          <i class="inverted circular search link icon"></i>
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

  })

})
