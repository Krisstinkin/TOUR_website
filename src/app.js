async function makeTour() {

    const response = await fetch('https://www.bit-by-bit.ru/api/student-projects/tours')
    const data = await response.json()

    return data
}

const tourCity = document.getElementById('tourCity');
const tourCountry = document.getElementById('tourCountry');

function getCity(tourCity) {
    let checkCity;

    if (tourCity === null) {
        checkCity = tourCountry;
    } else {
        checkCity = tourCity;
    }
    return checkCity
}

    function renderTours() {
            
        container2.innerHTML = ""; 

        data.forEach((tour) => {

            container2.innerHTML += `
            
                <div class="bg-white shadow-lg rounded-lg overflow-hidden">

                        <img class="h-96 w-full" src="${tour.image}" alt="" />

                    <div class="p-6">
                        <div>
                            <p id="tourCountry" class="text-yellow-600 font-medium text-sm hover:underline">
                                <a href="#">${tour.country}</a>
                            </p>
                            <a href="#">
                                <p id="tourCity" class="font-semibold mt-3 text-xl">${tour.city}</p>
                                <p class="text-gray-500 mt-3">${tour.hotelName}</p>
                            </a>
                        </div>

                            <div class="mt-3 text-gray-500 text-sm flex items-center">
                                <img class="h-4" src="https://img.icons8.com/ios/50/null/christmas-star.png"/>

                                <span class="ml-1">${tour.rating}</span>
                                <span aria-hidden="true" class="mx-2">&middot;</span>

                                <img class="h-5" src="https://img.icons8.com/ios/50/null/ruble.png"/>

                                <span class="ml-1">${tour.price}</span>
                            </div>

                        <div class="mt-3 text-gray-500 text-sm flex items-center">

                            <p class="ml-1">
                            ${format(new Date(tour.startTime), pattern, option)} - ${format(new Date(tour.endTime), pattern, option)}
                            </p>
                            
                        </div>

                        <div class="mt-3 text-gray-500 text-sm flex items-center">
                        <p>Продолжительность тура: ${duration} дней</p>
                        </div>

                        <button class="btn-primary mt-4 text-sm">Подробнее</button>
                        <button class="btn-primary mt-4 text-sm">Добавить в избранное</button>

                    </div>
            </div>
        `
    })
}

function filterByCountry(tours, country) {
    if(country) {
        const filtredTours = tours.filter((tour) => {
            return tour.country === country
        })
        renderTours(filtredTours)
    } else {
        renderTours(tours)
    }
}

function filterByRating(tours, rating) {
    if (rating) {
        const filtredTours = tours.filter((tour) => {
            return tour.rating >= rating
        })
        renderTours(filtredTours)
    } else {
        renderTours(tours)
    }
}

async function init() {
    const tours = await makeTour()
    renderTours(tours)

    document
        .getElementById("indonesia")
        .addEventListener("click", () => filterByCountry(tours, "Индонезия"))
    document
        .getElementById("egypt")
        .addEventListener("click", () => filterByCountry(tours, "Египет"))
    document
        .getElementById("cypros")
        .addEventListener("click", () => filterByCountry(tours, "Кипр"))
    document
        .getElementById("mexico")
        .addEventListener("click", () => filterByCountry(tours, "Мексика"))
    document
        .getElementById("tanzania")
        .addEventListener("click", () => filterByCountry(tours, "Танзания"))
    document
        .getElementById("thailand")
        .addEventListener("click", () => filterByCountry(tours, "Тайланд"))
    document
        .getElementById("maldives")
        .addEventListener("click", () => filterByCountry(tours, "Мальдивы"))
    document
        .getElementById("all")
        .addEventListener("click", () => filterByCountry(tours))

    document
        .getElementById("rating10")
        .addEventListener("click", () => filterByRating(tours, 10))
    
    document
        .getElementById("rating9")
        .addEventListener("click", () => filterByRating(tours, 9))
    
    document
        .getElementById("rating8")
        .addEventListener("click", () => filterByRating(tours, 8))

    document
        .getElementById("rating7")
        .addEventListener("click", () => filterByRating(tours, 7))

    document
        .getElementById("ratingAll")
        .addEventListener("click", () => filterByRating(tours))

}

init()