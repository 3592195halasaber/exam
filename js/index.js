
const size = $('.item1 .list').outerWidth(true);
let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");


$(document).ready(() => {
    searchfirst("").then(() => {
        $(".spinner").fadeOut(500)
        $("body").css("overflow", "visible")

    })
})

$('.item1')
    .animate({ left: -size }, 1000)
let flag = true;
$('#open').on('click', function () {
    if (flag == true) {
        $('.item1').animate({ left: 0 }, 500)

        $(".open-close-icon").removeClass("fa-align-justify");
        $(".open-close-icon").addClass("fa-x");

        $(".link ul li").animate(
            { top: '0px' }
            , 800)

        return flag = false;
    } else {
        closenav()
    }
})

function closenav() {
    $('.item1').animate({ left: -size }, 500)
    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");

    $(".link ul li").animate({
        top: '300px'
    }, 1000)

    return flag = true;
}


//search
function displaySearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchfirst(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    rowData.innerHTML = ""
}
async function searchfirst(character) {
    closenav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let x = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${character}`)
    x = await x.json()

    x.meals ? displayMeals(x.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}
async function searchFLetter(character) {
    closenav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let x = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${character}`)
    x = await x.json()
    x.meals ? displayMeals(x.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}



//meals
function displayMeals(x) {
    let cartoona = "";

    for (let i = 0; i < x.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${x[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100 p-2 z-0" src="${x[i].strMealThumb}" alt="" >
                    <div class="layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${x[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    rowData.innerHTML = cartoona
}
async function getMealDetails(id) {
    closenav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";
    let x = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    x = await x.json();

    displayMealDetails(x.meals[0])
    $(".inner-loading-screen").fadeOut(300)

}
function displayMealDetails(meal) {
    searchContainer.innerHTML = "";
    let cartona = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            cartona += `<li class="alert alert-info m-2 p-1  ">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    /////
    let tags = meal.strTags?.split()
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1 ">${tags[i]}</li>`
    }



    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2  class="text-white">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <p class="">${meal.strInstructions}</p>
                <h3 class=""><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3 class=""><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3 class="">Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap ">
                    ${cartona}
                </ul>

                <h3 >Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a  href="${meal.strSource}" class="btn btn-success">Source</a>
                <a  href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = cartoona
}


//caregories
async function getCategories() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    searchContainer.innerHTML = "";

    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    data = await data.json()


    displayCategories(data.categories)
    $(".inner-loading-screen").fadeOut(300)

}
function displayCategories(x) {
    let cartoona = "";

    for (let i = 0; i < x.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${x[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100 overflow-hidden" src="${x[i].strCategoryThumb}" >
                    <div class="layer position-absolute text-center text-black p-2">
                        <h3>${x[i].strCategory}</h3>
                        <p>${x[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}
async function getCategoryMeals(category) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    data = await data.json()
    displayMeals(data.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}


//areaa
async function getArea() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";

    let area = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    area = await area.json()
    console.log(area.meals);

    displayArea(area.meals)
    $(".inner-loading-screen").fadeOut(300)

}
function displayArea(place) {
    let cartoona = "";

    for (let i = 0; i < place.length; i++) {
        cartoona += `
        <div class="col-md-3 text-white">
                <div onclick="getAreaMeals('${place[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${place[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}

async function getAreaMeals(area) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let x = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    x = await x.json()


    displayMeals(x.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}

//ingredients

async function getIngredients() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";

    let x = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    x = await x.json()
    console.log(x.meals);

    displayIngredients(x.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}

async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let x = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    x = await x.json()


    displayMeals(x.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}
function displayIngredients(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3 text-white">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}






function showContacts() {

    rowData.innerHTML = `<form id="myForm">< div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" oninput="valied(this.value ,'nameAlert' , /^[A-Z][a-z]{3,8}$/ )" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" oninput="valied(this.value ,emailAlert ,/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/)" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" oninput="valied(this.value ,'phoneAlert' , /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput"  oninput="valied(this.value ,'ageAlert' , /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/)" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput"  oninput="valied(this.value ,'passwordAlert' , /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/ )" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
    <div class="col-md-6">
                <input  id="repasswordInput" oninput="valied(this.value ,'repasswordAlert' , /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/ )" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
   
        </div>
    
        <button id="submitButton"   class=" disabled btn btn-outline-danger px-2 mt-3" type="submit"  >Submit</button>
    </div>
</div> </form>`


}

//validation

function valied(inputValue, id, regx) {
    var x = regx
    if (x.test(inputValue)) {
        console.log('matched');
        document.getElementById(id).classList.add('d-none');
        // $('#submitBtn').removeClass('disabled')
        chieck()
        return true;
    } else {
        console.log('not matched');
        document.getElementById(id).classList.remove('d-none')
        return false;
    }

  
}


function chieck(){
if (
    valied(this.value ,'nameAlert' , /^[A-Z][a-z]{3,8}$/ )==true&&
    valied(this.value ,emailAlert ,/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/)==true &&
    valied(this.value ,'phoneAlert' , /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)==true&&
    valied(this.value ,'ageAlert' , /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/)==true&&
    valied(this.value ,'passwordAlert' , /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/ )==true&&
    valied(this.value ,'repasswordAlert' , /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/ )==true) {
    
       document.getElementById("submitButton").removeClass('disabled')
}
}
