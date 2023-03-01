import "./SearchBar.css";
import React from "react";
import axios from "axios";

function search(e) {
  let requete =
    "https://www.googleapis.com/books/v1/volumes?q=inauthor:" + e.value;
  axios
    .get(requete)
    .then((response) => {
      //console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log("Erreur serveur" + error);
    });
}

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log(search(e.target));
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
