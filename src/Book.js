import "./Book.css";
import React from "react";
import bookEmpty from "./bookEmpty.png";

// composant du livre
export default class Book extends React.Component {
  // Rendu du livre
  // le rendu du livre est composé de l'image, du titre,
  // de la description et du lien vers la lecture en ligne

  render() {
    const volumeInfo = this.props.book.volumeInfo;
    const title = volumeInfo.title;

    let description = volumeInfo.description;
    // Si il n'y a pas de description, on affiche "pas de description"
    if (description === undefined) {
      description = "pas de description";
    }

    const previewLink = volumeInfo.previewLink;
    const alt = volumeInfo.title + " image";

    let image = "";
    // Si il n'y a pas d'image, on affiche une image par défaut
    if (volumeInfo.imageLinks === undefined) {
      image = bookEmpty;
    } else {
      image = volumeInfo.imageLinks.thumbnail;
    }

    return (
      <div className="Book">
        <a href={previewLink}>
          <img className="thumbnail" src={image} alt={alt} />
        </a>
        <div className="text">
          <h1 className="title">
            <a href={previewLink}>{title}</a>
          </h1>
          <p className="description">{description}</p>
        </div>
      </div>
    );
  }
}
