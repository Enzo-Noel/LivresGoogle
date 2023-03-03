import "./SearchBar.css";
import React from "react";

// Composant du header et de la barre de recherche

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNbBooks = this.handleNbBooks.bind(this);
  }

  // Permet la récupération de ce qui est entré et le remonte au parent a chaque fois que celui-ci change
  handleSearch(e) {
    this.props.SearchChange(
      e.target.value,
      this.props.page,
      this.props.nbBooks
    );
  }

  handleNbBooks(e) {
    this.props.NbBooksChange(e.target.value);
  }

  render() {
    return (
      <div className="SearchBar">
        <h1>API de recherche Google</h1>
        <div>
          <label htmlFor="search">Recherche par auteur</label>
          <input
            name="search"
            className="searchInput"
            type="text"
            onChange={this.handleSearch}
          />
          <input
            name="nbSearch"
            className="nbBooksInput"
            type="number"
            onChange={this.handleNbBooks}
            value={this.props.nbBooks}
            step="1"
            min="1"
            max="40"
          />
          <label htmlFor="nbSearch">Nombre de livres</label>
        </div>
      </div>
    );
  }
}
