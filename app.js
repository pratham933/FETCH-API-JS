const searchInput = document.getElementById("searchInput"); 
const Cards = document.getElementById("Cards");

let productsList = [];


fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
        productsList = data.products; 
        showProducts(productsList);
    })
    .catch(error => console.error("Error fetching products:", error));

function showProducts(products) {
    Cards.innerHTML = "";

    products.forEach(product => { 
       
        const imageUrl = product.thumbnail;

        Cards.innerHTML += `
          <div class="col-md-4 col-sm-6 mb-4">
            <div class="card product-card h-100 border-0 shadow-sm">
              <img src="${imageUrl}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
              <div class="card-body d-flex flex-column">
                <span class="badge bg-secondary w-auto align-self-start mb-2">${product.category}</span>
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text text-muted flex-grow-1">${product.description ? product.description.substring(0, 80) : ''}...</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <span class="fs-5 fw-bold text-dark">$${product.price}</span>
                 <a href="details.html?id=${product.id}" class="btn btn-primary btn-sm px-3">View Details</a>
                </div>
              </div>
            </div>
          </div>
        `;
    });
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase().trim();

        const filterProducts = productsList.filter(product =>
            product.title.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );

        showProducts(filterProducts);
    });
}


// ----------------single product display on a screen--------------------


const container = document.getElementById("product-details-container");


const url = new URLSearchParams(window.location.search);
const productId = url.get("id");

fetchSingleProduct(productId);

async function fetchSingleProduct(id) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        
        const product = await response.json();
        renderProductDetails(product);
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger text-center">${error.message}. <a href="index.html" class="alert-link">Return to Home</a></div>`;
    }
}

// Render Details UI
function renderProductDetails(product) {
    const imagesList = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

    container.innerHTML = `
        <div class="row g-4">
            <!-- Image Gallery Column -->
            <div class="col-md-6 text-center border-end pe-md-4">
                <div class="p-3 bg-white rounded border mb-3">
                    <img id="mainImage" src="${product.thumbnail}" class="img-fluid object-fit-contain" style="max-height: 350px;" alt="${product.title}">
                </div>
                
                <div class="d-flex gap-2 justify-content-center flex-wrap">
                    ${imagesList.map(img => `
                        <img src="${img}" class="img-thumbnail object-fit-cover pe-auto" style="width: 65px; height: 65px; cursor: pointer;" onclick="changeMainImage('${img}')" alt="Thumbnail">
                    `)}
                </div>
            </div>

            <!-- Content Details Column -->
            <div class="col-md-6 d-flex flex-column justify-content-between ps-md-4">
                <div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary fs-6">${product.category}</span>
                        <span class="text-secondary">Brand: <strong class="text-dark">${product.brand || 'Generic'}</strong></span>
                    </div>

                    <h2 class="fw-bold mb-3">${product.title}</h2>
                    <p class="text-secondary lh-base mb-4">${product.description}</p>
                    
                    <div class="mb-3 d-flex align-items-center gap-2">
                        <span class="fs-2 fw-bold text-success">$${product.price}</span>
                        <span class="badge bg-danger fs-6">${product.discountPercentage}% OFF</span>
                    </div>

                    <div class="mb-4">
                        <span class="text-warning fs-5">★</span> 
                        <strong class="fs-5">${product.rating}</strong> <span class="text-secondary">/ 5</span>
                    </div>

                    <ul class="list-group list-group-flush mb-4 border-top border-bottom">
                        <li class="list-group-item bg-transparent px-0 d-flex justify-content-between">
                            <strong>Availability:</strong> 
                            ${product.stock > 0 ? `<span class="text-success fw-semibold">In Stock (${product.stock} units)</span>` : `<span class="text-danger fw-semibold">Out of Stock</span>`}
                        </li>
                        <li class="list-group-item bg-transparent px-0 d-flex justify-content-between">
                            <strong>SKU:</strong> <span class="text-secondary">${product.sku || 'N/A'}</span>
                        </li>
                        <li class="list-group-item bg-transparent px-0 d-flex justify-content-between">
                            <strong>Warranty:</strong> <span class="text-secondary">${product.warrantyInformation || 'Standard Warranty'}</span>
                        </li>
                        <li class="list-group-item bg-transparent px-0 d-flex justify-content-between">
                            <strong>Shipping:</strong> <span class="text-secondary">${product.shippingInformation || 'Standard Shipping'}</span>
                        </li>
                    </ul>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn btn-success btn-lg flex-grow-1 fw-semibold">Buy Now</button>
                    <a href="index.html" class="btn btn-outline-secondary btn-lg">Back</a>
                </div>
            </div>
        </div>
    `;
}

// Change Main Gallery Image
function changeMainImage(src) {
    document.getElementById("mainImage").src = src;
}
