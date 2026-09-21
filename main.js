
// JSONPlaceholder: API de prueba ( https://jsonplaceholder.typicode.com/posts ).

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10;

// const start = (currentPage - 1) * itemsPerPage;
// const end = start + itemsPerPage;
// const itemsToShow = data.slice(start, end);


/* =========== REFERÉNCIA AL DOM =========== */

const apiSelector = document.getElementById("apiSelector");
const searchInput = document.getElementById("searchInput");
const fetchButton = document.getElementById("getDataButton");

const loadingElement = document.getElementById("loadingMessage");
const errorElement = document.getElementById("errorMessage");

const resultsContainer = document.getElementById("results");
const paginationContainer = document.getElementById("pagination");

// Event Listener boton "obtener datos" // (fetchButton para llamar a fetchData)

fetchButton.addEventListener("click", fetchData);


// PRUEBA ***********************************************************************
// const datosDePrueba = [
//     { title: "Título 1", body: "Texto del post 1" },
//     { title: "Título 2", body: "Texto del post 2" },
//     { title: "Título 3", body: "Texto del post 3" }
// ];

// displayResults(datosDePrueba, datosDePrueba.length);
// FIN PRUEBA ******************************************************************


/* =========== funciones de estado =========== */
function showLoading() {
    loadingElement.classList.remove("hidden"); /* ESTADO */
}

function hideLoading() {
    loadingElement.classList.add("hidden");
}

function showError(message) { //element.classList["hidden", "error", "3"]
    // element.style.display = "none";
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
}

function hideError() {
    errorElement.classList.add("hidden");
}

/* ===== FUNCION PRINCIPAL ===== */
async function fetchData() {
    const searchTerm = searchInput.value.trim();
    const noSelect = apiSelector.value === "0";
    const useAxios = apiSelector.value === "axios";
    // const usefetch = apiSelector.value === "fetch";


    if (noSelect) { showError('Debes elegir herramienta: >>Axios o >>Fetch'); return; }

    if (searchTerm === "") { showError('Debes escribir el la barra'); return; }

    showLoading();
    hideError();

    try {
        if (useAxios) {
            fetchDataWithAxios(searchTerm);
        } else {
            fetchDataWithFetch(searchTerm);
        }
    } catch (error) {
        showError("Error inesperado");
    } finally {
        hideLoading();
    }
}

/* ===== VISUALIZAR Y PAG ===== */
function displayResults(items, totalItems) {
    // items = una caja con muchas cartas
    // forEach = sacar una carta cada vez
    // createElement("div") = crear un marco para esa carta
    // innerHTML = escribir el contenido dentro del marco
    // appendChild = colgar el marco en la pared (resultsContainer)

    clearInput();

    /* ===== BUSQUEDA ===== */
    items.forEach(item => {
        console.log("Prueba item:", item.title);

        const card = document.createElement("div");
        // card.classList.add("card"); // opcional, si tienes estilos

        card.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.body}</p>
        `;

        resultsContainer.appendChild(card);
    });

    setupPagination(totalItems);
}

function setupPagination(totalItems) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage); // calcula pág total

    // << ANTERIOR
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Anterior";

        prevButton.addEventListener("click", () => {
            currentPage--;
            fetchData(); // vuelve a cargar datos
        });

        paginationContainer.appendChild(prevButton);
    }

    // >> SIGUIENTE
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Siguiente";

        nextButton.addEventListener("click", () => {
            currentPage++;
            fetchData(); // vuelve a cargar datos
        });

        paginationContainer.appendChild(nextButton);
    }
}

// ============= Fetch ============ */
async function fetchDataWithFetch(searchTerm) {
    try {
        // 1. Petición a la API con paginación y búsqueda
        const response = await fetch(
            `${API_URL}?_page=${currentPage}&_limit=${itemsPerPage}&q=${searchTerm}`);

        // 2. Comprobar si la respuesta HTTP es correcta 
        if (!response.ok) { // .ok Este lo generas tú para manejar errores HTTP.
            throw new Error(`Error HTTP ${response.status}`); //Status = 404...
        } 

        // 3. Leer el JSON (array de posts ya filtrados y paginados)
        const data = await response.json();
        
        // 4. Leer el total de elementos desde el header
        const totalItems = response.headers.get("X-Total-Count");

        // 5. Llamar a displayResults, imprime lo que encuentra
        displayResults(data, totalItems);

    } catch (error) {
        showError("Error al obtener datos con Fetch:"+ error.message);
        //.message es una propiedad del objeto Error.
        //console.log(error);
        //error interno de Fetch o de código: sintaxis, conexion, 
    }
}

// ============= Axios ============ */
async function fetchDataWithAxios(searchTerm) {
    try {
        // 1. Petición GET con Axios usando params
        const response = await axios.get(API_URL, {
            params: {
                _page: currentPage,
                _limit: itemsPerPage,
                q: searchTerm
            }
        });

        // 2. Axios lanza error automáticamente si el status es 4xx o 5xx
        //    Así que no hace falta comprobar response.ok

        // 3. Datos ya vienen parseados (Axios hace JSON.parse por ti)
        const data = response.data;

        // 4. Leer el total desde headers (igual que Fetch)
        const totalItems = response.headers["x-total-count"];

        // 5. Mostrar resultados
        displayResults(data, totalItems);

    } catch (error) {
        // Axios tiene su propio objeto error
        const message = error.response
            ? `Error HTTP ${error.response.status}: ${error.response.statusText}`
            : error.message;

        showError("Error al obtener datos con Axios: " + message);
    }
}


function clearInput() {
    resultsContainer.innerHTML = "";
}
