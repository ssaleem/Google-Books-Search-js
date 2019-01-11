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
  },
  render(listToRender) {

  // Create a fragment and append 'li' elements containing book entries to fragment to prevent frequent updates on DOM
  let fragment = document.createDocumentFragment();

  // Generate html for each book entry and append to fragment
  listToRender.forEach(item => {
    let bookData = item.volumeInfo;
    const bookItem = document.createElement('li');
    bookItem.className = 'book-item';
    // Generate html for book cover
    let cover = '';
    if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
      const img = `<img class="thumbimg" src=${bookData.imageLinks.thumbnail} alt=${`${bookData.title} book image`}>`;
      const link = `<a class="preview" title="Preview Link" href=${bookData.previewLink} target="_blank"><i class="fas fa-eye"></i></a>`;
      cover = `<div class="image-div">
                    ${img}
                    ${link}
                    </div>`;
    }
    else {
      cover = `<div class="image-div backup">
                  <p class="cover-backup">Cover Image Unavailable</p>
                </div>`
    }
    // Generate html for title, subtitle, and authors
    const title = `<a class="title ellipsis" href=${bookData.previewLink} title="${bookData.title}" target="_blank">${bookData.title}</a>`;
    let subtitleProp = bookData.subtitle ? bookData.subtitle : ' ';
    const subtitle = `<p class="subtitle ellipsis" title="${subtitleProp}">${subtitleProp}</p>`
    let authorsProp = bookData.authors ? bookData.authors.join(', ') : '';
    const authors = `<p class="author ellipsis" title="${authorsProp}">${authorsProp}</p>`
    // Add book data to book entry
    bookItem.innerHTML = `${cover}
                          ${title}
                          ${subtitle}
                          ${authors}`;
    fragment.append(bookItem);

  });
  this.resultsElement.innerHTML = '';
  this.resultsElement.appendChild(fragment);
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
  // 2. Update results
  // 3. Render results on success otherwise render error message
  searchNRender(term) {
    this.searchForBooks(term)
    .then(results => {
      // Check if query was valid and returned any results
      if(results.totalItems > 0){
        // Remove duplicates if any from new set of results before conctenation
        resultsData.setResults(utils.getUnique(resultsData.getResults('all'), results.items), 'all');

        // Render all results
        resultsView.render(resultsData.getResults('all'));
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

