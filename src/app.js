import { format, differenceInCalendarDays } from "date-fns"
import { ru } from "date-fns/locale"

//рисуем прелоадер

document.addEventListener('DOMContentLoaded', () => {
        const mediaFiles = document.querySelectorAll('img');
        let i = 0
        Array.from(mediaFiles).forEach((file, index) => {
            file.onload = () => {
               i++
               percents.innerHTML = ((i * 100) / mediaFiles.length).toFixed(1)
               if(i === mediaFiles.length) {
                preloader.classList.add('preloader--hide')
                percents.innerHTML = 100
               }
            }
        })
    })

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

//отрисовываем основные туры, полученные с сервера

function renderTours(tours) {
    const container2 = document.getElementById("container")

    if (tours.length === 0) {
        container2.innerHTML = 'Извините, туры не найдены. <br> Повторите попытку'
    } else {
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
                   
                    <div>
                    <img class="h-96 w-full" src="${tour.image}" alt="" />
                    </div>
                    
                    <div class="p-6">
                        <div>
                            <div class="flex justify-between">
                            <p id="tourCountry" class="text-yellow-600 font-medium text-sm hover:underline">
                                <a href="#">${tour.country}</a>
                            </p>
                            </div>
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

                        
                        <button id="addSelect-${tour.id}" class="btn-primary mt-4 text-sm">В избранное</button>
                        <button id="deleteSelect-${tour.id}" class="hidden btn-primary mt-4 text-sm">Отменить</button>
                        <button id="openModalButton-${tour.id}" class="btn-primary mt-4 text-sm">Забронировать</button>
                        
                    </div>
            </div>
        `
    })

    tours.forEach((tour) => {
        //проходим по каждому элементу массива

        document
        //ищем нужный тур по id
            .getElementById(`openModalButton-${tour.id}`)
            .addEventListener("click", () => 
            modalOrder(tour.id)) //если нажали на кнопку, модальное окно открывается
            
    })
    }

    tours.forEach((tour) => {
        document
        .getElementById(`addSelect-${tour.id}`)
        .addEventListener("click", () => 
        selectedTours(tour.id))
    })

    tours.forEach((tour) => {
        document
        .getElementById(`deleteSelect-${tour.id}`)
        .addEventListener("click", () => 
        selectedTours(tour.id))
    })

}

//делаем блок с фильтрацией

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

    if (minPrice || maxPrice) {
        const filteredTours = tours.filter((tour) => {
            if (minPrice && maxPrice) {
                return tour.price <= maxPrice && tour.price >= minPrice
            } else if (maxPrice) {
                return tour.price <= maxPrice
            } else if (minPrice) {
                return tour.price >= minPrice
            } 
        })
        renderTours(filteredTours)
    } else {
        renderTours(tours)
    }

    document.getElementById("minPrice").value = ""
    document.getElementById("maxPrice").value = ""
}

//делаем блок с бронированием туров

let indexId; 
async function modalOrder(id) {

    const response = await fetch('https://www.bit-by-bit.ru/api/student-projects/tours');
    const tours = await response.json();

    document.getElementById('add-modal').style.display = "flex";
    let span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        document.getElementById('add-modal').style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == document.getElementById('add-modal')) {
            document.getElementById('add-modal').style.display = "none";
        }
    }

    const tour = tours.find(t => t.id === id)
    let city = getCity(tour)

    document.getElementById("add-modal-cards").innerHTML = " ";
    document.getElementById("add-modal-cards").innerHTML +=
        `
        <div>
            <div>
                <img class="h-96 w-full rounded-md" src="${tour.image}" alt="" />
            </div>

            <div class="p-6">

                <div class="flex justify-between">
                        <div id="tourCountry" class="text-yellow-600 font-medium text-sm hover:underline">
                            <p>Тур № ${tour.id}</p>
                            <p>${tour.country}</p>
                        </div>
                </div>

            
                    <p id="tourCity" class="font-semibold mt-3 text-xl"> ${city}</p>
                    <p class="text-gray-500 mt-3"> ${tour.hotelName}</p>

                    <div class="mt-3 text-gray-500 text-sm flex items-center">
                        <img class="h-4" src="https://img.icons8.com/ios/50/null/christmas-star.png"/>

                        <span class="ml-1">${tour.rating}</span>
                        <span aria-hidden="true" class="mx-2">&middot;</span>

                        <img class="h-5" src="https://img.icons8.com/ios/50/null/ruble.png"/>

                        <span class="ml-1">${tour.price}</span>
                    </div>
                    </br>
                    <div id='container_error' class="text-yellow-600 font-medium text-lg text-center"></div>

            </div>
        </div>
               
        `
    indexId = id;
}

//передаем выбранные туры для бронирования на сервер

async function getOrder(event) {

    //отменяем стандартное поведение браузера при работе с form
    event.preventDefault()
    
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const mail = document.getElementById('email').value
    const comment = document.getElementById('comment').value

    const containerError = document.getElementById('container_error')
    containerErrorName = document.getElementById('container_error_name')
    containerErrorPhone = document.getElementById('container_error_phone')
    containerErrorEmail = document.getElementById('container_error_email')

    if (!name) {
        containerErrorName.innerHTML += '<p class="text-red-500 mb-2">Введите, пожалуйста, ваше имя</p>'
        return
    }

    if (!phone) {
        containerErrorPhone.innerHTML += '<p class="text-red-500 mb-2">Введите, пожалуйста, ваш телефон</p>'
        return
    }

    if (!mail) {
        containerErrorEmail.innerHTML += '<p class="text-red-500 mb-2">Введите, пожалуйста, ваш e-mail</p>'
        return
    }

    function clearValue() {
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("comment").value = "";
    }

    clearValue()

    const params = {
        customerName: name,
        phone: phone,
        email: mail,
        description: comment
    };
    
    const url = `https://www.bit-by-bit.ru/api/student-projects/tours/${indexId}`;

    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(params)
    })
    
    try {
        let data = await response.json()

        if (data.id) {
            containerError.innerHTML = 'Спасибо. Ваша заявка принята в работу'
        };

    } catch (error) {
        containerError.innerHTML += 'Упс, что-то пошло не так...'
        
    }
}

// делаем блок с добавлением туров в избранное

function selectedTours(tours) {
    const container2 = document.getElementById("container")

    if (tours.length === 0) {
        container2.innerHTML = 'Извините, туры не найдены. <br> Повторите попытку'
    } else {
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
                   
                    <div>
                    <img class="h-96 w-full" src="${tour.image}" alt="" />
                    </div>
                    
                    <div class="p-6">
                        <div>
                            <div class="flex justify-between">
                            <p id="tourCountry" class="text-yellow-600 font-medium text-sm hover:underline">
                                <a href="#">${tour.country}</a>
                            </p>
                            </div>
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

                        <button id="deleteSelect-${tour.id}" class="btn-primary mt-4 text-sm">Отменить</button>
                        <button id="openModalButton-${tour.id}" class="btn-primary mt-4 text-sm">Забронировать</button>
                        
                    </div>
            </div>
        `
    })

    tours.forEach((tour) => {
        document
        .getElementById(`deleteSelect-${tour.id}`)
        .addEventListener("click", () => 
        delSelect(tour.id))
    })
    }
}

function delSelect(id) {
    let result = Select.find(res => res.id === id)
    let index = Select.indexOf(result);
    Select.splice(index, 1);
    renderFavs(Select)

    if (Select.length == 0) {
        document.getElementById("container").style.display = "flex"
        document.getElementById('container').innerHTML = ''
        document.getElementById('container').innerHTML += `
        <div class="flex justify-center flex-col items-center m-auto">
        <img src="https://www.pngplay.com/wp-content/uploads/12/Sad-Cat-Meme-Transparent-PNG.png">
  <p class="text-slate-600 text-2xl">Пока что тут пусто :( </p>
        </div>
    `
    }
    workJson()
}


function checkSelectedTours() {
    if (Select.length != 0) {
        renderselectedTours(favTours)
        workJson()
    } else {

        document.getElementById("container").style.display = "flex"
        document.getElementById('container').innerHTML = ''
        document.getElementById('container').innerHTML += `
            <div class="flex justify-center flex-col items-center m-auto">
            <img src="https://www.pngplay.com/wp-content/uploads/12/Sad-Cat-Meme-Transparent-PNG.png">
      <p class="text-slate-600 text-2xl">Пока что тут пусто :( </p>
            </div>
        `
        workJson()
    }
}

let Select = [];

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

    const form = document.getElementById('form');
    form.addEventListener('submit', getOrder);

}

init()


