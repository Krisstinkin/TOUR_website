

async function makeTour() {

    const response = await fetch('https://www.bit-by-bit.ru/api/student-projects/tours')
    const data = await response.json()

    const tour = data.tour

    console.log(data)
    
    const container2 = document.getElementById('container'); //находим в HTML контейнер для новых туров

    function renderTours() {

            //данная функция визуализирует наши туры
            
        container2.innerHTML = ""; //пустой контейнер

        data.forEach((tour) => {
        
            //добавляем в HTML контейнер, в котором описаны значения туров

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

        // function getCity(tourCityNull) {
        //     let checkCity = document.getElementById('tour.city');
        //     if (tourCityNull) {
        //         checkCity = ${tour.city};
        //     } else {
        //         checkCity = ${tour.country};
        //     }
        //     return checkCity
        // }

      

    }

    renderTours()
}    

makeTour()
