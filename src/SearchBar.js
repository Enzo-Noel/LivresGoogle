import "./SearchBar.css";
import React from "react";

// Composant du header et de la barre de recherche

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNbBooks = this.handleNbBooks.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.setNbBooks = this.setNbBooks.bind(this);
    this.state = {
      nbBooks: 10,
    };
  }

  // Permet la récupération des paramètres de recherche et les envoie au composant parent (App.js)
  handleSearch(e) {
    this.props.SearchChange(e.target.value);
  }
  handleNbBooks() {
    this.props.NbBooksChange(this.state.nbBooks);
  }
  setNbBooks(e) {
    this.setState({ nbBooks: e.target.value });
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
            <label className="nbBooksLabel" htmlFor="nbBooks">
              Livres par pages : {this.state.nbBooks}
            </label>
            <input
              name="nbBooks"
              className="nbBooksInput"
              type="range"
              onPointerUp={this.handleNbBooks}
              onChange={this.setNbBooks}
              value={this.state.nbBooks}
              step="1"
              min="1"
              max="40"
            />
          </div>
        </div>
      </div>
    );
  }
}
