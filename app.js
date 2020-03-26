const app = async () => {

  // Fetch Data from .json file
  const data = await fetch("data.json");
  const hotelsData = await data.json();

  // Arrays from Data
  const firstArray = [hotelsData[0]];
  const secondArray = [hotelsData[1]];

  const roomTypes = firstArray[0].roomtypes;
  const hotels = secondArray[0].entries;

  // init function
  const init = () => {
    console.log("Application running...");
    renderHotels();
    appUtils();
  };

  // Global DOM Elements
  const $hotelSection = document.getElementById("hotels-section");
  const $searchBarData = document.getElementById("searchBar-cities");
  const $cityFilter = document.getElementById("location-filter");
  const $roomTypeSelection = document.querySelector(".rooms-types-selection");
  const $checkIn = document.querySelector(".input-check-in");
  const $checkOut = document.querySelector(".input-check-out");
  const $slider = document.getElementById("price-bar");
  const $output = document.getElementById("price-value");
  const $starsFilter = document.getElementById("stars-filter");
  const $ratingsFilter = document.getElementById("ratings-filter");
  const $recommendations = document.getElementById("recommedations");
  const $searchForm = document.getElementById("searchForm");
  const $inputSearch = document.querySelector(".input-search");
  const $viewMapBtn = document.getElementById("view-map");



  // Global Arrays
  const cities = hotels.map(hotel => hotel.city);
  const filters = hotels.map(hotel => hotel.filters);
  const mergedFilters = filters.reduce((x, y) => x.concat(y), []);
  const uniqueMergedFilters = Array.from(new Set(mergedFilters.map(JSON.stringify))).map(JSON.parse);
  const uniqueCities = [...new Set(cities)];

  // Utilities operations
  const appUtils = () => {

    // DOM elements
    const heartIcons = Array.from(
      $hotelSection.getElementsByClassName("heart")
    );

    // Operations
    const displayRecommendations = () => {
      uniqueMergedFilters.map(filter => {
        $recommendations.innerHTML += `<option>${filter.name}</option>`;
      });
    };

    const displaySearchBarData = () => {
      uniqueCities.forEach(city => {
        $searchBarData.innerHTML += `<option value="${city}">${city}</option>`;
      });
    };

    const displayHotelLocation = () => {
      uniqueCities.map(city => {
        $cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
      });
    };

    const displayRoomTypes = () => {
      roomTypes.map(type => {
        let template = `
             <option value="${type.name}">${type.name}</option>
             `;
        $roomTypeSelection.innerHTML += template;
      });
    };

    const getCurrentDate = () => {
      const now = new Date();

      const day = ("0" + now.getDate()).slice(-2);
      const month = ("0" + (now.getMonth() + 1)).slice(-2);

      const today = now.getFullYear() + "-" + month + "-" + day;

      $checkIn.value = today;
      $checkOut.value = today;
    };

    const sliderInput = () => {
      $output.innerHTML = "max $ " + $slider.value;

      $slider.oninput = function () {
        $output.innerHTML = "max $" + this.value;
        const value =
          ($slider.value - $slider.min) / ($slider.max - $slider.min);
        $slider.style.backgroundImage = [
          "-webkit-gradient(",
          "linear, ",
          "left top, ",
          "right top, ",
          "color-stop(" + value + ", rgb(0, 89, 255)),",
          "color-stop(" + value + ", grey)",
          ")"
        ].join("");
      };
    };

    const viewMap = () => {
      $viewMapBtn.addEventListener('click', () => {
        // on click show map modal
        alert('Not available yet');

      });
    }

    // Events
    heartIcons.forEach(heartIcon => {
      heartIcon.addEventListener("click", () => {
        heartIcon.classList.toggle("redHeart");
      });
    });

    // Invoke utilities
    getCurrentDate();
    sliderInput();
    displayRoomTypes();
    displaySearchBarData();
    displayHotelLocation();
    displayRecommendations();
    viewMap();
  };



  // Hotels render operations

  const renderHotels = () => {

    const displayAll = () => {
      hotels.forEach(hotel => {
        const template = renderHotelCard(hotel);
        $hotelSection.innerHTML += template;
      });
    };

    const getBySearchBar = () => {
      $searchForm.addEventListener("submit", e => {
        e.preventDefault();
        const searchedHotel = hotels.filter(hotel => hotel.city === $inputSearch.value);
        $hotelSection.innerHTML = "";
        searchedHotel.forEach(hotel => {
          const template = renderHotelCard(hotel);
          $hotelSection.innerHTML += template;
        });
      });
    };

    const getByLocationFilter = () => {
      $cityFilter.addEventListener('change', () => {

        const filteredHotel = hotels.filter(hotel => hotel.city === $cityFilter.value);
        $hotelSection.innerHTML = "";

        if ($cityFilter.value === 'All') {
          displayAll();
        } else {
          filteredHotel.forEach(hotel => {
            const template = renderHotelCard(hotel);
            $hotelSection.innerHTML += template;
          });
        }
      });

    };

    const getByPriceBar = () => {
      $slider.addEventListener('change', () => {
        const filteredHotel = hotels.filter(hotel => hotel.price <= $slider.value);
        $hotelSection.innerHTML = "";

        filteredHotel.forEach(hotel => {
          const template = renderHotelCard(hotel);
          $hotelSection.innerHTML += template;
        });

      });
    }

    // stars filter
    const getByPropertyType = () => {
      $starsFilter.addEventListener('change', () => {
        const filteredHotel = hotels.filter(hotel => hotel.rating == $starsFilter.value);
        $hotelSection.innerHTML = "";

        if ($starsFilter.value === 'All') {
          displayAll();
        } else {
          filteredHotel.forEach(hotel => {
            const template = renderHotelCard(hotel);
            $hotelSection.innerHTML += template;
          });
        }
      });
    }

    const getByGuestRating = () => {

      $ratingsFilter.addEventListener('change', () => {

        const minRating = $ratingsFilter.value;
        const maxRating = $ratingsFilter.options[$ratingsFilter.selectedIndex].dataset.maxrating;

        const filteredHotel = hotels.filter(hotel => hotel.ratings.no >= minRating && hotel.ratings.no <= maxRating);
        $hotelSection.innerHTML = "";


        if ($ratingsFilter.value === 'All') {
          displayAll();
        } else {
          filteredHotel.forEach(hotel => {
            const template = renderHotelCard(hotel);
            $hotelSection.innerHTML += template;
          });
        }
      });
    }

    const getByRecommendations = () => {
      $recommendations.addEventListener('change', () => {
        
          const filteredHotel = hotels.filter(hotel => {
            const recommended = hotel.filters.find(filter => filter.name === $recommendations.value);
            //console.log(recommended);
            return recommended;
        });
       // console.log(filteredHotel);

       $hotelSection.innerHTML = "";

       if ($recommendations.value === 'recommendations') {
        displayAll();
      } else {
        filteredHotel.forEach(hotel => {
          const template = renderHotelCard(hotel);
          $hotelSection.innerHTML += template;
        });
      }
        
      });
    }


    const renderHotelCard = hotel => {
      const template = `
      <div class="hotel-card container">
  
            <div class="hotel-display">
              <i class="fas fa-heart heart"></i>
              <img
                class="img"
                src="${hotel.thumbnail}"
                alt="hotel"
              />
              <span class="img-pagin">
                1 / 30
              </span>
            </div>
  
            <div class="hotel-info">
              <h4 id="hotel-name">${hotel.hotelName}</h4>
              <span id="stars">
                <i class="${hotel.rating > 0 && "fas fa-star"}"></i>
                <i class="${hotel.rating > 1 && "fas fa-star"}"></i>
                <i class="${hotel.rating > 2 && "fas fa-star"}"></i>
                <i class="${hotel.rating > 3 && "fas fa-star"}"></i>
                <i class="${hotel.rating > 4 && "fas fa-star"}"></i>
                Hotel
              </span>
              <p id="hotel-city">${hotel.city}</p>
              <section id="review">
              <span id="rating">${hotel.ratings.no.toFixed(1)}</span>
                <span id="rating-text">${hotel.ratings.text}</span>
              </section>
            </div>
  
            <div class="deals">
              <div class="offer-box" id="offer-1">
                <span class="offer" id="website">Orbitz</span>
                <span class="offer" id="price-offer">$ ${hotel.price}</span>
              </div>
              <div class="offer-box" id="offer-2">
                <span class="offer" id="website">Trip.com</span>
                <span class="offer" id="price-offer">$ ${hotel.price - 100}</span>
              </div>
              <div class="offer-box" id="offer-3">
                <span class="offer" id="website">Travelocity</span>
                <span class="offer" id="price-offer">$ ${hotel.price - 150}</span>
              </div>
              <div class="offer-box" id="offer-4">
                <span class="offer" id="website">More deals from</span>
                <span class="offer" id="price-offer">$ ${hotel.price - 100} <i class="fas fa-chevron-down"></i></span>
              </div>
            </div>
            <div class="more-deals">
              <div class="website-offer">
                <span id="hotel-website">Hotel Website</span>
                <span id="hotel-website-price">$ ${hotel.price}</span>
                <span id="hotel-website-offer">3 nights for <span id="triple-price">$ ${hotel.price * 3}</span></span>
              </div>
              <div class="view-deal-box">
                <span>View Deal</span>
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
  
          </div>
      `;
      
      return template;
    };

    // Invoke Hotels render operations
    displayAll();
    getBySearchBar();
    getByLocationFilter();
    getByPriceBar();
    getByPropertyType();
    getByGuestRating();
    getByRecommendations();

  };

  // Invoke init function
  init();
};

app();
