import { useEffect } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './View.css';

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.log(e);
          navigate('/');
        });
    }
    return () => { };
  }, [movieId]);
 
 
  return (
    <div className='main-container'>
      {movie && (
        <>
          <div className="movie-banner" style={{ backgroundImage: `url(${movie.bannerImage || ''})` }}>
            <div className="banner-overlay">
              <h1 className="movie-title">{movie.title}</h1>
            </div>
          </div>

          <div className="movie-details">
            <h3 className="movie-overview">{movie.overview}</h3>
          </div>

          {movie.casts?.length ? (
            <section className="section">
              <h2>Cast & Crew</h2>
              <ul className="cast-list">
                {movie.casts.map((castMember, index) => (
                  <li key={index}>{castMember.name}</li>
                ))}
              </ul>
            </section>
          ) : null}


          {movie.videos?.length ? (
            <section className="section">
              <h2>Videos</h2>
              <div className="video-gallery">
                {movie.videos.map((videoItem, index) => (
                  <video key={index} controls>
                    <source src={videoItem.url} type="video/mp4" />
                  </video>
                ))}
              </div>
            </section>
          ) : null}


          {movie.photos?.length ? (
            <div className="section">
              <h2>Photos</h2>
              <div className="photo-gallery">
                {movie.photos.map((photo, idx) => (
                  <img key={idx} src={photo.url} alt={`Movie Photo ${idx + 1}`} />
                ))}
              </div>
            </div>
          ) : null}

        </>
      )}
    </div>
  );
}

export default View;
