import "./App.css";
import React from "react";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import BookArea from "./BookArea";
import axios from "axios";

// Composant principal

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.changePage = this.changePage.bind(this);
    this.state = {
      research: "", // La recherche
      data: [], // Les données
      page: 0, // La page
    };
  }

  // Ici j'éffectue la recherche en fonction de la suite de caractere entrée
  // et dependant de la page
  search(newSearch, newPage) {
    // Si il y a une suite de caractere, on effectue la recherche
    if (newSearch !== "") {
      let page = newPage;
      // Si la recherche a changé, on revient à la page 0
      if (newSearch !== this.state.research) {
        page = 0;
        this.setState({ page: 0 });
      }
      let requete =
        "https://www.googleapis.com/books/v1/volumes?q=inauthor:" +
        newSearch +
        "&startIndex=" +
        page * 10;
      axios
        .get(requete)
        .then((response) => {
          this.setState({ research: newSearch });
          this.setState({ data: response.data });
        })
        .catch((error) => {
          console.log("Erreur serveur" + error);
        });
    } else {
      this.setState({ data: [] });
    }
  }

  // Ici j'éffectue le changement de page
  // normalement je l'aurais fait assez simplement en reasignant la valeur de la page via sont setter
  // mais je ne comprend pas le setter n'est pris en compte qu'apres toute la fonction, donc j'ai
  // contourner en passant la page d'une autre façon.
  changePage(newPage) {
    this.setState({ page: newPage });
    this.search(this.state.research, newPage);
  }

  render() {
    const research = this.state.research;
    const data = this.state.data;
    const page = this.state.page;
    let hadData = false;
    // Si il y a des données, on le signale
    if (data.totalItems > 0) {
      hadData = true;
    }
    // Si il y a des données pour la recherche, on affiche la barre de recherche, les livres et le footer
    if (hadData) {
      return (
        <div className="App">
          <SearchBar data={data} page={page} SearchChange={this.search} />
          <BookArea data={data} research={research} />
          <Footer data={data} page={page} PageChange={this.changePage} />
        </div>
      );
    }
    // Si il y a une recherche mais pas de données, on affiche la barre de recherche et un message d'erreur
    else if (research !== "") {
      return (
        <div className="App">
          <SearchBar data={data} page={page} SearchChange={this.search} />
          <BookArea data={data} research={research} />
        </div>
      );
    }
    return (
      <div className="App">
        <SearchBar data={data} page={page} SearchChange={this.search} />
      </div>
    );
  }
}
