import "./Footer.css";
import React from "react";

// Composant du footer et de la pagination
export default class Footer extends React.Component {
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
      <h2 className="btn" onClick={this.handleMinus}>
        Précedent
      </h2>
    );
    let nextBtn = (
      <h2 className="btn" onClick={this.handlePlus}>
        Suivant
      </h2>
    );
    const page = this.props.page;
    const data = this.props.data;
    let pagination = (page + 1) * this.props.nbBooks;
    let leftBorder = pagination - this.props.nbBooks;
    let rightBorder = pagination;

    // Si on est sur la première page, on affiche les 10 premiers résultats
    if (page === 0) {
      leftBorder = page + 1;
      prevBtn = (
        <h2 className="btn hidden" onClick={this.handleMinus}>
          Précedent
        </h2>
      );
    }
    // Si on est sur la dernière page, on affiche le nombre de résultats restants
    if (
      data.totalItems < (page + 1) * this.props.nbBooks ||
      pagination === data.totalItems
    ) {
      rightBorder = data.totalItems;
      nextBtn = (
        <h2 className="btn hidden" onClick={this.handlePlus}>
          Suivant
        </h2>
      );
    }

    // On crée la pagination correctement en fonction des deux conditions précédentes
    let paginations = (
      <h2>
        [{leftBorder} ... {rightBorder}]/{data.totalItems}
      </h2>
    );
    return (
      <div className="Footer">
        {prevBtn}
        {paginations}
        {nextBtn}
      </div>
    );
  }
}
