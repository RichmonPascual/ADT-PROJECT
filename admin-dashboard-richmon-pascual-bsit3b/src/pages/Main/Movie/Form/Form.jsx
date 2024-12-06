import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  let { movieId, userId } = useParams();
  const accessToken = localStorage.getItem('accessToken');
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);


  const handleSearch = useCallback(() => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE',
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
      console.log(response.data.results);
    });
  }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setMovie({
      tmdbId: movie.id,
      title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      backdropPath: movie.backdrop_path,
      posterPath: movie.poster_path,
      name: movie.cast
    });
    axios
      .get(`https://api.themoviedb.org/3/movie/${movie.id}/images`, {
        headers: {
          Accept: "application/json",
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',
        },
      })
      .then((response) => {
        setPhotos(response.data.photos)
      })
      .catch(() => {
        setError("Unable to load photos. Please try again later.");
      });


    // Fetch Videos
    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',
      },
    })
      .then(response => {
        setVideos(response.data.results);
      })
      .catch(() => {
        setError("Unable to load videos. Please try again later.");
      });

    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',
      },
    })
      .then(response => {
        setCast(response.data.cast);
      })
      .catch(() => {
        setError("Unable to load cast information. Please try again later.");
      });
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (selectedMovie === undefined) {
      //add validation
      alert('Please search and select a movie.');
    } else {
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: selectedMovie.isFeatured ? 1 : 0,
      };

      const request = axios({
        method: 'post',
        url: '/movies',
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((saveResponse) => {
          console.log(saveResponse);
          alert('Success');
          navigate('/main/movies');
        })
        .catch((error) => console.log(error));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!movie.title?.trim()) newErrors.title = 'Title is required';
    if (!movie.overview?.trim()) newErrors.overview = 'Overview is required';
    if (!movie.releaseDate) newErrors.releaseDate = 'Release date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      await axios.patch(`/movies/${movieId}`, movie, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert('Movie details updated successfully');
      navigate('/main/movies');
    } catch (error) {
      console.error('Error updating movie details:', error);
      alert('Failed to update movie details. Please try again.');
    }
  };

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
        console.log(response.data);
      });
    }
  }, []);


  return (
    <>
      <h1>{movieId ? 'Edit' : 'Create'} Movie</h1>

      {movieId === undefined && (
        <>
          <div className='search-container'>
            Search Movie:
            <input
              type='text' onChange={(e) => setQuery(e.target.value)}
            />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>

        </>
      )}
      <hr />
      <div className='movie-container'>
        <form>
          {selectedMovie ? (
            <img
              className='poster-image'
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
            />
          ) : (
            ''
          )}
          <div className='field'>
            Title:
            <input
              type='text'
              name='title'
              value={movie.title || ''}
              onChange={handleChange}
            />
            {errors.title && <span className='error'>{errors.title}</span>}
          </div>
          <div className='field'>
            Overview:
            <textarea
              rows={3}
              name='overview'
              value={movie.overview || ''}
              onChange={handleChange}
            />
          </div>

          <div className='field'>
            Popularity:
            <input
              type='text'
              name='popularity'
              value={movie.popularity || ''}
              onChange={handleChange}
            />
          </div>

          <div className='field'>
            Release Date:
            <input
              type='text'
              name='releaseDate'
              value={movie.releaseDate || ''}
              onChange={handleChange}
            />
          </div>

          <div className='field'>
            Vote Average:
            <input
              type='text'
              name='voteAverage'
              value={movie.voteAverage || ''}
              onChange={handleChange}
            />
          </div>

          <h2>Videos</h2>
          <div className="videos">
            {videos.length > 0 ? (
              videos.map((clip) => (
                <div key={clip.id} className="video-item">
                  <h3>{clip.name}</h3>
                  <iframe
                    src={`https://www.youtube.com/embed/${clip.key}`}
                    title={clip.name}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ))
            ) : (
              <p>No videos available.</p>
            )}
          </div>

          <h2>Cast</h2>
          <div className="cast">
            {cast.length > 0 ? (
              cast.map((actor) => (
                <div key={actor.id} className="cast-item">
                  <h3>{actor.name}</h3>
                  <p>Character: {actor.character}</p>
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                      alt={`Profile of ${actor.name}`}
                    />
                  ) : null}
                </div>
              ))
            ) : (
              <p>No cast information available.</p>
            )}
          </div>
          <h3>Photos</h3>
          <div className="movie-photos">
            <div className="photo-grid">
              {photos.length > 0 ? (
                photos.map((image, idx) => (
                  <img
                    key={idx}
                    src={`https://image.tmdb.org/t/p/original/${image.backdrop_path}`}
                    alt={image.title || "Movie Photo"}
                    className="movie-photo"
                  />
                ))
              ) : (
                <p>No photos available.</p>
              )}
            </div>
          </div>

        </form>

        <div className='butt'>
          <button type='button' onClick={handleSave}>
            Save
          </button>
          <button type='button' onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default Form;
