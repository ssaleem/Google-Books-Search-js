# Google Books Search Engine

A book search application with following features
- Allows the user to type in a query and display a list of books matching that query.
- Each item in the list includes the book's author, title, and publishing company, as well as an image of the book cover.
- From each list item, the user can navigate to more information about the book and its preview available through external links.
- From a dropdown menu, user can sort the list based on title and rating.

## Features
### Dropdown controls
Following custom dropdown controls are added to match page theme.
- Sort by: sort currently rendered results based on title, rating or top matches.
- Quick Access: since new results are prepended to current set of results in results area, a drop down list is provided to access individual results. List is dynamically expanded and is limited to 5 most recent queries.

ARIA attributes are added to custom dropdowns for accessibility.

### Error Message Display
Upon API response error or invalid queries, instead of clearing the result area, error message is displayed on top of current results. Error message is cleared automatically on any subsequent user interaction (new search, dropdown menu selection).

## Built with
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - A JavaScript interface for asynchronously fetching resources.
- [CSS Flexbox](https://www.w3schools.com/css/css3_flexbox.asp) - CSS layout module to design flexible responsive layout structure without using float or positioning.
- [CSS Media Queries](https://www.w3schools.com/css/css3_mediaqueries.asp) - A popular technique to deliver a tailored style sheet to desktops, laptops, tablets, and mobile phones by defining different style rules for different media types.
- [Gulp](https://www.npmjs.com/package/gulp) - browser-sync, gulp-sass, gulp-cssnano.

