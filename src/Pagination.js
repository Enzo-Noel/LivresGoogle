import "./Pagination.css";
import React from "react";

// Composant du footer et de la pagination
export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.handleMinus = this.handleMinus.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
  }

  // Si on est sur la première page, on ne peut pas aller en arrière
  handleMinus() {
    const page = this.props.page;
    if (page > 0) {
      this.props.PageChange(page - 1);
    }
  }

  // Si on est sur la dernière page, on ne peut pas aller plus loin
  handlePlus() {
    const page = this.props.page;
    const data = this.props.data;
    if (data.totalItems > (page + 1) * this.props.nbBooks) {
      this.props.PageChange(page + 1);
    }
  }

  render() {
    let prevBtn = (
      <h2 className="button" onClick={this.handleMinus}>
        Précedent
      </h2>
    );
    let nextBtn = (
      <h2 className="button" onClick={this.handlePlus}>
        Suivant
      </h2>
    );
    const page = this.props.page;
    const data = this.props.data;
    const nbBooks = this.props.nbBooks;
    let nbBooksDisplay = (page + 1) * nbBooks;
    let leftBorder = nbBooksDisplay - nbBooks;
    let rightBorder = nbBooksDisplay;

    // Si on est sur la première page, on affiche les 10 premiers résultats
    if (page === 0) {
      leftBorder = page + 1;
      prevBtn = (
        <h2 className="button hidden" onClick={this.handleMinus}>
          Précedent
        </h2>
      );
    }
    // Si on est sur la dernière page, on affiche le nombre de résultats restants
    if (
      data.totalItems < (page + 1) * nbBooks ||
      nbBooksDisplay === data.totalItems
    ) {
      rightBorder = data.totalItems;
      nextBtn = (
        <h2 className="button hidden" onClick={this.handlePlus}>
          Suivant
        </h2>
      );
    }

    // On crée la pagination correctement en fonction des deux conditions précédentes
    let whereWeAre = (
      <div>
        <h2>
          {leftBorder} ... {rightBorder} / {data.totalItems} Livres - {page + 1}{" "}
          / {Math.ceil(data.totalItems / nbBooks)} Pages
        </h2>
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
