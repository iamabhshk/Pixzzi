import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const App = () => {
  const [randomPhotos, setRandomPhotos] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('latest');
  const accessKey = 'u_5TcQ-sgzErfRNpNOn2HtQeMy3p01ZPUi8Nufi59Uk'
  useEffect(() => {
    axios
      .get('https://api.unsplash.com/photos/random', {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        params: {
          count: 10,
        },
      })
      .then((response) => setRandomPhotos(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // Perform search using the Unsplash API
    axios
      .get('https://api.unsplash.com/search/photos', {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        params: {
          query: searchKeyword,
        },
      })
      .then((response) => setSearchResults(response.data.results))
      .catch((error) => console.log(error));

    setSearchKeyword('');
  };

  // Handle sort option change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Sort photos based on the selected option
  const sortPhotos = (photos) => {
    const sortedPhotos = photos ? [...photos] : [];
    switch (sortOption) {
      case 'popular':
        return sortedPhotos.sort((a, b) => b.likes - a.likes);
      case 'oldest':
        return sortedPhotos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'latest':
      default:
        return sortedPhotos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  return (
    <div>
      <h1>Wallpaper App</h1>
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Search wallpapers..."
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <button type="submit" className="button">Search</button>
      </form>

      <div className='section'>
        <button htmlFor="sort" className="button">Sort by:</button>
        <select id="sort" value={sortOption} onChange={handleSortChange} className="selectColor">
          <option value="popular" className="dropdown-item">Popular</option>
          <option value="latest" className="dropdown-item">Latest</option>
          <option value="oldest" className="dropdown-item">Oldest</option>
        </select>
      </div>

      <div className="gallery-image">
        {searchResults && searchResults.length > 0 ? (
          sortPhotos(searchResults).map((photo) => (
            <div key={photo.id} className="img-box">
              <img src={photo.urls.small} alt={photo.alt_description} />
              <div className='transparent-box'>
                <div className='caption'>
                  <p>{photo.user.username}</p>
                  <p className='opacity-low'>Likes: {photo.likes}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          sortPhotos(randomPhotos).map((photo) => (
            <div key={photo.id}  className="img-box">
              <img src={photo.urls.small} alt={photo.alt_description} />
              <div className='transparent-box'>
                <div className='caption'>
                  <p>{photo.user.username}</p>
                  <p className='opacity-low'>Likes: {photo.likes}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
