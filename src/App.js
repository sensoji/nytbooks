import React, { Component } from 'react';
import affiliate from './affiliate.gif';
import axios from 'axios';
import './App.css';

const API_KEY = 'YOUR API KEY HERE!';
const ROOT_URL = `http://api.nytimes.com/svc/books/v3/lists/overview?api-key=${API_KEY}`;

function DisplayBookLists(props){
  return (
    <div className="display-book-list">
      <ul>
        {props.list.map((item)=>
          <li key={item.list_id}
            onClick = { () => props.onChangeDisplayedBooks(item) }
            >
            {item.list_name}
          </li>
        )}
    </ul>
  </div>
  )
}

function DisplayBooks(props){
  if(!props){
    return <div>Fetching books...</div>
  }
  return(
    <div>
        {props.list.map((book) =>
        <div className="book-item" key={book.primary_isbn10}>
          <div  className="book-image">
              <img src={book.book_image} alt={book.title}/>
          </div>
          <div className="book-details">
            <p><strong>{book.title}</strong> by <em>{book.author}</em></p>
            <hr />
            <p>{book.description}</p>
            <p><em>{book.publisher}</em></p>
            <p>ISBN10: {book.primary_isbn10}</p>
            <p>ISBN13: {book.primary_isbn13}</p>
          </div>
          <div className="affiliate-link">
            <a onClick={ ()=> window.open(book.amazon_product_url.replace('com', 'co.uk'))}>
              <img src={affiliate} alt="affiliate link" />
            </a>
          </div>
        </div>
        )}
    </div>
  )
}

function DisplayCategory(props){
  return(
    <div className="category-view"><strong>Currently viewing > </strong> {props.category} (<em>w/c: {props.date.split("-").reverse().join("-")} </em>)</div>
  );
}

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      book_list: [],
      displayed_book_list : [],
      current_category: '',
      published_date: ''
    }

    this.fetchBooks('react.js');
    this.updateBookList= this.updateBookList.bind(this);
  }

  componentDidMount(){
    this.fetchBooks();
  }

  fetchBooks = () => {
    const url = ROOT_URL;
    return axios.get(url)
      .then((response)=>{
        this.setState({
          book_list: response.data.results.lists,
          displayed_book_list: response.data.results.lists[0].books,
          current_category: response.data.results.lists[0].list_name,
          published_date: response.data.results.bestsellers_date
        })
      });
  }

  updateBookList (event) {
    this.setState({
      displayed_book_list: event.books,
      current_category: event.list_name
    })
  }

  render() {
    return (
      <div className="wrapper">

          <DisplayCategory
            category={this.state.current_category}
            date={this.state.published_date}
          />

          <DisplayBookLists
            list={this.state.book_list}
            onChangeDisplayedBooks={this.updateBookList}
          />


          <DisplayBooks
            list={this.state.displayed_book_list}
          />


      </div>

    );
  }
}

export default App;
