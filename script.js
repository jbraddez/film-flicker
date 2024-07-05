const baseImgUrl = 'https://image.tmdb.org/t/p/w500';
const baseUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=b55a1aa873c6044a16a079e40e89507c&sort_by=popularity.desc&with_genres=';

const categoryBox = document.getElementById('options');
const cardContainer = document.querySelector('.card');
const posterElement = cardContainer.querySelector('.poster');
const titleElement = cardContainer.querySelector('.title');
const descElement = cardContainer.querySelector('.desc');
const voteAveElement = cardContainer.querySelector('.vote-ave');
const dislikeButton = document.querySelector('.dislike');
const likeButton = document.querySelector('.like');
localStorage.clear();
let moviesList = [];
let currentMovieIndex = 0;

categoryBox.addEventListener('change', async (event) => {
    const genreId = event.target.value;
    console.log('Selected genre ID:', genreId);
    if (genreId && genreId !== 'disabledoption') {
        await fetchMovies(genreId);
    }
});

async function fetchMovies(genreId) {
    cardContainer.style.display = 'flex';
    const flickagain = document.querySelector('.flickagain');
    flickagain.style.display = 'none';
    const url = `${baseUrl}${genreId}`;
    console.log('Fetching movies from URL:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        moviesList = data.results;
        currentMovieIndex = 0;
        if (moviesList.length > 0) {
            displayMovie(moviesList[currentMovieIndex]);  // Display the first movie from the results
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovie(movie) {
    posterElement.src = `${baseImgUrl}${movie.poster_path}`;
    posterElement.alt = movie.title;
    titleElement.textContent = movie.title;
    descElement.textContent = movie.overview;
    voteAveElement.textContent = `${movie.vote_average}/10`;
    cardContainer.style.opacity = '1'; // Ensure the card is visible
}

dislikeButton.addEventListener('click', () => {
    if (moviesList.length > 0) {
        cardContainer.classList.add('fly-left');
        setTimeout(() => {
            moviesList.splice(currentMovieIndex, 1);  // Remove the current movie from the list
            cardContainer.classList.remove('fly-left');
            if (moviesList.length > 0) {
                currentMovieIndex = currentMovieIndex % moviesList.length;
                displayMovie(moviesList[currentMovieIndex]);
            } else {
                clearMovieDisplay();
            }
        }, 500); // Match the duration of the CSS animation
    }
});

likeButton.addEventListener('click', () => {
    if (moviesList.length > 0) {
        cardContainer.classList.add('fly-right');
        setTimeout(() => {
            const likedMovie = moviesList[currentMovieIndex];
            storeLikedMovie(likedMovie.original_title);
            moviesList.splice(currentMovieIndex, 1);  // Remove the current movie from the list
            cardContainer.classList.remove('fly-right');
            if (moviesList.length > 0) {
                currentMovieIndex = currentMovieIndex % moviesList.length;
                displayMovie(moviesList[currentMovieIndex]);
            } else {
                clearMovieDisplay();
            }
        }, 500); // Match the duration of the CSS animation
    }
});

function storeLikedMovie(movieId) {
    let likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];
    if (likedMovies.length < 5) {
        if (!likedMovies.includes(movieId)) {
            likedMovies.push(movieId);
            localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
        }
    }if (likedMovies.length > 4){
        showLikedMovies()
    }
}

function clearMovieDisplay() {
    posterElement.src = '';
    posterElement.alt = '';
    titleElement.textContent = '';
    descElement.textContent = '';
    voteAveElement.textContent = '';
    cardContainer.style.opacity = '0'; 
}

function showLikedMovies() {
    const likedcont = document.querySelector('.like-movie-disp');
    likedcont.style.height = '65%';
    likedcont.style.display = 'flex';
    cardContainer.style.display = 'none';
    const flickagain = document.querySelector('.flickagain');
    flickagain.style.display = 'block';
    flickagain.addEventListener('click', () => {
        likedcont.style.height = '0';
        cardContainer.style.opacity = '1';
        localStorage.clear();
        document.querySelectorAll('.like-movie-disp div').forEach((element) => {
            element.remove();
        });
        fetchMovies(35);
        
    });
    
    let localdata = localStorage.getItem('likedMovies');
    
    if (localdata) {
        localdata = JSON.parse(localdata);
        
        localdata.sort((a, b) => b.likes - a.likes); 
        
        for (let i = 0; i < Math.min(5, localdata.length); i++) {
            const movieName = localdata[i]; 
            const listItem = document.createElement('div');
            listItem.textContent = movieName;
            likedcont.appendChild(listItem);
        }
    }
}



