import "./SearchBar.css";
import React from "react";

// Composant du header et de la barre de recherche

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNbBooks = this.handleNbBooks.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  // Permet la récupération de ce qui est entré et le remonte au parent a chaque fois que celui-ci change
  handleSearch(e) {
    this.props.SearchChange(e.target.value);
  }
  handleNbBooks(e) {
    this.props.NbBooksChange(e.target.value);
  }
  handleReset() {
    const searchInput = document.querySelector(".searchInput");
    searchInput.value = "";
    this.props.ResetPage();
  }

  render() {
    return (
      <div className="SearchBar">
        <h1 className="appName button" onClick={this.handleReset}>
          API de recherche de Livres
        </h1>
        <div className="parameters">
          <div className="search">
            <input
              name="search"
              className="searchInput"
              placeholder="Recherche par auteur"
              type="text"
              onChange={this.handleSearch}
            />
          </div>
          <div className="nbBooks">
            <input
              name="nbBooks"
              className="nbBooksInput"
              type="range"
              onChange={this.handleNbBooks}
              value={this.props.nbBooks}
              step="1"
              min="1"
              max="40"
            />
            <label className="nbBooksLabel" htmlFor="nbBooks">
              Livres : {this.props.nbBooks}
            </label>
          </div>
        </div>
      </div>
    );
  }
}
