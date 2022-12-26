async function makeTour() {

    const response = await fetch('https://www.bit-by-bit.ru/api/student-projects/tours')
    const data = await response.json()
    
    const container2 = document.getElementById('container'); 

    function renderTours() {
            
        container2.innerHTML = ""; 

        data.forEach((tour) => {

            container2.innerHTML += `
            
                <div class="bg-white shadow-lg rounded-lg overflow-hidden">

                        <img class="h-96 w-full" src="${tour.image}" alt="" />

                        <div class="p-6">
                            <div>
                                <p class="text-yellow-600 font-medium text-sm hover:underline">
                                    <a href="#">${tour.country}</a>
                                </p>
                                <a href="#">
                                    <p class="font-semibold mt-3 text-xl">${tour.city}</p>
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

                            <button class="btn-primary mt-4">Подробнее</button>

                        </div>
                </div>
            `
        });

        // const checkCity = document.getElementById('tour.city');
        // const checkCountry = document.getElementById('tour.country');

        // function getCity(checkCity) {
        //     let tourCityNull
            
        //     if (checkCity) {
        //         tourCityNull = checkCity;
        //     } else {
        //         tourCityNull = checkCountry;
        //     }
        //     return tourCityNull
        // }
       
    }

    
}    

renderTours()
makeTour()

function filterByCountry(tours, country) {
    if(country) {
        const filtredTours = tours.filter((tour) => {
            return tour.country === country
        })
            renderTours(filtredTours)
        }else {
            renderTours(tours)
    }

}

async function init() {
    const tours = await makeTour()
    renderTours(tours)

    document.getElementById('indonesia').addEventListener('click', () => filterByCountry(tours, 'Индонезия'))
    document.getElementById('thailand').addEventListener('click', () => filterByCountry(tours, 'Тайланд'))
    document.getElementById('maldives').addEventListener('click', () => filterByCountry(tours, 'Мальдивы'))
    document.getElementById('all').addEventListener('click', () => filterByCountry(tours))

}

init()