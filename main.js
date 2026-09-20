
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
        // 1. Obtener datos de la API
        const response = await fetch(API_URL);
        const data = await response.json();

        // 2. Filtrar por búsqueda
        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.body.toLowerCase().includes(searchTerm.toLowerCase())
            // hacer con ID o User
        );

        if (filtered.length === 0) {
            showError(`No se ha encontrado "${searchTerm}"`);
            clearInput();
            paginationContainer.innerHTML = "";
            return;
        }

        // 3. Calcular totalItems
        const totalItems = filtered.length;

        // 4. Calcular items de la página actual
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const itemsToShow = filtered.slice(start, end);

        // 5. Llamar a displayResults
        displayResults(itemsToShow, totalItems);

    } catch (error) {
        showError("Error al obtener datos con Fetch");
    }
}

// ============= Axios ============ */
async function fetchDataWithAxios(searchTerm) {
    // ... (Implementa la petició amb Axios)
}

function clearInput() {
    resultsContainer.innerHTML = "";
}

