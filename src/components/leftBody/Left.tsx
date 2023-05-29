import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/firebase/firebaseConfig";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [orderBy, setOrderBy] = useState("mostRecent");

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(database, "books"));
      const bookData = querySnapshot.docs.map((doc) => doc.data());
      setBooks(bookData);
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    // Apply the sorting logic based on the `orderBy` state
    let sortedBooks = [...books];
    if (orderBy === "mostRecent") {
      sortedBooks = sortedBooks.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    } else if (orderBy === "mostCommented") {
      sortedBooks = sortedBooks.sort((a, b) => {
        const aComments = a.comment?.length || 0;
        const bComments = b.comment?.length || 0;
        return bComments - aComments;
      });
    } else if (orderBy === "mostLiked") {
      sortedBooks = sortedBooks.sort((a, b) => b.like.length - a.like.length);
    }

    setBooks(sortedBooks);
  }, [orderBy]);

  const handleOrderChange = (option) => {
    setOrderBy(option);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleOrderChange("mostRecent")}>
          Most Recent
        </button>
        <button onClick={() => handleOrderChange("mostCommented")}>
          Most Commented
        </button>
        <button onClick={() => handleOrderChange("mostLiked")}>
          Most Liked
        </button>
      </div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.bookName}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
