import "./App.css";
import React from "react";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import BookArea from "./BookArea";
import axios from "axios";

// Composant principal

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeNbBooks = this.changeNbBooks.bind(this);
    this.state = {
      research: "", // La recherche
      data: [], // Les données
      page: 0, // La page
      nbBooks: 10, // Le nombre de livres
      emptyString: new RegExp("^[ ]*$"), // Une expression régulière pour vérifier si la chaine est vide
      searchPromise: undefined, // Une promesse pour la recherche
    };
  }

  // Ici j'éffectue la recherche en fonction de la suite de caractere entrée
  // et dependant de la page
  search(newSearch, newPage, newNbBooks) {
    // Si il y a une suite de caractere, on effectue la recherche
    if (this.state.emptyString.test(newSearch) === false) {
      let page = newPage;
      // Si la recherche a changé, on revient à la page 0
      if (newSearch !== this.state.research) {
        page = 0;
        this.setState({ page: page });
      }
      let newSearchPromise = new Promise((resolve, reject) => {
        let requete =
          "https://www.googleapis.com/books/v1/volumes?q=inauthor:" +
          newSearch +
          "&startIndex=" +
          page * newNbBooks +
          "&maxResults=" +
          newNbBooks;
        axios
          .get(requete)
          .then((response) => {
            this.setState({ research: newSearch });
            this.setState({ data: response.data });
            resolve(response.data);
            this.setState({ searchPromise: undefined });
            console.log("fin de la promesse " + newSearchPromise);
          })
          .catch((error) => {
            reject(console.log("Erreur serveur" + error));
          });
      });
      console.log("debut de la promesse " + newSearchPromise);
      this.setState({ searchPromise: newSearchPromise });
    } else {
      console.log("Promesse en cours " + this.searchPromise);
      if (this.searchPromise !== undefined) {
        console.log("Annulation de la recherche");
        this.searchPromise.then((data) => {
          this.setState({ research: newSearch });
          this.setState({ data: [] });
        });
      } else {
        this.setState({ research: newSearch });
        this.setState({ data: [] });
      }
    }
  }

  changeNbBooks(newNbBooks) {
    this.setState({ nbBooks: newNbBooks });
    this.search(this.state.research, this.state.page, newNbBooks);
  }

  // Ici j'éffectue le changement de page
  // normalement je l'aurais fait assez simplement en reasignant la valeur de la page via sont setter
  // mais je ne comprend pas le setter n'est pris en compte qu'apres toute la fonction, donc j'ai
  // contourner en passant la page d'une autre façon.
  changePage(newPage) {
    this.setState({ page: newPage });
    this.search(this.state.research, newPage, this.state.nbBooks);
  }

  render() {
    const research = this.state.research;
    const data = this.state.data;
    const page = this.state.page;
    const nbBooks = this.state.nbBooks;
    let hadData = false;
    // Si il y a des données, on le signale
    if (data.totalItems > 0) {
      hadData = true;
    }
    // Si il y a des données pour la recherche, on affiche la barre de recherche, les livres et le footer
    if (this.state.emptyString.test(research) === false) {
      if (hadData && nbBooks > 0 && nbBooks < 41) {
        return (
          <div className="App">
            <SearchBar
              data={data}
              page={page}
              nbBooks={nbBooks}
              SearchChange={this.search}
              NbBooksChange={this.changeNbBooks}
            />
            <BookArea data={data} research={research} nbBooks={nbBooks} />
            <Footer
              data={data}
              page={page}
              nbBooks={nbBooks}
              PageChange={this.changePage}
            />
          </div>
        );
      }
      // Si il y a une recherche mais pas de données, on affiche la barre de recherche et un message d'erreur
      else if (!hadData) {
        return (
          <div className="App">
            <SearchBar
              data={data}
              page={page}
              nbBooks={nbBooks}
              SearchChange={this.search}
              NbBooksChange={this.changeNbBooks}
            />
            <BookArea data={data} research={research} nbBooks={nbBooks} />
          </div>
        );
      }
    }
    return (
      <div className="App">
        <SearchBar
          data={data}
          page={page}
          nbBooks={nbBooks}
          SearchChange={this.search}
          NbBooksChange={this.changeNbBooks}
        />
      </div>
    );
  }
}
