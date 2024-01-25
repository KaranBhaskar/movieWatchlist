const showcaseSearch = document.getElementById("showcase--search");
const showcaseWatchlist = document.getElementById("showcase--watchlist");
const showcaseMovie = document.getElementById("showcase--movie");
let watchlist = [];

if (showcaseSearch) {
  const searchForm = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");
  searchForm.addEventListener("submit", function (e) {
    if (searchInput.value) {
      const url = `https://www.omdbapi.com/?s=${searchInput.value.replace(
        /\s/g,
        "+"
      )}&apikey=8f047ac2`;
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((datas) => {
          console.log(datas);
          if (datas.Response === "False") {
            console.log("false working");
            searchInput.value = "Searching something with no data";
            const p = document.createElement("p");
            p.textContent =
              "Unable to find what you’re looking for. Please try another search.";
            showcaseSearch.appendChild(p);
          } else {
            showcaseSearch.innerHTML = "";
            datas.Search.forEach((data) => render(data, showcaseSearch));
          }
        });
      e.preventDefault();
    } else {
      showcaseSearch.innerHTML = "";
    }
  });
}

if (showcaseWatchlist) {
  console.log("HI");
  if (JSON.parse(localStorage.getItem("watchlist"))) {
    watchlist = JSON.parse(localStorage.getItem("watchlist"));
    console.log(watchlist);
  }
  if (watchlist.length) {
    showcaseWatchlist.innerHTML = "";
    watchlist.forEach((movie) => {
      render(movie, showcaseWatchlist);
    });
  } else {
    showcaseWatchlist.innerHTML =
      "<p>Your watchlist is looking a little empty...<span><a href='./index.html'><img src='./src/addToWatchlist.png' /> Let's add some movies!</a></span></p>";
  }
}
function render(info, element) {
  const url = `https://www.omdbapi.com/?i=${info.imdbID}&apikey=8f047ac2`;
  let innner = "";
  let btn = element === showcaseSearch ? "Watchlist" : "Remove";
  let icon = element === showcaseSearch ? "addToWatchlist.png" : "remove.png";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      innner += `
          <div class="movie flex" id=movie--${info.imdbID}>
             <img
               src=${
                 data.Poster != "N/A" ? data.Poster : "./src/imageNotFound.jpeg"
               }
               class="movie--cover"
             />
             <div class="movie--info">
               <div class="movie-title flex">
                 <h2>${data.Title}</h2>
                 <p><img src="./src/reviewStar.png" /> ${
                   data.Ratings.length
                     ? data.Ratings[0].Value.slice(0, 3)
                     : "N/a"
                 }</p>
                 <button class="watch" >
                 <a id=watch-${
                   info.imdbID
                 } href="./playMovie.html"> Watch Now</a></button>
               </div>
               <div class="movie-info flex">
                 <h3>${data.Runtime}</h3>
                 <h3>${data.Genre}</h3>
                 <button class="movie--watchlist" id=${info.imdbID}>
                   <img src="./src/${icon}" />
                   ${btn}
                 </button>
               </div>
               <p class="movie--plot">
                 ${data.Plot}
               </p>
             </div>
           </div>
   `;
      element.innerHTML += innner;
    });
}

document.addEventListener("click", function (e) {
  const target = e.target.id;
  const div = document.getElementById(`movie--${target}`);
  if (div && showcaseSearch) {
    let obj = {
      imdbID: target,
    };
    watchlist.push(obj);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  } else if (target.substring(0, 6) === "watch-") {
    localStorage.setItem("movie", JSON.stringify(target.substring(6)));
  } else if (showcaseWatchlist) {
    watchlist = JSON.parse(localStorage.getItem("watchlist"));
    const index = watchlist.findIndex(function (movie) {
      return movie.imdbID === e.target.id;
    });
    if (index > -1) {
      watchlist.splice(index, 1);
    }
    showcaseWatchlist.innerHTML = "";
    if (!watchlist.length) {
      showcaseWatchlist.innerHTML =
        "<p>Your watchlist is looking a little empty...<span><a href='./index.html'><img src='./src/addToWatchlist.png' /> Let's add some movies!</a></span></p>";
    } else {
      watchlist.forEach((movie) => {
        render(movie, showcaseWatchlist);
      });
    }
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
});

if (showcaseMovie) {
  const id = JSON.parse(localStorage.getItem("movie"));
  console.log(id);
  document.getElementById(
    "video"
  ).innerHTML = `<iframe src="https://vidsrc.to/embed/movie/${id}" frameborder="0" allowFullScreen="true"></iframe>`;
}
