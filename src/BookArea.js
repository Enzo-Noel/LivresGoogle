import "./BookArea.css";
import React from "react";
import Book from "./Book";

// Composant de la zone des livres
export default class BookArea extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const books = this.props.data.items;
    const nbBooks = this.props.nbBooks;
    // Si il n'y a pas de livres a la recherche correspondante, on affiche un message
    let listBooks = (
      <p>
        Aucun ouvrage correspondant à votre recherche : {this.props.research}
      </p>
    );
    if (nbBooks < 1 || nbBooks > 40) {
      listBooks = <p>Le nombre de livres doit être compris entre 1 et 40</p>;
    }

    // Si il y a des livres, on les affiche
    else if (books !== undefined) {
      listBooks = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    }

    return <div className="BookArea">{listBooks}</div>;
  }
}
