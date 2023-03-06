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
    const requeteApi = info.requeteApi;
    const errorRequete = info.errorRequete;

    // La pagination
    const pagination = (
      <Pagination
        data={data}
        page={info.page}
        nbBooks={info.nbBooks}
        PageChange={this.changePage}
      />
    );

    // message de base, qui dans le cas ou les données reçu ne sont pas correctes, sera affiché
    // Pour certains cas l'api renvoie des données avec un "totalItems" supérieur a 0, mais sans "items"
    let display = <h3>Données reçues incorrects</h3>;

    if (requeteApi !== undefined) {
      // Tant qu'il y'a une requete en cours, on affiche un message de chargement
      display = <h3>Chargement...</h3>;
    } else if (errorRequete) {
      // Si il y a une erreur avec la requete, on affiche un message
      display = <h3>Une erreur est survenu, veuillez réessayer.</h3>;
    } else if (books !== undefined) {
      // Si il y a des livres, on les affiches
      display = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    } else if (data.totalItems <= 0) {
      // Si il n'y a pas de livres a la recherche voulu, on affiche un message le spécifiant
      display = (
        <h3>Aucun ouvrage correspondant à votre recherche : {info.research}</h3>
      );
    }

    const Books = <div className="Books">{display}</div>;

    // Si il n'y a pas d'erreur et qu'il y a des données correctes
    return !errorRequete && data.totalItems > 0 && data.items !== undefined ? (
      requeteApi !== undefined ? (
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
