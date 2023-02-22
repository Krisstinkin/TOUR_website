import { format, differenceInCalendarDays } from "date-fns"
import { ru } from "date-fns/locale"
import swal from "sweetalert"

async function makeTour() {
    const response = await fetch(
        "https://www.bit-by-bit.ru/api/student-projects/tours"
    )
    const data = await response.json()

    return data
}

function renderTours(tours) {
    console.log(tours)
    const container2 = document.getElementById("container")

    container2.innerHTML = ""
    if (tours.length === 0) {
        container2.innerHTML = "к сожалению ничего не найдено"
        return
    }

    tours.forEach((tour) => {
        const pattern = "dd MMMM y"
        const option = { locale: ru }
        const duration = differenceInCalendarDays(
            new Date(tour.endTime),
            new Date(tour.startTime)
        )

        container2.innerHTML += `
        
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">

                    <img class="h-96 w-full" src="${tour.image}" alt="" />

                    <div class="p-6">
                        <div>
                            <div class="flex justify-end">
                            <button id="addFavorit${
                                tour.id
                            }" class="btn-primary mt-4">Добавить в избранное</button>
                            <button id="deleteFavorit${
                                tour.id
                            }" class="btn-primary mt-4 hidden">Удалить из избранного</button>
                            </div>
                            <p class="text-yellow-600 font-medium text-sm hover:underline">
                                <a href="#">${tour.country}</a>
                            </p>
                            <a href="#">
                                <p class="font-semibold mt-3 text-xl">${
                                    tour.city
                                }</p>
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

                        <button class="btn-primary mt-4">Подробнее</button>
                        
                    </div>
            </div>
        `

        if (favorites.includes(tour.id)) {
            deleteBtn(tour)
        } else {
            addBtn(tour)
        }
    })

    document.getElementById(`favoritBtn`).addEventListener("click", () => {
        const favTours = tours.filter((t) => {
            return favorites.includes(t.id)
        })
        renderTours(favTours)
    })

    tours.forEach((tour) => {
        if (favorites.includes(tour.id)) {
            document
                .getElementById(`deleteFavorit${tour.id}`)
                .addEventListener("click", () => {
                    swal("Тур удален из избранного")
                    addBtn(tour)
                    deleteFavorites(tour.id)
                    saveToLocalStorage()
                })
        } else {
            document
                .getElementById(`addFavorit${tour.id}`)
                .addEventListener("click", () => {
                    favorites.push(tour.id)
                    swal("Тур добавлен в избранное")
                    deleteBtn(tour)
                    saveToLocalStorage()
                })
        }
    })
}

function addBtn(tour) {
    document.getElementById(`addFavorit${tour.id}`).style.display = "flex"
    document.getElementById(`deleteFavorit${tour.id}`).style.display = "none"
}

function deleteBtn(tour) {
    document.getElementById(`addFavorit${tour.id}`).style.display = "none"
    document.getElementById(`deleteFavorit${tour.id}`).style.display = "flex"
}

// добавление в избранное

let favorites = [] // массив id избранных туров

//сохранение данных из localStorage
function saveToLocalStorage() {
    const toursJson = JSON.stringify(favorites)
    localStorage.setItem("favorites", toursJson)
}

//получение данных из localStorage
const toursJson = localStorage.getItem("favorites")
if (toursJson) {
    favorites = JSON.parse(toursJson)
}

function deleteFavorites(tour) {
    const index = favorites.indexOf(tour.id)
    favorites.splice(index, 1)
}

// блок с фильтрацией туров
const tourCity = document.getElementById("tour.city")
const tourCountry = document.getElementById("tour.country")

function getCity(tourCity) {
    let checkCity

    if (tourCity == null) {
        checkCity = tourCountry
    } else {
        checkCity = tourCity
    }
    return checkCity
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

async function init() {
    const tours = await makeTour()
    renderTours(tours)

    document
        .getElementById("indonesia")
        .addEventListener("click", () => filterByCountry(tours, "Индонезия"))
    document
        .getElementById("thailand")
        .addEventListener("click", () => filterByCountry(tours, "Тайланд"))
    document
        .getElementById("maldives")
        .addEventListener("click", () => filterByCountry(tours, "Мальдивы"))
    document
        .getElementById("all")
        .addEventListener("click", () => filterByCountry(tours))

    document.getElementById(`allToursBtn`).addEventListener("click", () => {
        renderTours(tours)
    })
}

init()
