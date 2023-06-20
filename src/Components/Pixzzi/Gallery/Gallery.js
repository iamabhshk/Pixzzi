import React from 'react';

const Gallery = (props)=>{
    return (
        <div className="gallery-image">
          {props.searchResults && props.searchResults.length > 0 ? (
          props.sortPhotos(props.searchResults).map((photo) => (
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
          props.sortPhotos(props.randomPhotos).map((photo) => (
            <div key={photo.id} className="img-box">
              {console.log(props.sortPhotos)}
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
    )
}

export default Gallery