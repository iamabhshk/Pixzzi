import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [randomPhotos, setRandomPhotos] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const accessKey = 'u_5TcQ-sgzErfRNpNOn2HtQeMy3p01ZPUi8Nufi59Uk';

  useEffect(() => {
    loadMorePhotos(); // Initial load
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset currentPage to 1 whenever searchKeyword or sortOption changes
    setCurrentPage(1);
  }, [searchKeyword, sortOption]);

  const loadMorePhotos = () => {
    axios
      .get('https://api.unsplash.com/photos/random', {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        params: {
          count: 5,
          page: currentPage,
        },
      })
      .then((response) => {
        const newPhotos = response.data;
        setRandomPhotos((prevPhotos) => [...newPhotos, ...prevPhotos]);
        setCurrentPage((prevPage) => prevPage + 1);
      })
      .catch((error) => console.log(error));
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMorePhotos();
    }
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

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

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

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
    <div className="Mainclass">
      <h1 className="title">Pixzzi</h1>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search wallpapers..."
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </form>
        <div className="section">
          <button htmlFor="sort" className="button">
            Sort by:
          </button>
          <select id="sort" value={sortOption} onChange={handleSortChange} className="selectColor">
            <option value="popular" className="dropdown-item">
              Popular
            </option>
            <option value="latest" className="dropdown-item">
              Latest
            </option>
            <option value="oldest" className="dropdown-item">
              Oldest
            </option>
          </select>
        </div>
      </div>

      <div className="gallery-image">
        {searchResults && searchResults.length > 0 ? (
          sortPhotos(searchResults).map((photo) => (
            <div key={photo.id} className="img-box">
              <img src={photo.urls.small} alt={photo.alt_description} className="photo" />
              <div className="transparent-box">
                <div className="caption">
                  <p>{photo.user.username}</p>
                  <p className="opacity-low">Likes: {photo.likes}</p>
                  {/* <button onClick={() => handleDownload(photo.urls.small)}>Download</button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          sortPhotos(randomPhotos).map((photo) => (
            <div key={photo.id} className="img-box">
              <img src={photo.urls.small} alt={photo.alt_description} className="photo" />
              <div className="transparent-box">
                <div className="caption">
                  <p>{photo.user.username}</p>
                  <p className="opacity-low">Likes: {photo.likes}</p>
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
