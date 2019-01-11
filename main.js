const searchView = {
  init(){
    this.searchBar = document.querySelector('#search-bar');
    this.searchBtn = document.querySelector('#search-btn');

    // Search bar listeners
    this.searchBar.addEventListener('keypress', (event) => {
      (event.keyCode === 13 && event.target.value !== '') && controller.searchForBooks(event.target.value);
    });

    this.searchBtn.addEventListener('click', () => {
      (searchBar.value !== '') && controller.searchForBooks(searchBar.value);
    });
  }
}

const resultsData = {
  init() {
    // Object to store all unique results with key 'all' as well as results for individual searches
    this.allResults = {'all': []};
  }
}

const resultsView = {
  init() {
    this.resultsElement =  document.querySelector('.results');
    this.resultsArea =  document.querySelector('#results-area');
  }
}

const controller = {
  init() {
    searchView.init();
    resultsView.init();
    resultsData.init();
  },
  // Searches for books and returns a promise that resolves a JSON list
  searchForBooks(term) {
    const GBOOKs_API_KEY = 'AIzaSyCZ2yqlOHMVHhoistTvvHWP542UlgmvJrU';
    const gBooksApiURL = `https://www.googleapis.com/books/v1/volumes?key=${GBOOKs_API_KEY}&q=`;
    return fetch(`${gBooksApiURL}${term}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        throw new Error('Sorry something went wrong with Google Books API');
      }
    });
  }
}

controller.init();

// Renders an error message
function showError(msg) {
  const html = `<li><p class="error">${msg}</p></li>`;
  document.querySelector('#results').innerHTML = html;
}



// Generate HTML and sets #results's contents to it
function render() {
  // TODO
}
