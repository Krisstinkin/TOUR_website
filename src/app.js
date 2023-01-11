import { format, differenceInCalendarDays } from "date-fns"
import { ru } from "date-fns/locale"

async function makeTour() {
    const response = await fetch(
        "https://www.bit-by-bit.ru/api/student-projects/tours"
    )
    const data = await response.json()

    return data
}

function getCity(tour) {
    let checkCity

    if (tour.city && tour.city.length > 0) {
        checkCity = tour.city
    } else {
        checkCity = tour.country
    }
    return checkCity
}

function renderTours(tours) {
    const container2 = document.getElementById("container")

    container2.innerHTML = ""

    tours.forEach((tour) => {
        const pattern = "dd MMMM y"
        const option = { locale: ru }
        const duration = differenceInCalendarDays(
            new Date(tour.endTime),
            new Date(tour.startTime)
        )

        let city = getCity(tour)

        // if (tour.city && tour.city.length > 0) {
        //             city = tour.city;
        //         } else {
        //             city = tour.country;
        // }

        container2.innerHTML += `
        
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">

                    <img class="h-96 w-full" src="${tour.image}" alt="" />

                    <div class="p-6">
                        <div>
                            <p id="tourCountry" class="text-yellow-600 font-medium text-sm hover:underline">
                                <a href="#">${tour.country}</a>
                            </p>
                            <a href="#">
                                <p id="tourCity" class="font-semibold mt-3 text-xl">${city}</p>
                                <p class="text-gray-500 mt-3">${
                                    tour.hotelName
                                }</p>
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
                            ${format(
                                new Date(tour.startTime),
                                pattern,
                                option
                            )} - ${format(
            new Date(tour.endTime),
            pattern,
            option
        )}
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
    if (country) {
        const filtredTours = tours.filter((tour) => {
            return tour.country === country
        })
        renderTours(filtredTours)
    } else {
        renderTours(tours)
    }
}

function filterByRating(tours, rating) {
    console.log(tours)
    console.log(rating)
    if (rating) {
        const filtredTours = tours.filter((tour) => {
            return tour.rating >= rating
        })
        renderTours(filtredTours)
    } else {
        renderTours(tours)
    }
}

function filterByPrice(tours, pricing) {
    const minPrice = document.getElementById("minPrice").value
    const maxPrice = document.getElementById("maxPrice").value

    const filteredTours = tours.filter((tour) => {
        if (minPrice && maxPrice) {
            return tour.price <= maxPrice && tour.price >= minPrice
        } else if (maxPrice) {
            return tour.price <= maxPrice
        } else if (minPrice) {
            return tour.price >= minPrice
        } else {
            renderTours(tours)
        }
    })

    renderTours(filteredTours)

    document.getElementById("minPrice").value = ""
    document.getElementById("maxPrice").value = ""
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
        .getElementById("btnPrice")
        .addEventListener("click", () => filterByPrice(tours))

    const ratingSelect = document.getElementById("rating")
    ratingSelect.addEventListener("change", () =>
        filterByRating(tours, ratingSelect.value)
    )
}

init()
