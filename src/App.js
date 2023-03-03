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
    this.changeNbBooks = this.changeNbBooks.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      research: "", // La recherche
      data: [], // Les données
      page: 0, // La page
      nbBooks: 10, // Le nombre de livres de base
      emptyString: new RegExp("^[ ]*$"), // Une expression régulière pour vérifier si la chaine est vide
      searchPromise: undefined, // Une promesse pour la recherche
      error: false,
    };
  }

  // Ici j'éffectue la recherche en fonction de la suite de caractere entrée
  // et dependant de la page
  search(newSearch, newPage, newNbBooks) {
    // Si il y a une suite de caractere, on effectue la recherche
    if (this.state.emptyString.test(newSearch) === false) {
      let page = newPage;
      // Si la recherche a changé, on revient à la page 0
      if (newSearch !== this.state.research) {
        page = 0;
        this.setState({ page: page });
      }
      const newSearchPromise = new Promise((resolve) => {
        let requete =
          "https://www.googleapis.com/books/v1/volumes?q=inauthor:" +
          newSearch +
          "&startIndex=" +
          page * newNbBooks +
          "&maxResults=" +
          newNbBooks;
        axios
          .get(requete)
          .then((response) => {
            resolve();
            this.setState({ data: response.data });
            this.setState({ research: newSearch });
          })
          .catch((error) => {
            this.setState({ error: true });
            this.reset(newSearch);
            console.log(error);
          });
      });
      this.setState({ searchPromise: newSearchPromise });
    } else {
      // Si il y a une promesse en cours, on attend qu'elle soit terminée puis on vide les données
      if (this.state.searchPromise !== undefined) {
        this.state.searchPromise.then(() => {
          this.reset(newSearch);
          this.setState({ searchPromise: undefined });
        });
      } else {
        // Sinon on vide les données
        this.reset(newSearch);
      }
    }
  }

  reset(search) {
    this.setState({ research: search });
    this.setState({ data: [] });
  }

  changeNbBooks(newNbBooks) {
    this.setState({ nbBooks: newNbBooks });
    let correctPage = this.state.page;
    if (newNbBooks * this.state.page >= this.state.data.totalItems) {
      correctPage = this.state.data.totalItems / newNbBooks - 1;
      correctPage = Math.ceil(correctPage);
      this.setState({ page: correctPage });
    }
    this.search(this.state.research, correctPage, newNbBooks);
  }

  // Ici j'éffectue le changement de page
  // normalement je l'aurais fait assez simplement en reasignant la valeur de la page via sont setter
  // mais je ne comprend pas le setter n'est pris en compte qu'apres toute la fonction, donc j'ai
  // contourner en passant la page d'une autre façon.
  changePage(newPage) {
    this.setState({ page: newPage });
    this.search(this.state.research, newPage, this.state.nbBooks);
  }

  render() {
    const research = this.state.research;
    const data = this.state.data;
    const page = this.state.page;
    const nbBooks = this.state.nbBooks;
    const searchPromise = this.state.searchPromise;
    const error = this.state.error;

    let hadData = false;
    // Si il y a des données, on le signale
    if (data.totalItems > 0) {
      hadData = true;
    }

    const searchBar = (
      <SearchBar
        data={data}
        page={page}
        nbBooks={nbBooks}
        SearchChange={this.search}
        NbBooksChange={this.changeNbBooks}
      />
    );
    const bookArea = (
      <BookArea
        data={data}
        research={research}
        searchPromise={searchPromise}
        error={error}
        nbBooks={nbBooks}
      />
    );
    const footer = (
      <Footer
        data={data}
        page={page}
        nbBooks={nbBooks}
        PageChange={this.changePage}
      />
    );
    // Si il y a des données pour la recherche, on affiche la barre de recherche, les livres et le footer
    if (this.state.emptyString.test(research) === false) {
      if (hadData && nbBooks > 0 && nbBooks < 41) {
        return (
          <div className="App">
            {searchBar}
            {bookArea}
            {footer}
          </div>
        );
      }
      // Si il y a une recherche mais pas de données, on affiche la barre de recherche et un message d'erreur
      else if (!hadData) {
        return (
          <div className="App">
            {searchBar}
            {bookArea}
          </div>
        );
      }
    }
    return <div className="App">{searchBar}</div>;
  }
}
