import "./Pagination.css";
import React from "react";

// Composant du footer et de la pagination
export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  handlePrev() {
    const page = this.props.info.page;
    // Si on est sur la première page, on ne peut pas aller en arrière
    if (page > 0) {
      this.props.PageChange(page - 1);
    }
  }

  handleNext() {
    const page = this.props.info.page;
    const totalItems = this.props.info.data.totalItems;
    // Si on est sur la dernière page, on ne peut pas aller plus loin
    if (totalItems > (page + 1) * this.props.info.nbBooks) {
      this.props.PageChange(page + 1);
    }
  }

  render() {
    const info = this.props.info;
    const page = info.page;
    const nbBooks = info.nbBooks;
    const totalItems = info.data.totalItems;
    const nbBooksDisplay = (page + 1) * nbBooks;
    let leftBorder = nbBooksDisplay - nbBooks;
    let rightBorder = nbBooksDisplay;

    // On crée les boutons de pagination
    // On cache le bouton précédent par défaut car on commence a chaque fois sur la première page
    let prevBtn = (
      <h2 className="button prev" onClick={this.handlePrev}>
        Précedent
      </h2>
    );
    let nextBtn = (
      <h2 className="button next" onClick={this.handleNext}>
        Suivant
      </h2>
    );

    if (page === 0) {
      // Si on est sur la première page, on affiche les 10 premiers résultats
      leftBorder = page + 1;
      prevBtn = (
        <h2 className="button prev hidden" onClick={this.handlePrev}>
          Précedent
        </h2>
      );
    }
    // Si on est sur la dernière page, on affiche le nombre de résultats restants
    if (totalItems < (page + 1) * nbBooks || nbBooksDisplay === totalItems) {
      rightBorder = totalItems;
      nextBtn = (
        <h2 className="button next hidden" onClick={this.handleNext}>
          Suivant
        </h2>
      );
    }

    // On crée la pagination correctement en fonction des deux conditions précédentes
    let whereWeAre = (
      <div>
        <h2 className="Pages">
          {page + 1} / {Math.ceil(totalItems / nbBooks)} Pages
        </h2>
        <h5 className="Livres">
          {leftBorder} ... {rightBorder} / {totalItems} Livres
        </h5>
      </div>
    );
    // affichage du composant
    return (
      <div className="Pagination">
        {prevBtn}
        {whereWeAre}
        {nextBtn}
      </div>
    );
  }
}
