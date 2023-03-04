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
    this.changeSearch = this.changeSearch.bind(this);
    this.changeNbBooks = this.changeNbBooks.bind(this);
    this.changePage = this.changePage.bind(this);
    this.resetState = this.resetState.bind(this);
    this.state = {
      research: "", // La recherche
      data: [], // Les données
      page: 0, // La page
      nbBooks: 10, // Le nombre de livres de base
      emptyString: new RegExp("^[ ]*$"), // Une expression régulière pour vérifier si la chaine est vide
      searchPromise: undefined, // Une promesse pour la recherche
      errorCheck: false,
    };
  }

  // Ici j'éffectue la recherche en fonction de la suite de caractere entrée,
  // dependant de la page et du nombre de livre a afficher
  // J'ai du faire passer les paramètres a chaque recherche car je n'arrive pas a le faire fonctionner
  // correctement sans ça.
  search(newSearch, newPage, newNbBooks) {
    // Si il y a une suite de caractere, on effectue la recherche
    if (this.state.emptyString.test(newSearch) === false) {
      let page = newPage;
      // Si la recherche change par rapport a la recherche précedente, on revient à la page 0
      if (newSearch !== this.state.research) {
        page = 0;
        this.setState({ page: page });
      }
      // Je crée une promesse pour la recherche
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
            this.setState({ errorCheck: false });
            this.setState({ data: response.data });
            resolve();
          })
          .catch((error) => {
            // Si il y a une erreur, on vide les données
            // et on affiche un message d'erreur
            // (J'ai essayer de recuperer l'erreur via le .catch dans le bookArea avec le props searchPromise
            // mais react ce reactualisait une fois de trop n'affichait pas ce que je voulais
            // j'ai donc "stabilisé" le fait qu'il y ait une erreur en la mettant en state et
            // en la passant en props dans le bookArea)
            this.setState({ errorCheck: true });
            this.resetState();
            console.log(error);
          });
      });
      this.setState({ searchPromise: newSearchPromise });
    } else {
      // Si il y a une promesse en cours, on attend qu'elle soit terminée puis on vide les données
      if (this.state.searchPromise !== undefined) {
        this.state.searchPromise.then(() => {
          this.resetState();
        });
      } else {
        // Si il n'y a pas de promesse en cours et que la recherche est vide on vide les données
        this.resetState();
      }
    }
  }

  // Ici j'éffectue le reset des données
  resetState() {
    this.setState({ research: "" });
    this.setState({ data: [] });
    this.setState({ page: 0 });
  }

  // Ici j'éffectue le changement de recherche
  changeSearch(newSearch) {
    this.setState({ research: newSearch });
    this.search(newSearch, this.state.page, this.state.nbBooks);
  }

  // Ici j'éffectue le changement du nombre de livres affichés
  changeNbBooks(newNbBooks) {
    this.setState({ nbBooks: newNbBooks });
    let correctPage = this.state.page; // La page correcte
    // Si le changement du nombre de livre fait que la page actuelle est supérieur au nombre de page
    // possible pour cette configuration, on change la page pour la dernière page possible
    if (newNbBooks * this.state.page >= this.state.data.totalItems) {
      correctPage = this.state.data.totalItems / newNbBooks - 1;
      correctPage = Math.ceil(correctPage); // On arrondi au supérieur
      this.setState({ page: correctPage });
    }
    this.search(this.state.research, correctPage, newNbBooks);
  }

  // Ici j'éffectue le changement de page
  changePage(newPage) {
    this.setState({ page: newPage });
    this.search(this.state.research, newPage, this.state.nbBooks);
  }

  render() {
    const data = this.state.data;
    const research = this.state.research;
    const page = this.state.page;
    const nbBooks = this.state.nbBooks;
    const errorCheck = this.state.errorCheck;

    // Les composants
    // Barre de recherche
    const searchBar = (
      <SearchBar
        nbBooks={nbBooks}
        SearchChange={this.changeSearch}
        NbBooksChange={this.changeNbBooks}
      />
    );
    // Les livres ou les messages d'erreur
    const bookArea = (
      <BookArea
        data={data}
        research={research}
        errorCheck={errorCheck}
        nbBooks={nbBooks}
      />
    );
    // Footer avec la pagination
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
      if (data.totalItems > 0 && nbBooks > 0 && nbBooks < 41) {
        return (
          <div className="App">
            {searchBar}
            {bookArea}
            {footer}
          </div>
        );
      }
      // Si il y a une recherche mais pas de données, on affiche la barre de recherche et un message d'erreur
      else if (data.totalItems <= 0) {
        return (
          <div className="App">
            {searchBar}
            {bookArea}
          </div>
        );
      }
    }
    // affichage de base
    return <div className="App">{searchBar}</div>;
  }
}
