const API_KEY = '6b3b53242032f32d70bb851c2ceef6c2'
const API_LANGUAGE = 'pt-br'
const BASE_URL_IMAGE = {
  original:`https://image.tmdb.org/t/p/original`,
  small: `https://image.tmdb.org/t/p/w500/`  
}

const movies = []
let movieActive = ''
const moviesElement = document.getElementById('movies')

function getUrlMovie(movieId) {
    return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${API_LANGUAGE}`
}

function changeButtonMenu() {
  const button = document.querySelector('.button__menu')
  const navigation = document.querySelector('.navigation')


  button.classList.toggle('active')
  navigation.classList.toggle('active')
}

let movieStorage = {nome: 'tt4154796', filme: 2}

localStorage.setItem('movieStorage', JSON.stringify(movieStorage))

let movieString = localStorage.getItem('movieStorage');

let movieObj = JSON.parse(movieString)

console.log(movieObj.nome)

function setMainMovie(movie) {
  const appImage = document.querySelector('.app__image img')
  const button = document.querySelector('.feature__movie button')
  const title = document.querySelector('.feature__movie h1')
  const description = document.querySelector('.feature__movie p')
  const info = document.querySelector('.feature__movie span')
  const rating = document.querySelector('.rating strong')

  title.innerHTML = movie.title
  description.innerHTML = movie.overview
  rating.innerHTML = movie.vote_average
  info.innerHTML = movie.release + ' - ' + movie.genre + ' - Movie'
  //Parei aqui
  button.innerHTML.setAttribute('href', movie.button)
  appImage.setAttribute('src', movie.image.original)
}

function changeMovieActiveInList(newMovieActive) {
  const movieActiveCurrent = document.getElementById(movieActive)
  movieActiveCurrent.classList.remove('active-movie')

  const movieActiveNew = document.getElementById(newMovieActive)
  movieActiveNew.classList.add('active-movie')

  movieActive = newMovieActive
}

function changeMainMovie(movieId) {
  changeMovieActiveInList(movieId)

  const movie = movies.find(movie => movie.id === movieId)

  if(movie?.id) {
    setMainMovie(movie)
    changeButtonMenu()
  } else  {
    console.log(movies)
    console.log('n??o foi poss??vel achar o filme com o id', movieId)
  }
}

function createButtonMovie(movieId) {
  const button = document.createElement('button')
  button.setAttribute('onclick', `changeMainMovie('${movieId}')`)
  button.innerHTML = '<img src="/assets/icon-play-button.png" alt="Icon play button" />'

  return button
}

function createImageMovie(movieImage, movieTitle) {
  const divImageMovie = document.createElement('div')
  divImageMovie.classList.add('movie__image')

  const image = document.createElement('img')

  image.setAttribute('src', movieImage)
  image.setAttribute('alt', `Imagem do filme ${movieTitle}`)
  image.setAttribute('loading', 'lazy')

  divImageMovie.appendChild(image)

  return divImageMovie
}

function addMovieInList(movie) {
  const movieElement = document.createElement('li')
  movieElement.classList.add('movie')

  movieElement.setAttribute('id', movie.id)

  const genre = `<span>${movie.genre}</span>`
  const title = `<strong>${movie.title}</strong>`

  movieElement.innerHTML = genre + title
  movieElement.appendChild(createButtonMovie(movie.id))
  movieElement.appendChild(createImageMovie(movie.image.small, movie.title))

  moviesElement.appendChild(movieElement)
}

async function getMovieData(movieId) {
  const isMovieInList = movies.findIndex(movie => movie.id === movieId)

  if(isMovieInList === -1) {
    try {
      let data = await fetch(getUrlMovie(movieId))
      data = await data.json()
    
      const movieData = {
        id: movieId,
        title: data.title,
        overview: data.overview,
        vote_average: data.vote_average,
        genre: data.genres[0].name,
        release: data.release_date.split('-')[0],
        button: data.button,
        image: {
          original: BASE_URL_IMAGE.original.concat(data.backdrop_path),
          small: BASE_URL_IMAGE.small.concat(data.backdrop_path),
        }
      }
      movies.push(movieData)
    
      return movieData
    } catch(error) {
      console.log('mensagem de erro:', error.message)
    }
  }

  return null
}

function loadMovies() {
  const LIST_MOVIES = ['tt12801262', 'tt4823776', 'tt0800369', 'tt3896198', 'tt1211837', 'tt1825683']
  
  LIST_MOVIES.map(async (movie, index) => {
    const movieData = await getMovieData(movie)

    addMovieInList(movieData)

    if(index === 0) {
      setMainMovie(movieData)
      movieActive = movieData.id

      const movieActiveNew = document.getElementById(movieActive)
      movieActiveNew.classList.add('active-movie')
    }
  })
}

const buttonAddMovie = document.getElementById('add__movie')

function formattedMovieId(movieId) {
  if(movieId.includes('https://www.imdb.com/title/')) {
    const id = movieId.split('/')[4]
    return id
  }
  
  return movieId
}

buttonAddMovie.addEventListener('submit', async function(event) {
  event.preventDefault()

  const newMovieId = formattedMovieId(event.target['movie'].value)
  const newMovie = await getMovieData(newMovieId)

  if(newMovie?.id) {
    addMovieInList(newMovie)
  }

  event.target['movie'].value = ''
})

loadMovies()

