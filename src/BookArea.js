import "./BookArea.css";
import React from "react";
import Book from "./Book";

// Composant de la zone des livres
export default class BookArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const books = this.props.data.items;
    // Si il n'y a pas de livres a la recherche correspondante, on affiche un message
    let listBooks = (
      <p>
        Aucun ouvrage correspondant à votre recherche : {this.props.research}
      </p>
    );

    // Si il y a des livres, on les affiche
    if (books !== undefined) {
      listBooks = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    }

    return <div className="BookArea">{listBooks}</div>;
  }
}
