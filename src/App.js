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
      emptyString: new RegExp("^[ ]*$"), // Une expression régulière pour vérifier si la recherche est vide
      research: "", // Stockage de la recherche voulu
      oldResearch: "", // Stockage de la recherche précedente
      data: [], // Stockage des données
      page: 0, // Stockage de la page voulu
      nbBooks: 10, // Stockage du nombre de livres par page voulu
      requestApi: undefined, // Une promesse pour la requete a l'api
      goodResearch: false, // Booléen pour savoir si la bonne recherche est arrivé
      errorRequest: false, // Booléen pour savoir si il y a eu une erreur avec la requete
      timeBeforeRequest: undefined, // Stockage du temps avant la requete
      loading: false, // Booléen pour savoir si il vas y avoir une requete
      // (permet d'afficher le chargement dans le cas ou on ecrit trop vite ou si on change trop vite de page)
    };
  }

  // Ici j'éffectue la requete en fonction de la suite de la recherche entrée,
  // de la page et du nombre de livre a afficher.
  search(newSearch, newPage, newNbBooks) {
    this.setState({ goodResearch: false });
    // Si il y a une suite de caractere non vide, on effectue la recherche
    if (this.state.emptyString.test(newSearch) === false) {
      let page = newPage;
      // Si la recherche change par rapport a la recherche précedente, on revient à la page 0
      if (newSearch !== this.state.oldResearch) {
        page = 0;
        this.setState({ page: page });
      }
      let index = page * newNbBooks;
      this.setState({ oldResearch: newSearch });
      // Je crée une promesse pour la recherche
      const newRequeteApi = new Promise((resolve) => {
        let request =
          "https://www.googleapis.com/books/v1/volumes?q=inauthor:" +
          newSearch +
          "&startIndex=" + // un - apres le =
          index + // index negatif provoque une erreur et permet de tester le catch
          "&maxResults=" +
          newNbBooks;
        axios
          .get(request)
          .then((r) => {
            // Si la bonne recherche est déja arriver, on ne modifie pas les données
            if (!this.state.goodResearch && !this.state.loading) {
              this.setState({ data: r.data });
            } else {
              console.log(
                "La requete:\nrecherche: " +
                  newSearch +
                  " - page: " +
                  (page + 1) +
                  " - livres par page: " +
                  newNbBooks +
                  "\n\nest arrivé apres\n\nla requete voulu:\nrecherche: " +
                  this.state.research +
                  " - page: " +
                  (this.state.page + 1) +
                  " - livres par page: " +
                  this.state.nbBooks +
                  "\n\nelle n'a donc pas été prise en compte"
              );
            }
            // Au retour de la requete, si la recherche est la même que celle de la requete
            // on le signale, pour eviter que d'autres requetes intermediaires
            // potentiellement en retard ne modifient les données
            if (newSearch === this.state.research && page === this.state.page) {
              this.setState({ errorRequest: false });
              this.setState({ goodResearch: true });
            }
            this.setState({ requestApi: undefined });
            resolve();
          })
          .catch((error) => {
            console.log(error);
            let msgError = "";
            if (this.state.goodResearch) {
              msgError =
                "\n\nElle est arrivé apres la requete voulu, elle n'a donc pas été prise en compte";
            }
            console.log(
              "la requete:\nrecherche: " +
                newSearch +
                " - page: " +
                (newPage + 1) +
                " - Livres par page: " +
                newNbBooks +
                "\n\na échoué" +
                msgError
            );
            // On signal l'erreur uniquement si la bonne requete a échoué
            if (newSearch === this.state.research && page === this.state.page) {
              this.setState({ errorRequest: true });
              this.setState({ goodResearch: true });
            }
            this.setState({ requestApi: undefined });
          });
      });
      this.setState({ requestApi: newRequeteApi });
    } else {
      // Si il y'a une requete en cours, on attend qu'elle soit fini avant de remettre a zero les données
      if (this.state.requestApi !== undefined) {
        this.state.requestApi.then(() => {
          this.resetState();
        });
      } else {
        this.resetState();
      }
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
    this.requestDelay(newSearch, this.state.page, this.state.nbBooks);
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
    // Meme logique que pour la recheche, cette fonction a été ecrite pour eviter de spammer les requetes
    // si l'utilisateur clique trop vite sur les boutons de pagination
    this.requestDelay(this.state.research, newPage, this.state.nbBooks);
  }

  // Si l'utilisateur est en train d'écrire ou si il change de page trop vite,
  // on ne lance pas la requete, ça permet d'éviter de spammer les requetes.
  // si le temps entre deux lettres ou si le temps entre deux changement de page est inférieur à 200ms on patiente.
  // J'ai ecris ce "code" bien apres avoir fait mon systeme gérant les requetes en retard, ce qui en sois fait doublon
  // mais je préfère garder les deux car celui-ci permet d'éviter de lancer des requetes inutiles
  // tandis que l'autre qui est dans la requete directement permet de ne pas prendre
  // en compte les données d'une requete si elle arrive apres la bonne requete souhaité
  requestDelay(research, page, nbBooks) {
    // si la recherche change, on remet a zero les données pour permettre a l'affichage de bien afficher le chargement sans la pagination
    if (research !== this.state.oldResearch) {
      this.setState({ data: [] });
    }
    // Si on est pas en train de charger, on lance le chargement pré requetes pour eviter le spam
    if (!this.state.loading) {
      this.setState({ loading: true });
    }
    // si il y'a le loading pré requete, on le supprime
    if (this.state.timeBeforeRequest !== undefined && this.state.loading) {
      clearTimeout(this.state.timeBeforeRequest);
    }
    this.setState({
      timeBeforeRequest: setTimeout(() => {
        this.search(research, page, nbBooks);
        this.setState({ loading: false });
        this.setState({ timeBeforeRequest: undefined });
        this.setState({});
      }, 200),
    });
  }

  // Fonction de rechargement de la page
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
