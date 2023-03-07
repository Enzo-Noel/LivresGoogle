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
    this.reload = this.reload.bind(this);
    this.state = {
      emptyString: new RegExp("^[ ]*$"), // Une expression régulière pour vérifier si la chaine est vide
      research: "", // La recherche
      data: [], // Les données
      page: 0, // La page
      nbBooks: 10, // Le nombre de livres de base
      requeteApi: undefined, // Une promesse pour la requete a l'api
      goodResearch: false, // Une variable pour savoir si la recherche est bonne
      errorRequete: false, // Une variable pour savoir si il y a eu une erreur avec la requete
    };
  }

  // Ici j'éffectue la requete en fonction de la suite de la recherche entrée,
  // de la page et du nombre de livre a afficher.
  search(newSearch, newPage, newNbBooks) {
    // Si il y a une suite de caractere non vide, on effectue la recherche
    if (this.state.emptyString.test(newSearch) === false) {
      let page = newPage;
      // Si la recherche change par rapport a la recherche précedente, on revient à la page 0
      if (newSearch !== this.state.research) {
        page = 0;
        this.setState({ page: page });
      }
      let index = page * newNbBooks;
      this.setState({ goodResearch: false });
      // Je crée une promesse pour la recherche
      const newRequeteApi = new Promise(() => {
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
            // Si la bonne recherche est déja arriver, on ne modifie pas les données
            if (!this.state.goodResearch) {
              this.setState({ data: r.data });
            } else {
              console.log(
                "La requete pour: \n\nRecherche: " +
                  newSearch +
                  "\nLivres par pages: " +
                  newNbBooks +
                  "\n\nest arrivé apres\n\nla requete voulu: \n\nRecherche: " +
                  this.state.research +
                  "\nLivres par pages: " +
                  this.state.nbBooks +
                  "\n\nelle n'a donc pas été pris en compte"
              );
            }
            // Au retour de la requete, si la recherche est la même que celle de la requete
            // on le signale, pour eviter que d'autres requetes intermediaires
            // potentiellement en retard ne modifient les données
            if (
              newSearch === this.state.research &&
              newNbBooks === this.state.nbBooks
            ) {
              this.setState({ errorRequete: false });
              this.setState({ goodResearch: true });
            }
            this.setState({ requeteApi: undefined });
          })
          .catch((error) => {
            console.log(error);
            console.log(
              "la requete pour: \n\nRecherche: " +
                newSearch +
                "\nLivres par pages: " +
                newNbBooks +
                "\npage: " +
                newPage +
                "\n\na échoué"
            );
            if (this.state.goodResearch) {
              console.log(
                "Elle est arrivé apres la requete voulu, elle n'a donc pas été prise en compte"
              );
            }
            // On signal l'erreur uniquement si la bonne requete a échoué
            if (
              newSearch === this.state.research &&
              newNbBooks === this.state.nbBooks
            ) {
              this.setState({ errorRequete: true });
              this.setState({ goodResearch: true });
            }
            this.setState({ requeteApi: undefined });
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
    // et si on a des livres en données
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

  reload() {
    this.search(this.state.research, this.state.page, this.state.nbBooks);
  }

  // Ici j'éffectue le chargement de la page
  render() {
    const info = this.state;

    // Les composants
    // Barre de recherche
    const searchBar = (
      <SearchBar
        nbBooks={info.nbBooks}
        ResetPage={this.resetState}
        SearchChange={this.changeSearch}
        NbBooksChange={this.changeNbBooks}
      />
    );
    // La zone des livres
    const bookArea = (
      <BookArea info={info} PageChange={this.changePage} Reload={this.reload} />
    );

    // Si il y a une recherche
    return info.emptyString.test(info.research) === false ? (
      <div className="App">
        {searchBar}
        {bookArea}
      </div>
    ) : (
      // affichage de base
      <div className="App">{searchBar}</div>
    );
  }
}
