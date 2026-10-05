
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10;

const apiSelector = document.getElementById("apiSelector");
const searchInput = document.getElementById("searchInput");
const fetchButton = document.getElementById("getDataButton");

const loadingElement = document.getElementById("loadingMessage");
const errorElement = document.getElementById("errorMessage");

const resultsContainer = document.getElementById("results");
const paginationContainer = document.getElementById("pagination");

// fetchButton.addEventListener("click", fetchData); //ERROR: actualiza desde la pagina que estes y no vuelve a pag 1 auto
fetchButton.addEventListener("click", startSearch); //reinicia pag

function startSearch() {
    currentPage = 1;
    fetchData();
}


function showLoading() {
    loadingElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
}
function hideLoading() {
    loadingElement.classList.add("hidden");
}

function showError(message) {
    hideLoading();
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
}

function hideError() {
    errorElement.classList.add("hidden");
}

async function fetchData() {
    const searchTerm = searchInput.value.trim();
    const noSelect = apiSelector.value === "0";
    const useAxios = apiSelector.value === "axios";

    showLoading();
    hideError();

    if (noSelect) { showError('Debes elegir herramienta: [Axios] o [Fetch]'); return; }

    if (searchTerm === "") { showError('Debes escribir el la barra'); return; }

    try {
        if (useAxios) {
            await fetchDataWithAxios(searchTerm);
        } else {
            await fetchDataWithFetch(searchTerm);
        }
    } catch (error) {
        showError("Error inesperado");
    } finally {
        hideLoading();
    }
}

function displayResults(items, totalItems) {

    clearInput();

    if (items.length === 0) {
        showError(`No se ha encontrado "${searchInput.value}"`);
        return;
    }

    items.forEach(item => {
        console.log("Prueba item:", item.title);

        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h4");
        title.textContent = item.title;

        const body = document.createElement("p");
        body.textContent = item.body;

        card.append(title, body);
        resultsContainer.appendChild(card);
    });

    setupPagination(totalItems);
}

function setupPagination(totalItems) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;

        prevButton.addEventListener("click", () => {
            currentPage--;
            fetchData(); // vuelve a cargar datos
        });

        paginationContainer.appendChild(prevButton);
    }

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    pageInfo.classList.add("page-info");
    paginationContainer.appendChild(pageInfo);

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;

        nextButton.addEventListener("click", () => {
            currentPage++;
            fetchData(); // vuelve a cargar datos
        });

        paginationContainer.appendChild(nextButton);
    }
}

async function fetchDataWithFetch(searchTerm) {
    try {
        const response = await fetch(
            `${API_URL}?_page=${currentPage}&_limit=${itemsPerPage}&q=${searchTerm}`);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        const totalItems = response.headers.get("X-Total-Count");

        displayResults(data, totalItems);

    } catch (error) {
        showError("Error al obtener datos con Fetch:" + error.message);
    }
}

async function fetchDataWithAxios(searchTerm) {
    try {
        const response = await axios.get(API_URL, {
            params: {
                _page: currentPage,
                _limit: itemsPerPage,
                q: searchTerm
            }
        });


        const data = response.data;

        const totalItems = response.headers["x-total-count"];

        displayResults(data, totalItems);

    } catch (error) {
        const message = error.response
            ? `Error HTTP ${error.response.status}: ${error.response.statusText}`
            : error.message;

        showError("Error al obtener datos con Axios: " + message);
    }
}

function clearInput() {
    resultsContainer.innerHTML = "";
}
