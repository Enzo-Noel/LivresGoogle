import "./BookArea.css";
import React from "react";
import Book from "./Book";

// Composant de la zone des livres
export default class BookArea extends React.Component {
  render() {
    const books = this.props.data.items;
    const nbBooks = this.props.nbBooks;
    // Si il n'y a pas de livres a la recherche correspondante, on affiche un message
    let display = (
      <p>
        Aucun ouvrage correspondant à votre recherche : {this.props.research}
      </p>
    );
    if (nbBooks < 1 || nbBooks > 40) {
      display = <p>Le nombre de livres doit être compris entre 1 et 40</p>;
    } else if (books !== undefined) {
      display = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    } else if (this.props.error) {
      display = <p>Erreur avec la requête, veuillez ressayer.</p>;
    }

    // Si il y a des livres, on les affiche
    return <div className="BookArea">{display}</div>;
  }
}
