import React from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


function SearchBar(props) {
    return (
    <div className='inpDiv'>
    <input 
      type="text" 
      placeholder="Search by title" 
      value={props.data}
      onChange={props.change}
      className='inp'
    />
    <button onClick={props.handle} className='inpBtn'><SearchRoundedIcon className="searchIcon"/><span className="search">Search</span></button>
    
  </div>
    );
}

export default SearchBar;