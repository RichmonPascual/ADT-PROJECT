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
    return () => {};
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

          {/* Movie Details */}
          <div className="movie-details">
            <h3 className="movie-overview">{movie.overview}</h3>
          </div>

          {movie.casts && movie.casts.length > 0 && (
            <div className="section">
              <h2>Cast & Crew</h2>
              <ul className="cast-list">
                {movie.casts.map((cast, index) => (
                  <li key={index}>{cast.name}</li>
                ))}
              </ul>
            </div>
          )}

          {movie.videos && movie.videos.length && (
            <div>
              <h1>Videos</h1>
              {JSON.stringify(movie.videos)}
            </div>
          )}

          {movie.photos && movie.photos.length && (
            <div>
              <h1>Photos</h1>
              {JSON.stringify(movie.photos)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default View;
