import "./Book.css";
import React from "react";

// composant du livre
export default class Book extends React.Component {
  // Rendu du livre
  // le rendu du livre est composé de l'image, du titre,
  // de la description et du lien vers la lecture en ligne

  render() {
    const title = this.props.book.volumeInfo.title;
    const volumeInfo = this.props.book.volumeInfo;

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
      image = "https://via.placeholder.com/150";
    } else {
      image = volumeInfo.imageLinks.thumbnail;
    }

    return (
      <div className="Book">
        <img className="thumbnail" src={image} alt={alt} />
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
