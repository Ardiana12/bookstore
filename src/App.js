import { useEffect, useState } from "react";
import StartRating from "./StartRating";

const tempBooks = [
  {
    imdbID: "tt1375666",
    name: "Twisted Lies",
    author: "Ana Huang",
    price: 20,
    photoName: "https://m.media-amazon.com/images/I/71M4wJoKGxL._SL1500_.jpg",
    soldOut: false,
    pages: 250,
  },
  {
    imdbID: "tt0133093",
    name: "Ignite Me",
    author: "Tahereh Mafi",
    price: 90,
    photoName:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1375972497i/13188676.jpg",
    soldOut: true,
    pages: 400,
  },
  {
    imdbID: "tt6751668",
    name: "Nine Liars",
    author: "Maureen Johnson",
    price: 50,
    photoName: "https://m.media-amazon.com/images/I/913MOmFxMLL._SL1500_.jpg",
    soldOut: false,
    pages: 120,
  },
];
const readBooks = [
  {
    name: "The Cruel Prince",
    author: "Holly Black",
    price: 100,
    photoName:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGBxlezxne0nu2JrzlxjduoD3HA8PbnJTqlbbtEGoks9LzF3jL",
    soldOut: false,
    pages: 236,
  },
  {
    name: "Things We Never Got Over",
    author: "Lucy Score",
    price: 75,
    photoName:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcREN6SOZEoeoWuT8Ao91SMBldSXLs8sY7Yn7uJOBsoi1oWOcTi0",
    soldOut: false,
    pages: 200,
  },
  {
    name: "Unravel Me",
    author: "Tahereh Mafi",
    price: 200,
    photoName:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1340287622i/13104080.jpg",
    soldOut: true,
    pages: 425,
  },
];

const URL = "https://www.googleapis.com/books/v1/volumes";
export default function App() {
  const [books, setBooks] = useState(tempBooks);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState("false");
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  function addToCart(book) {
    const updatedCartItems = [...cartItems]; //krijon nje kopje te vektorit
    const existingItemIndex = updatedCartItems.findIndex(
      (item) => item.name === book.name //kontroll nqs eshte nje liber me te njejtin emer
    );

    if (existingItemIndex !== -1) {
      // Nqs libri eshte ne shporte update sasine e tij
      updatedCartItems[existingItemIndex].quantity += 1;
    } else {
      // If the book is not in the cart, add the new item with quantity 1
      updatedCartItems.push({ ...book, quantity: 1 });
    }

    setCartItems(updatedCartItems);
  }
  const handleEmptyCart = () => {
    // Set the cartItems to an empty array to empty the cart
    setCartItems([]);
  };
  useEffect(() => {
    async function getBooks() {
      try {
        setIsLoading(true);
        setError("");
        //fetch te dhenat
        const res = await fetch(`${URL}?q=${query}`);

        if (!res.ok) throw new Error("Failed to fetch"); //kontrollon nqs fetch eshte i sukseshsem
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
          throw new Error("Books not found"); //kontrollon nqs te dhenat jane gjetur
        }

        setBooks(data.items); //update me te dhenat e gjetura
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 1) {
      setBooks([]);
      setError("");
      return;
    }

    getBooks();
  }, [query]);

  return (
    <div>
      <Header>
        <Logo /> <Quote />{" "}
        <Cart cartItems={cartItems} onEmptyCart={handleEmptyCart} />{" "}
      </Header>{" "}
      <Search query={query} setQuery={setQuery} />{" "}
      <FullContent>
        <BooksContent>
          {" "}
          {/* {isLoading ? <p> Loading... </p> : <BooksList books={books} />}{" "} */}{" "}
          {/* operatori and...nqs pjesa e pare eshte true shfaq pjesen e dyte */}{" "}
          {isLoading && <p> Loading... </p>}{" "}
          {!isLoading && !error && <BooksList books={books} />}{" "}
          {error && <ErrorMessage message={error} />}{" "}
        </BooksContent>{" "}
      </FullContent>{" "}
      <BookL readBooks={readBooks} onAddToCart={addToCart} />{" "}
    </div>
  );
}

function ErrorMessage({ message }) {
  return <p className="error"> {message} </p>;
}

function Header({ children }) {
  return <div className="header"> {children} </div>;
}

function Logo() {
  return (
    <div className="logo">
      {" "}
      <span> 📙 </span>{" "}
    </div>
  );
}

function Quote() {
  return <p className="quote"> BOOKS FOR ALL </p>;
}

function Cart({ cartItems, onEmptyCart }) {
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  ); //numeron sasine e elementeve ne shporte
  const handleEmptyCart = () => {
    // Call the provided onEmptyCart function to handle emptying the cart
    if (onEmptyCart) {
      onEmptyCart();
    }
  };
  return (
    <div className="cart">
      {" "}
      🛒 You have {totalItems} {totalItems === 1 ? "book" : "books"} in your
      cart <button onClick={handleEmptyCart}> Empty cart </button>{" "}
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search books..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function FullContent({ children }) {
  return <div className="content"> {children} </div>;
}

function BooksContent({ children }) {
  return <div className="box"> {children} </div>;
}

function BooksList({ books }) {
  const limitedBooks = books.slice(0, 3);

  return (
    <ul className="list">
      {" "}
      {limitedBooks.map((book) => (
        <Books book={book} key={String(book.imdbID || book.id)} />
      ))}{" "}
    </ul>
  );
}

function Books({ book }) {
  if (!book || !book.volumeInfo) {
    console.error("Invalid book data:", book);
    return null;
  }

  const thumbnail =
    (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) ||
    "placeholder_image_url";
  const title = book.volumeInfo.title || "Title not available";
  const price =
    (book.saleInfo &&
      book.saleInfo.listPrice &&
      book.saleInfo.listPrice.amount) ||
    "Price not available";

  return (
    <li className="list-books">
      <img src={thumbnail} alt={`${title} poster`} />{" "}
      <div className="book-info">
        <h3> {title} </h3>{" "}
        <p>
          <span> Price: {price} </span>{" "}
        </p>{" "}
      </div>{" "}
    </li>
  );
}

function BookL({ readBooks, onAddToCart }) {
  const [sortOption, setSortOption] = useState("description");

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sort the books based on the selected option
  const sortedBooks = [...readBooks].sort((a, b) => {
    if (sortOption === "description") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "price") {
      return a.price - b.price;
    }
    return 0;
  });
  return (
    <div>
      <div className="sort">
        <select value={sortOption} onChange={handleSortChange}>
          <option value="description"> Sort by description </option>{" "}
          <option value="price"> Sort by price </option>{" "}
        </select>{" "}
      </div>{" "}
      <div className="container">
        {" "}
        {sortedBooks.map((book) => (
          <TempBookList key={book.name} book={book} onAddToCart={onAddToCart} />
        ))}{" "}
      </div>{" "}
    </div>
  );
}

function TempBookList({ book, onAddToCart }) {
  const { name, author, price, photoName, pages } = book;
  const addToCartHandler = () => {
    onAddToCart(book);
  };

  return (
    <div className="details" key={name}>
      <header>
        <img src={photoName} alt="poster" />
        <div className="details-overview">
          <h2> Title: {name} </h2> <p> Author:{author} </p> <p> </p>{" "}
        </div>{" "}
      </header>{" "}
      <section>
        <div className="rating">
          <StartRating maxRating={5} size={20} color="#e05ee0" />{" "}
        </div>{" "}
        <p> Price: $ {price} </p> <p> Pages:{pages} </p>
        <button onClick={addToCartHandler}> Add </button>{" "}
      </section>{" "}
    </div>
  );
}
