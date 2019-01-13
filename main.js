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
    // Array to store all unique results
    this.allResults = []
    // Object to store results for individual searches
    this.results = {};
  },
  setResults(res, term=null) {
    if(!term) {
      this.allResults = res;
    }
    else {
       this.results[term] = res;
    }
   // console.log(res);
  },
  getResults(term=null) {
    if(!term){
      return this.allResults;
    }
    return this.results[term];
  }
}

const resultsView = {
  init() {
    this.resultsElement =  document.querySelector('.results');
    this.resultsArea =  document.querySelector('#results-area');
  },
  render(list) {

  // Create a fragment and append 'li' elements containing book entries to fragment to prevent frequent updates on DOM
  let fragment = document.createDocumentFragment();

  // Generate html for each book entry and append to fragment
  list.forEach(item => {
    let bookData = item.volumeInfo;
    const bookItem = document.createElement('li');
    bookItem.className = 'book-item';
    // Generate html for book cover
    let cover = '';
    if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
      const img = `<a title="Preview Link" href=${bookData.previewLink} target="_blank"><img class="thumbimg" src=${bookData.imageLinks.thumbnail} alt=${`${bookData.title} book image`}></a>`;
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

const resultsControlsView = {
  init() {
    this.resultsCount = document.querySelector('#results-count');
    this.sortOptionList = document.querySelector('.sort-list');
    this.sortTopMatches = document.querySelector('.top-matches');
    this.quickAccList = document.querySelector('.quick-access-list');
    this.quickAccAll = document.querySelector('.quick-access-all');

    this.sortOptionList.addEventListener('click', (event) => {
      if(event.target.matches('.dropdown-item')){
        // Update selected item
        this.sortOptionList.querySelector('.selected').setAttribute("aria-selected", "false");
        this.sortOptionList.querySelector('.selected').classList.remove('selected');
        event.target.setAttribute("aria-selected", "true");
        event.target.classList.add('selected');
        // render sorted list
        controller.handleSortSelect(event.target.innerText);
      }
    });

    this.quickAccAll.addEventListener('click', (event) => {
      this.setQuickAccAll();

    });
  },
  showResultCount(count, term) {
    this.resultsCount.innerHTML = `showing ${count} results for <span>${term}</span>`;
  },
  // quick access list dynamically expands
  addQuickAccItem(term) {
    // Limit quick access list to 5 recent items and an 'All Results' option(children[5])
    this.quickAccList.children.length === 6  && this.quickAccList.removeChild(this.quickAccList.children[4]);
    const quickAccessItem = document.createElement('li');
    quickAccessItem.innerHTML = `"${term}"`;
    quickAccessItem.title = term;
    quickAccessItem.role = 'option';
    quickAccessItem.className = 'dropdown-item ellipsis';
    quickAccessItem.addEventListener('click', (event) => {
      this.quickAccList.querySelector('.selected').setAttribute("aria-selected", "false");
      this.quickAccList.querySelector('.selected').classList.remove('selected');
      event.target.setAttribute("aria-selected", "true");
      event.target.classList.add('selected');
      // render quick access selection
      controller.handleQuickAccSelect(event.target.title);
    });
    this.quickAccList.insertBefore(quickAccessItem, this.quickAccList.childNodes[0]);
  },
  setQuickAccAll() {
    this.quickAccList.querySelector('.selected').setAttribute("aria-selected", "false");
    this.quickAccList.querySelector('.selected').classList.remove('selected');
    this.quickAccAll.setAttribute("aria-selected", "true");
    this.quickAccAll.classList.add('selected');
    controller.handleQuickAccSelect(null);
  },
  setSortTopMatches() {
      this.sortOptionList.querySelector('.selected').setAttribute("aria-selected", "false");
      this.sortOptionList.querySelector('.selected').classList.remove('selected');
      this.sortTopMatches.setAttribute("aria-selected", "true");
      this.sortTopMatches.classList.add('selected');
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
    resultsData.init();
    searchView.init();
    resultsView.init();
    resultsControlsView.init();
    backToTop.init();
    // App state
    this.showingError = false;
    this.currentSortSelection = 'Top Matches';
    this.currQuickAccSelection = null;   // show all results by default
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
  // 2. Update results data
  // 3. Render results on success otherwise render error message
  searchNRender(term) {
    term = term.trim();
    this.searchForBooks(term)
    .then(results => {
      // Check if query was valid and returned any results
      if(results.totalItems > 0){
        // Store unique results
        resultsData.setResults(utils.getUnique(resultsData.getResults(), results.items));
        // Store individual query results to access from quick access list, no duplicate queries in quick access list
        !resultsData.getResults(term) && resultsControlsView.addQuickAccItem(term);
        resultsData.setResults(results.items, term);
        // Remove any previous error message
        this.clearError();
        // Reset quick access to 'All Results' and render
        resultsControlsView.setQuickAccAll();
      }
      else {
        throw new Error(`No matching results found for "${term}"`);
      }
    })
    .catch(e => this.handleError(e));
  },
  handleSortSelect(selected) {
    this.currentSortSelection = selected;
    this.clearError();
    resultsView.render(this.sortList(resultsData.getResults(this.currQuickAccSelection).slice(0)));
  },
  sortList(list) {
   //default state is no sort, most recent first if all results are displayed
    if(this.currentSortSelection === 'Top Matches' && this.currQuickAccSelection === null) {
      list = list.reverse();
    }
    else if(this.currentSortSelection === 'Title - A to Z') {
      list = utils.sortTitle(list);
    }
    else if(this.currentSortSelection === 'Title - Z to A') {
      list = utils.sortTitle(list).reverse();
    }
    else if(this.currentSortSelection === 'Highly Rated') {
      list = utils.sortRating(list);
    }
    return list;
  },
  handleQuickAccSelect(selected) {
    this.currQuickAccSelection = selected;
    // Reset sort selection to 'Top Matches' on new rendering
    this.currentSortSelection = 'Top Matches';
    resultsControlsView.setSortTopMatches();
    let listToRender = this.sortList((resultsData.getResults(this.currQuickAccSelection)).slice(0));
    let searchTerm = selected || 'all searches';
    this.clearError();
    resultsControlsView.showResultCount(listToRender.length, searchTerm);
    resultsView.render(listToRender);
  },
  handleError(e) {
    this.clearError();
    resultsView.showError(e);
    this.showingError = true;
  },
  clearError() {
    this.showingError && resultsView.clearError();
    this.showingError = false;
  }
}

controller.init();


