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
    const page = this.props.page;
    // Si on est sur la première page, on ne peut pas aller en arrière
    if (page > 0) {
      this.props.PageChange(page - 1);
    }
  }

  handleNext() {
    const page = this.props.page;
    const data = this.props.data;
    // Si on est sur la dernière page, on ne peut pas aller plus loin
    if (data.totalItems > (page + 1) * this.props.nbBooks) {
      this.props.PageChange(page + 1);
    }
  }

  render() {
    const btnPrev = document.querySelector(".prev");
    const btnNext = document.querySelector(".next");
    const page = this.props.page;
    const data = this.props.data;
    const nbBooks = this.props.nbBooks;
    let nbBooksDisplay = (page + 1) * nbBooks;
    let leftBorder = nbBooksDisplay - nbBooks;
    let rightBorder = nbBooksDisplay;

    // On crée les boutons de pagination
    // On cache le bouton précédent par défaut car on commence a chaque fois sur la première page
    let prevBtn = (
      <h2 className="button prev hidden" onClick={this.handlePrev}>
        Précedent
      </h2>
    );
    let nextBtn = (
      <h2 className="button next" onClick={this.handleNext}>
        Suivant
      </h2>
    );

    // Si on est sur la première page, on affiche les 10 premiers résultats
    if (page === 0) {
      leftBorder = page + 1;
      if (btnPrev !== null) {
        btnPrev.classList.add("hidden");
      }
    } else {
      if (btnPrev !== null) {
        btnPrev.classList.remove("hidden");
      }
    }
    // Si on est sur la dernière page, on affiche le nombre de résultats restants
    if (
      data.totalItems < (page + 1) * nbBooks ||
      nbBooksDisplay === data.totalItems
    ) {
      rightBorder = data.totalItems;
      if (btnNext !== null) {
        btnNext.classList.add("hidden");
      }
    } else {
      if (btnNext !== null) {
        btnNext.classList.remove("hidden");
      }
    }

    // On crée la pagination correctement en fonction des deux conditions précédentes
    let whereWeAre = (
      <div>
        <h2 className="Pages">
          {page + 1} / {Math.ceil(data.totalItems / nbBooks)} Pages
        </h2>
        <h5 className="Livres">
          {leftBorder} ... {rightBorder} / {data.totalItems} Livres
        </h5>
      </div>
    );
    return (
      <div className="Pagination">
        {prevBtn}
        {whereWeAre}
        {nextBtn}
      </div>
    );
  }
}
