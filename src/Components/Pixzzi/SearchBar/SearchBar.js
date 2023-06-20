import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = (props) => {
    return(
        <div className="search-container">
            <form onSubmit={props.handleSearchSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Search wallpapers..."
                value={props.searchKeyword}
                onChange={props.handleSearchChange}
            />
            </form>
            <div className="section">
            <button htmlFor="sort" className="button">
                Sort by:
            </button>
            <select id="sort" value={props.sortOption} onChange={props.handleSortChange} className="selectColor">
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
    )

}


export default SearchBar