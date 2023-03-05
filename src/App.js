import "./App.css";
import React from "react";
import SearchBar from "./SearchBar";
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
      emptyString: new RegExp("^[ ]*$"), // Une expression régulière pour vérifier si la chaine est vide
      research: "", // La recherche
      data: [], // Les données
      page: 0, // La page
      nbBooks: 10, // Le nombre de livres de base
      requeteApi: undefined, // Une promesse pour la requete a l'api
    };
  }

  // Ici j'éffectue la recherche en fonction de la suite de caractere entrée,
  // dependant de la page et du nombre de livre a afficher
  // J'ai du faire passer les paramètres a chaque recherche car je n'arrive pas a le faire fonctionner
  // correctement sans ça.
  search(newSearch, newPage, newNbBooks) {
    // Si il y a une suite de caractere non vide, on effectue la recherche
    if (this.state.emptyString.test(newSearch) === false) {
      let page = newPage;
      let index = page * newNbBooks;
      // Si la recherche change par rapport a la recherche précedente, on revient à la page 0
      if (newSearch !== this.state.research) {
        page = 0;
        this.setState({ page: page });
      }
      // Je crée une promesse pour la recherche
      const newRequeteApi = new Promise((resolve, reject) => {
        let requete =
          "https://www.googleapis.com/books/v1/volumes?q=inauthor:" +
          newSearch +
          "&startIndex=" + // rajouté un - apres le = pour provoquer une erreur et la tester
          index + // index negatif provoque une erreur
          "&maxResults=" +
          newNbBooks;
        axios
          .get(requete)
          .then((r) => {
            this.setState({ requeteApi: undefined });
            this.setState({ data: r.data });
            resolve();
          })
          .catch((error) => {
            this.setState({ requeteApi: undefined });
            console.log(error);
            reject();
          });
      });
      this.setState({ requeteApi: newRequeteApi });
    } else {
      this.resetState();
    }
  }

  // Remise a zero des informations
  resetState() {
    this.setState({ research: "" });
    this.setState({ data: [] });
    this.setState({ page: 0 });
    this.setState({ requeteApi: undefined });
  }

  // Ici j'éffectue le changement de recherche
  changeSearch(newSearch) {
    this.setState({ research: newSearch });
    this.search(newSearch, this.state.page, this.state.nbBooks);
  }

  // Ici j'éffectue le changement du nombre de livres affichés
  changeNbBooks(newNbBooks) {
    const totalItems = this.state.data.totalItems;
    const page = this.state.page;
    this.setState({ nbBooks: newNbBooks });
    let correctPage = page; // La page correcte
    // Si le changement du nombre de livre fait que la page actuelle est supérieur au nombre de page
    // possible pour cette configuration, on change la page pour la dernière page possible
    // et si il on a des livres en données
    if (newNbBooks * page >= totalItems && totalItems > 0) {
      correctPage = totalItems / newNbBooks - 1;
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

  // Ici j'éffectue le chargement de la page
  render() {
    const info = this.state;
    const data = info.data;
    const nbBooks = info.nbBooks;
    const research = info.research;
    const requeteApi = info.requeteApi;

    // Les composants
    // Barre de recherche
    const searchBar = (
      <SearchBar
        nbBooks={nbBooks}
        ResetPage={this.resetState}
        SearchChange={this.changeSearch}
        NbBooksChange={this.changeNbBooks}
      />
    );
    // La zone des livres
    const bookArea = (
      <BookArea
        info={info}
        data={data}
        nbBooks={nbBooks}
        research={research}
        requeteApi={requeteApi}
        PageChange={this.changePage}
      />
    );

    // Si il y a une recherche
    if (this.state.emptyString.test(research) === false) {
      return (
        <div className="App">
          {searchBar}
          {bookArea}
        </div>
      );
    }
    // affichage de base
    return <div className="App">{searchBar}</div>;
  }
}
