import "./SearchBar.css";
import React from "react";

// Composant du header et de la barre de recherche

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // Permet la récupération de ce qui est entré et le remonte au parent a chaque fois que celui-ci change
  handleChange(e) {
    this.props.SearchChange(e.target.value, this.props.page);
  }

  render() {
    return (
      <div className="SearchBar">
        <h1>API de recherche Google</h1>
        <input
          className="searchInput"
          type="text"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
