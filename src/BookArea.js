import "./BookArea.css";
import React from "react";
import Book from "./Book";
import Pagination from "./Pagination";

// Composant de la zone des livres
export default class BookArea extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }

  // Fonction qui change la page
  changePage(newPage) {
    this.props.PageChange(newPage);
  }

  render() {
    const info = this.props.info;
    const data = info.data;
    const books = data.items;
    const totalItems = data.totalItems;
    const requestApi = info.requestApi;
    const errorRequest = info.errorRequest;

    const loading = info.loading;

    // La pagination
    const pagination = (
      <Pagination
        info={info}
        PageChange={this.changePage}
        Loading={this.props.Loading}
      />
    );

    // Message de base, qui dans le cas ou les données reçu ne sont pas correctes, sera affiché
    // Pour certains cas l'api renvoie des données avec un "totalItems" supérieur a 0, mais sans "items"
    // Dans ce cas je ne sais pas si il est légitime de permettre a l'utilisateur de faire un retour en arriere.
    let display = <h3 className="displayText">Données reçues incorrects</h3>;

    if (requestApi !== undefined || loading) {
      // Tant qu'il y'a une requete en cours, on affiche un message de chargement
      display = <h3 className="displayText">Chargement...</h3>;
    } else if (errorRequest) {
      // Si il y a une erreur avec la requete, on affiche un message
      display = (
        <div className="display">
          <h3 className="displayText">
            Une erreur est survenu, veuillez réessayer.
          </h3>
          <button
            className="btnReload"
            type="button"
            onClick={this.props.Reload}
          >
            Réessayer
          </button>
        </div>
      );
    } else if (books !== undefined) {
      // Si il y a des livres, on les affiches
      display = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    } else if (totalItems <= 0) {
      // Si il n'y a pas de livres a la recherche voulu, on affiche un message le spécifiant
      display = (
        <h3 className="displayText">
          Aucun ouvrage correspondant à votre recherche : {info.research}
        </h3>
      );
    }

    const Books = <div className="Books">{display}</div>;

    // Si il n'y a pas d'erreur et qu'il y a des données correctes
    return !errorRequest && totalItems > 0 && data.items !== undefined ? (
      requestApi !== undefined || loading ? (
        // Si il y a des données précédemment reçu et une requete a l'api en cours,
        // on affiche le message de chargement et la pagination du haut
        <div className="BookArea">
          {pagination}
          {Books}
        </div>
      ) : (
        // Si il y a des données et pas de requete a l'api en cours on affiche le tout correctement
        <div className="BookArea">
          {pagination}
          {Books}
          {pagination}
        </div>
      )
    ) : (
      <div className="BookArea">{Books}</div>
    );
  }
}
