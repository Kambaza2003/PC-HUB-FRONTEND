const API_URL = "https://e-commerce-fypt.onrender.com";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const adminMenu = document.getElementById("adminMenu");
const menuOverlay = document.getElementById("menuOverlay");

const productModal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
const searchProduct = document.getElementById("searchProduct");
const productTotal = document.getElementById("productTotal");

const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const addImageBtn = document.getElementById("addImageBtn");
const additionalImagesContainer = document.getElementById("additionalImagesContainer");

/* ================================
   ADDITIONAL PRODUCT IMAGES
================================ */

function addAdditionalImageField(value = "") {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "flex items-center gap-3";


    const input =
        document.createElement("input");

    input.type = "text";

    input.placeholder =
        "Image path or URL";

    input.value =
        value;

    input.className =
        "flex-1 px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 " +
        "focus:outline-none focus:border-cyan-400";


    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.textContent =
        "Remove";

    removeButton.className =
        "px-4 py-3 rounded-lg text-sm text-red-400 " +
        "hover:bg-red-500/10 transition";


    removeButton.addEventListener(
        "click",
        () => {

            wrapper.remove();

        }
    );


    wrapper.appendChild(input);

    wrapper.appendChild(removeButton);

    additionalImagesContainer.appendChild(wrapper);

}


addImageBtn.addEventListener(
    "click",
    () => {

        addAdditionalImageField();

    }
);

productImage.addEventListener("input", () => {

    const imagePath = productImage.value.trim();

    if (!imagePath) {
        imagePreviewContainer.classList.add("hidden");
        imagePreview.src = "";
        return;
    }

    imagePreview.src = imagePath;

    imagePreview.onload = () => {
        imagePreviewContainer.classList.remove("hidden");
    };

    imagePreview.onerror = () => {
        imagePreviewContainer.classList.add("hidden");
    };

});

let products = [];
let editingProductId = null;
let categories = [];

async function loadCategories() {

    try {

        const response = await fetch(`${API_URL}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load categories");
        }

        categories = data;

        const categorySelect = document.getElementById("productCategory");

        categorySelect.innerHTML = `
            <option value="">
                Select a category
            </option>
        `;

        categories.forEach(category => {

            const option = document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            categorySelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}


/* ADMIN MENU */

menuBtn.addEventListener("click", () => {
    adminMenu.classList.remove("-translate-x-full");
    menuOverlay.classList.remove("opacity-0", "pointer-events-none");
});

closeMenuBtn.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

function closeMenu() {
    adminMenu.classList.add("-translate-x-full");
    menuOverlay.classList.add("opacity-0", "pointer-events-none");
}


/* LOGOUT */

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});


/* LOAD PRODUCTS */

async function loadProducts() {
    try {

        const response = await fetch(`${API_URL}/products/with-category`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load products");
        }

        products = data;

        renderProducts(products);

    } catch (error) {

        console.error(error);

        productTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-red-400">
                    ${error.message}
                </td>
            </tr>
        `;

    }
}


/* DISPLAY PRODUCTS */

function renderProducts(data) {

    productTotal.textContent = `${data.length} product${data.length === 1 ? "" : "s"}`;

    if (data.length === 0) {

        productTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                    No products found.
                </td>
            </tr>
        `;

        return;
    }


    productTableBody.innerHTML = data.map(product => {

        return `
            <tr class="border-t border-slate-800 hover:bg-slate-950/50 transition">

                <td class="px-6 py-4">

                    <div class="flex items-center gap-4">

                        <img
                            src="${product.image || "img/placeholder.png"}"
                            alt="${product.name}"
                            class="w-14 h-14 rounded-lg object-cover bg-slate-800"
                        >

                        <div>

                            <p class="font-semibold">
                                ${product.name}
                            </p>

                            <p class="text-xs text-slate-500">
                                ID: ${product.id}
                            </p>

                        </div>

                    </div>

                </td>


                <td class="px-6 py-4 text-slate-300">
                    ${product.category_name || product.category_id || "N/A"}
                </td>


                <td class="px-6 py-4 text-cyan-400 font-semibold">
                    ₦${Number(product.price).toLocaleString()}
                </td>


                <td class="px-6 py-4">

                    <span class="${Number(product.stock) > 0 ? "text-emerald-400" : "text-red-400"}">

                        ${product.stock}

                    </span>

                </td>


                <td class="px-6 py-4">

                    <div class="flex items-center gap-2">

                        <button
                            onclick="editProduct(${product.id})"
                            class="px-3 py-2 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/10 transition">

                            Edit

                        </button>


                        <button
                            onclick="deleteProduct(${product.id})"
                            class="px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition">

                            Delete

                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");
}


/* SEARCH */

searchProduct.addEventListener("input", () => {

    const search = searchProduct.value.toLowerCase().trim();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(search)
    );

    renderProducts(filtered);

});


/* OPEN ADD MODAL */

addProductBtn.addEventListener("click", () => {

    editingProductId = null;

    document.getElementById("modalMode").textContent = "Add Product";
    document.getElementById("saveProductBtn").textContent = "Save Product";

    productForm.reset();

    imagePreview.src = "";

    imagePreviewContainer.classList.add(
        "hidden"
    );

    additionalImagesContainer.innerHTML = "";

    productModal.classList.remove("hidden");
    productModal.classList.add("flex");

});


/* CLOSE MODAL */

function closeModal() {

    productModal.classList.add("hidden");
    productModal.classList.remove("flex");

    productForm.reset();

    imagePreview.src = "";

    imagePreviewContainer.classList.add(
        "hidden"
    );

    additionalImagesContainer.innerHTML = "";

    editingProductId = null;
}

closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);


/* EDIT PRODUCT */

window.editProduct = async function(id) {

    const product = products.find(item => item.id === id);

    if (!product) {
        return;
    }

    editingProductId = id;

    document.getElementById("modalMode").textContent = "Edit Product";
    document.getElementById("saveProductBtn").textContent = "Update Product";

    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productImage").value = product.image || "";

    /* MAIN IMAGE PREVIEW */

    imagePreviewContainer.classList.add("hidden");

    if (product.image) {

        imagePreview.src = product.image;

        imagePreview.onload = () => {
            imagePreviewContainer.classList.remove("hidden");
        };

    }


    /* LOAD ADDITIONAL PRODUCT IMAGES */

    additionalImagesContainer.innerHTML = "";

    try {

        const response = await fetch(
            `${API_URL}/products/${id}/images`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const images = await response.json();

        if (!response.ok) {
            throw new Error(
                images.message || "Failed to load product images"
            );
        }


        images.forEach(image => {

            addAdditionalImageField(image.image);

        });


    } catch (error) {

        console.error(error);

    }


    /* CATEGORY */

    document.getElementById("productCategory").value =
        product.category_id || "";


    /* OPEN MODAL */

    productModal.classList.remove("hidden");
    productModal.classList.add("flex");

};


/* SAVE / UPDATE PRODUCT */

productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const additionalImages =
    Array.from(
        additionalImagesContainer.querySelectorAll("input")
    )
    .map(input => input.value.trim())
    .filter(image => image !== "");


const productData = {

    name: document.getElementById("productName").value.trim(),

    description: document.getElementById("productDescription").value.trim(),

    price: Number(document.getElementById("productPrice").value),

    stock: Number(document.getElementById("productStock").value),

    image: document.getElementById("productImage").value.trim(),

    category_id: Number(document.getElementById("productCategory").value),

    additionalImages

};

    try {

        const url = editingProductId
            ? `${API_URL}/products/${editingProductId}`
            : `${API_URL}/products`;

        const method = editingProductId ? "PUT" : "POST";


        const response = await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(productData)

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.message || "Operation failed");
        }


        alert(data.message);

        closeModal();

        loadProducts();


    } catch (error) {

        console.error(error);

        const message = document.getElementById("formMessage");

        message.textContent = error.message;

        message.className = "px-4 py-3 rounded-lg text-sm bg-red-500/10 text-red-400";

    }

});


/* DELETE PRODUCT */

window.deleteProduct = async function(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(`${API_URL}/products/${id}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.message || "Failed to delete product");
        }


        alert(data.message);

        loadProducts();


    } catch (error) {

        console.error(error);

        alert(error.message);

    }

};


/* INITIAL LOAD */

loadCategories();
loadProducts();