const searchView = {
  init(){
    this.searchBar = document.querySelector('#search-bar');
    this.searchBtn = document.querySelector('#search-btn');

    // Search bar listeners
    this.searchBar.addEventListener('keypress', (event) => {
      (event.keyCode === 13 && event.target.value !== '') && controller.searchNRender(event.target.value);
    });

    this.searchBtn.addEventListener('click', () => {
      (this.searchBar.value !== '') && controller.searchNRender(this.searchBar.value);
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
},
  // Renders an error message
  // Previous results are retained in results area while error message is rendered on the top
  // Commented out code is compatible with the implementation as well, although it clears any previous search results
  showError(msg) {
    // const html = `<li><p class="error">${msg}</p></li>`;
    // document.querySelector('#results').innerHTML = html;
    const newError = document.createElement('p');
    newError.className = 'error';
    newError.innerHTML = msg;
    this.resultsArea.insertBefore(newError, this.resultsArea.children[1]);
  },
  clearError() {
    this.resultsArea.removeChild(document.querySelector('.error'));
  }

}

const backToTop = {
  init() {
    this.toTopBtn = document.querySelector('#to-top');
    this.toTopBtn.addEventListener('click', () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
    window.onscroll = () => this.scrollCheck();
  },
  scrollCheck() {
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
      this.toTopBtn.style.display = "block";
    }
    else {
      this.toTopBtn.style.display = "none";
    }
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
  },
  sortRating(list) {
    return list.sort((a,b) => {
      // Set any undefined ratings to 0
      (!a.volumeInfo.averageRating) && (a.volumeInfo.averageRating = 0);
      (!b.volumeInfo.averageRating) && (b.volumeInfo.averageRating = 0);
      // Scale values for integer comparison
      return (b.volumeInfo.averageRating * 10 - a.volumeInfo.averageRating * 10);
    });
  },
  sortTitle(list) {
    return list.sort((a,b) => (a.volumeInfo.title > b.volumeInfo.title) ? 1 : ((b.volumeInfo.title > a.volumeInfo.title) ? -1 : 0));
  }
}

const controller = {
  init() {
    this.showingError = false;
    searchView.init();
    resultsView.init();
    resultsData.init();
    backToTop.init();
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
        // Remove any previous error message
        this.showingError && this.clearError();
        // Render all results
        resultsView.render(resultsData.getResults('all'));
      }
      else {
        throw new Error(`No matching results found for ${term}`);
      }
    })
    .catch(e => this.handleError(e));
  },
  handleError(e) {
    resultsView.showError(e);
    this.showingError = true;
  },
  clearError() {
    resultsView.clearError();
    this.showingError = false;
  }
}

controller.init();


