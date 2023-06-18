import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Loader from './Components/Loader/Loader';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('latest');

  const accessKey = 'u_5TcQ-sgzErfRNpNOn2HtQeMy3p01ZPUi8Nufi59Uk';

  const observer = useRef(null);
  const lastPhotoElementRef = useRef(null);

  useEffect(() => {
    if (searchResults.length > 0) {
      setPhotos(searchResults);
    } else {
      setPhotos([]);
      setPage(1);
      loadPhotos();
    }
  }, [searchResults]);

  useEffect(() => {
    let paragraphs = document.querySelectorAll("img");
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      });
    };
    const optionsss = {
      threshold: 0.7
    };
  const observers = new IntersectionObserver(callback, optionsss);
  paragraphs.forEach((parag) => observers.observe(parag));
    



    if (!loading && observer.current) {
      observer.current.disconnect();
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleIntersection = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadMorePhotos();
      }
    };

    observer.current = new IntersectionObserver(handleIntersection, options);

    if (lastPhotoElementRef.current) {
      observer.current.observe(lastPhotoElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading]);

  const loadPhotos = () => {
    setLoading(true);

    axios
      .get(`https://api.unsplash.com/photos/`, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        params: {
          page,
          per_page: 30,
        },
      })
      .then((response) => {
        const newPhotos = response.data.map((photo) => ({
          id: photo.id,
          url: photo.urls.regular,
        }));

        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error loading photos:', error);
        setLoading(false);
      });
  };

  const loadMorePhotos = () => {
    if (!loading) {
      loadPhotos();
    }
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchResults([]);

    axios
      .get(`https://api.unsplash.com/search/photos/`, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        params: {
          query: searchKeyword,
          per_page: 30,
        },
      })
      .then((response) => {
        setSearchResults(
          response.data.results.map((photo) => ({
            id: photo.id,
            url: photo.urls.regular,
          }))
        );
      })
      .catch((error) => {
        console.log('Error searching photos:', error);
      });

    setSearchKeyword('');
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  



  const sortPhotos = (photos) => {
    const sortedPhotos = [...photos];
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
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search wallpapers..."
            value={searchKeyword}
            onChange={handleSearchChange}
            pattern=".*\S.*"
            required
          />
        </form>

        <div className="dropdown">
          <button className="dropdown-button" htmlFor="sort">
            Sort by:
          </button>
          <select id="sort" value={sortOption} onChange={handleSortChange} className="dropdown-content">
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
        {sortPhotos(photos).map((photo, index) => {
          if (photos.length === index + 1) {
            return (
              <div ref={lastPhotoElementRef} key={photo.id} className="img-box">
                <img src={photo.url} alt="Unsplash" />
              </div>
            );
          } else {
            return (
              <div key={photo.id} className="img-box">
                <img src={photo.url} alt="Unsplash" />
                <div className=".transparent-box">
                    <span className="username">{photo.user.username}</span>
                    <span className="likes">{photo.likes} likes</span>
                </div>
              </div>
            );
          }
        })}
      </div>

      {loading && <Loader/>}
    </div>
  );
};

export default App;
