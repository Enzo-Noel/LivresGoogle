import "./BookArea.css";
import React from "react";
import Book from "./Book";

// Composant de la zone des livres
export default class BookArea extends React.Component {
  render() {
    const books = this.props.data.items;
    // message de base, qui dans le cas ou les données reçu ne sont pas correctes, sera affiché
    let display = <h3>Données reçu incorrect</h3>;

    if (this.props.searchPromise !== undefined) {
      // Si il y a un chargement, on affiche un message
      display = <h3>Chargement...</h3>;
    } else if (this.props.errorCheck) {
      // Si il y a une erreur avec la requete, on affiche un message
      display = <h3>Une erreur est survenu, veuillez réessayer.</h3>;
    } else if (books !== undefined) {
      // Si il y a des livres, on les affiche
      display = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    } else if (this.props.data.totalItems <= 0) {
      // Si il n'y a pas de livres a la recherche correspondante, on affiche un message
      display = (
        <h3>
          Aucun ouvrage correspondant à votre recherche : {this.props.research}
        </h3>
      );
    }

    return <div className="BookArea">{display}</div>;
  }
}
