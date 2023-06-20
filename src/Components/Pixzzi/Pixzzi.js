import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar/SearchBar';
import Gallery from './Gallery/Gallery';

const Pixzzi = () => {
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

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
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
      .then((response) => {
        const newPhotos = response.data.results || response.data;
        setSearchResults((prevPhotos) => [...prevPhotos, ...newPhotos]);
        setCurrentPage((prevPage) => prevPage + 1);
      })
      .catch((error) => console.log(error));

    setSearchKeyword('');
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

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMorePhotos();
    }
  };

  return (
    <div className="Mainclass">
      <h1 className="title">Pixzzi</h1>
      <SearchBar 
        setSearchResults={setSearchResults}
        searchResults={searchResults}
        searchKeyword={searchKeyword}
        sortOption={sortOption}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchChange={handleSearchChange}
        handleSortChange={handleSortChange}
      />
      <Gallery 
        randomPhotos={randomPhotos}
        searchResults={searchResults}
        sortPhotos={sortPhotos}
      />
      
    </div>
  );
};

export default Pixzzi;
