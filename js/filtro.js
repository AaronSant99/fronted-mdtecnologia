import { BASE_URL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const limit = 12;
  let page = 0; 
  let currentFilter = "all"; 
  const filtContainer = document.getElementById("filtcontiner");
  const paginationContainer = document.querySelector(".pagination");

  // Función para cargar productos con filtro y cambiar pagina
  function cargarProductos() {
    const offset = page * limit;
    fetch(`https://dummyjson.com/products?limit=${limit}&skip=${offset}&category=${currentFilter === "all" ? "" : currentFilter}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.products && data.products.length) {
          filtContainer.innerHTML = "";
          data.products.forEach((producto) => {
            const productoDiv = document.createElement("div");
            productoDiv.className = "col-lg-4 col-md-6";

            const imgSrc = producto.images && producto.images[0] ? producto.images[0] : "img/Imagen't.png";
            const price = producto.price ? `$${producto.price.toFixed(2)}` : "No disponible";

            productoDiv.innerHTML = `
              <div class="product-item bg-light mb-4">
                <div class="product-img position-relative overflow-hidden">
                  <img class="img-fluid w-100" src="${imgSrc}" alt="${producto.title}" style="width: 150px; height: 280px; object-fit: cover;" />
                </div>
                <div class="text-center py-4">
                  <a class="h6 text-decoration-none text-truncate" href="#">${producto.title}</a>
                  <div class="d-flex align-items-center justify-content-center mt-2">
                    <h5>${price}</h5>
                  </div>
                </div>
              </div>
            `;
            filtContainer.appendChild(productoDiv);
          });
        } else {
          filtContainer.innerHTML = "<p>No se encontraron productos.</p>";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un problema al cargar los productos. Intente nuevamente.");
      });
  }

  // Event para los filtros
  document.querySelector('button.btn-primary').addEventListener("click", () => {
    const selectedFilter = document.querySelector('input[name="type-filter"]:checked').value;
    currentFilter = selectedFilter;
    page = 0;
    cargarProductos();
  });

  // Event para cambio de pagina
  paginationContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && !e.target.parentElement.classList.contains("disabled")) {
      e.preventDefault();
      const action = e.target.textContent.trim();
      if (action === "Anterior" && page > 0) {
        page -= 1;
      } else if (action === "Siguiente") {
        page += 1;
      } else if (!isNaN(action)) {
        page = parseInt(action, 10) - 1;
      }
      cargarProductos();
    }
  });


  cargarProductos();
});
