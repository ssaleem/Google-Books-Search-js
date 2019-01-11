const searchView = {
  init(){
    this.searchBar = document.querySelector('#search-bar');
    this.searchBtn = document.querySelector('#search-btn');

    // Search bar listeners
    this.searchBar.addEventListener('keypress', (event) => {
      (event.keyCode === 13 && event.target.value !== '') && controller.searchNRender(event.target.value);
    });

    this.searchBtn.addEventListener('click', () => {
      (searchBar.value !== '') && controller.searchNRender(searchBar.value);
    });
  }
}

const resultsData = {
  init() {
    // Object to store all unique results with key 'all' as well as results for individual searches
    this.results = {'all': []};
  },
  setResults(res, term) {
    this.results[term] = res;
    console.log(this.results[term]);
  },
  getResults(term) {
    return this.results[term];
  }
}

const resultsView = {
  init() {
    this.resultsElement =  document.querySelector('.results');
    this.resultsArea =  document.querySelector('#results-area');
  }
}

const utils = {
  getUnique(currentArray, newArray){
    // Reverse new Array before concatenation to preserve top matches
    // Reverse concatenated array before finding unique elements to delete older duplicate entries and keep recent ones
    let unique = currentArray.concat(newArray.slice(0).reverse()).reverse();
    unique = unique.filter((item, index, array) => {
      let found = array.findIndex(i => i.id === item.id);
      return found === index;
    });
    return unique.reverse();
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
  },
  // 1. Search
  // 2. Render results on success otherwise render error message
  searchNRender(term) {
    this.searchForBooks(term)
    .then(results => {
      // Check if query was valid and returned any results
      if(results.totalItems > 0){
        // Remove duplicates if any from new set of results before conctenation
        resultsData.setResults(utils.getUnique(resultsData.getResults('all'), results.items), 'all');
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
