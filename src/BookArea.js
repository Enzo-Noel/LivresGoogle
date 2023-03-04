import "./BookArea.css";
import React from "react";
import Book from "./Book";

// Composant de la zone des livres
export default class BookArea extends React.Component {
  render() {
    const books = this.props.data.items;
    // Si il n'y a pas de livres a la recherche correspondante, on affiche un message
    let display = (
      <h3>
        Aucun ouvrage correspondant à votre recherche : {this.props.research}
      </h3>
    );

    if (this.props.errorCheck) {
      display = <h3>Une erreur est survenu, veuillez réessayer.</h3>;
    } else if (books !== undefined) {
      display = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    }

    // Si il y a des livres, on les affiche
    return <div className="BookArea">{display}</div>;
  }
}
