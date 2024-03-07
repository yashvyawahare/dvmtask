import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import SearchBar from './components/SearchBar';
import BookRoundedIcon from '@mui/icons-material/BookRounded';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import DelBtn from './components/Delete';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [isLoading , setIsLoading] = useState(false);
  const [showFav, setShowFav] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  
  const apiKey = 'd732665a7fmsh267cf38988c7e81p1b8855jsnc05e5e8c0585';
  
  const removeDuplicatesById = (arr) => {
    const idMap = new Map();
    const result = [];

    // Iterate through the array
    arr.forEach(obj => {
        // If the id is not in the map, add it and push the object to the result array
        if (!idMap.has(obj.work_id)) {
            idMap.set(obj.work_id, true);
            result.push(obj);
        }
    });

    return result;
  };

  const fetchBooks = async (name) => {
      const url = `https://book-finder1.p.rapidapi.com/api/search?${name ? `q=${name}` : ''}`;
      const options = {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'book-finder1.p.rapidapi.com'
        }
      };

      try {
        setIsLoading(true);
        const response = await axios.get(url, options);
        let filteredBooks = response.data.results;
        if (name) {
          filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(name.toLowerCase()));
        }
        setBooks(filteredBooks);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        // Handle error - display error message to user
      }
  };
  
  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setFilteredFavorites(removeDuplicatesById(favorites));
  }, [favorites]);

  function deleteFav(work_id) {
    setFavorites(prevFav => {
      return prevFav.filter((favBook) => favBook.work_id !== work_id);
    });
  }

  const handleSearch = () => {
    fetchBooks(searchTerm);
    setSearchClicked(true);
    setShowFav(false);
  };

  function Load(){
    if(isLoading){
      return ( 
        <div className='loadDiv'> 
          <div className='rotation'>
             <HourglassEmptyRoundedIcon className='rotate'/>{/*<LoopRoundedIcon className='rotate'/> */}
          </div>
          <h2>Loading...</h2> 
        </div>
      )
    }
  }

  const addToFavorites = (book) => {
    const isBookInFavorites = favorites.some(favBook => favBook.work_id === book.work_id);
    
    if (!isBookInFavorites) {
        setFavorites(prevFavorites => [...prevFavorites, book]);
        console.log(book);
    } else {
        // If the book is already in favorites, do nothing
        alert("Book is already in favorites");
    }
};

  return (    
    <div className='returnDiv'>
      <div className="header">
        <BookRoundedIcon className='bookicon'/>
        <h2 className="heading">  <span>Book Keeper App</span></h2>
      </div>
      <div className="button_area">  
        <SearchBar 
          change={(e) => setSearchTerm(e.target.value)} 
          data={searchTerm} 
          handle={handleSearch} 
        />
        <button onClick={() => setShowFav(true)} className='favSecBtn'><StarRateRoundedIcon/></button>
      </div>
      <div>
      </div>
      <Load/>  
      {!showFav && searchClicked && (
        <div>
          {books.map(book => (
            <div className='book_display' key={book.work_id}>
              <div className='titleDivImg'>
                <h1 className='pTitle'> {book.title}</h1>
                <img src={book.published_works[0].cover_art_url} alt="book cover" className='photo'></img>
              </div>
              <div className='info'>
                <h2>Author:</h2>
                <p className='pAuthor title_info'> {book.authors}</p>
                <h2>Pages:</h2>
                <p className='pPages title_info'> {book.page_count}</p>
                <h2>Series:</h2> 
                <p className='pSeries title_info'>{book.series_name}</p>
                <h2>Language:</h2>
                <p className='pLang title_info'> {book.language}</p>
              </div>
              <div className='Favourite'> 
                <button onClick={() => addToFavorites(book)} className='addFavBtn'><BookmarksIcon className='addFavSvg'/></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {(favorites.length == 0) && showFav && (
        <div class="noFavMsg"> <SentimentDissatisfiedIcon className='noFavsvg'/><span> You have no favourites!</span></div>
     )}
      {showFav && (
        <div>
          {filteredFavorites.map(book => (
            <div className='book_display' key={book.work_id}>
              <div className='titleDivImg'>
                <h1 className='pTitle'> {book.title}</h1>
                <img src={book.published_works[0].cover_art_url} alt="book cover" className='photo'></img>
              </div>
              <div className='info'>
                <h2>Author:</h2>
                <p className='pAuthor'> {book.authors}</p>
                <h2>Pages:</h2>
                <p className='pPages'> {book.page_count}</p>
                <h2>Series:</h2> 
                <p className='pSeries'>{book.series_name}</p>
                <h2>Language:</h2>
                <p className='pLang'> {book.language}</p>
              </div>
              <div className='Delete'> 
              <DelBtn HandleDel={()=>deleteFav(book.work_id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
