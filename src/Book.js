import "./Book.css";
import React from "react";

export default class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="Book">
        <h1>Book</h1>
      </div>
    );
  }
}
