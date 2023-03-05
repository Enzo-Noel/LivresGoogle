import "./BookArea.css";
import React from "react";
import Book from "./Book";
import Pagination from "./Pagination";

// Composant de la zone des livres
export default class BookArea extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.state = {
      error: false,
    };
  }

  changePage(newPage) {
    this.props.PageChange(newPage);
  }

  render() {
    const data = this.props.data;
    const info = this.props.info;
    const books = data.items;
    const error = this.state.error;
    const requeteApi = this.props.requeteApi;

    // La pagination
    const pagination = (
      <Pagination
        data={data}
        page={info.page}
        nbBooks={info.nbBooks}
        PageChange={this.changePage}
      />
    );

    // message de base, qui dans le cas ou les données reçu ne sont pas correctes, sera affiché
    let display = <h3>Données reçu incorrect</h3>;

    if (requeteApi !== undefined) {
      // Tant qu'il y'a une requete en cours, on affiche un message de chargement
      display = <h3>Chargement...</h3>;
      // On met a jour l'etat de l'erreur
      requeteApi.then(() => {
        this.setState({ error: false });
      });
      requeteApi.catch(() => {
        this.setState({ error: true });
      });
    } else if (error) {
      // Si il y a une erreur avec la requete, on affiche un message
      display = <h3>Une erreur est survenu, veuillez réessayer.</h3>;
    } else if (books !== undefined) {
      // Si il y a des livres, on les affiche
      display = books.map((book) => {
        return <Book key={book.id} book={book} />;
      });
    } else if (data.totalItems <= 0) {
      // Si il n'y a pas de livres a la recherche correspondante, on affiche un message
      display = (
        <h3>
          Aucun ouvrage correspondant à votre recherche : {this.props.research}
        </h3>
      );
    }

    const Books = <div className="Books">{display}</div>;

    // Si il n'y a pas d'erreur et qu'il y a des données corectes
    if (!error && data.totalItems > 0 && data.items !== undefined) {
      if (requeteApi !== undefined) {
        // Si il y a des données et une promesse en cours,
        // on affiche le message de chargement et la pagination du haut
        return (
          <div className="BookArea">
            {pagination}
            {Books}
          </div>
        );
      } else {
        // Si il y a des données et pas de promesse en cours on affiche le tout correctement
        return (
          <div className="BookArea">
            {pagination}
            {Books}
            {pagination}
          </div>
        );
      }
    }

    return <div className="BookArea">{Books}</div>;
  }
}
