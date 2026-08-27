const productsContainer =
    document.getElementById("productsContainer");

const productsMessage =
    document.getElementById("productsMessage");

const searchButton =
    document.getElementById("searchButton");

const searchWrapper =
    document.getElementById("searchWrapper");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");

const sortFilter =
    document.getElementById("sortFilter");

const applyFiltersButton =
    document.getElementById("applyFiltersButton");

const clearFiltersButton =
    document.getElementById("clearFiltersButton");


let searchTimer;


/* ================================
   LOAD PRODUCTS
================================ */

const loadProducts = async (params = "") => {

    try {

        productsMessage.classList.add("hidden");

        const { response, data } =
            await apiRequest(`/products${params}`);


        if (!response.ok) {

            productsMessage.classList.remove("hidden");

            productsMessage.classList.add(
                "bg-red-500/10",
                "border",
                "border-red-500/30",
                "text-red-400"
            );

            productsMessage.textContent =
                data.message || "Unable to load products.";

            return;
        }


        displayProducts(data);

    } catch (error) {

        console.error(error);

        productsMessage.classList.remove("hidden");

        productsMessage.classList.add(
            "bg-red-500/10",
            "border",
            "border-red-500/30",
            "text-red-400"
        );

        productsMessage.textContent =
            "Unable to connect to the server.";
    }
};


/* ================================
   DISPLAY PRODUCTS
================================ */

const displayProducts = (products) => {

    productsContainer.innerHTML = "";


    if (products.length === 0) {

        productsMessage.classList.remove("hidden");

        productsMessage.classList.add(
            "bg-slate-900",
            "border",
            "border-slate-800",
            "text-slate-400"
        );

        productsMessage.textContent =
            "No products found.";

        return;
    }


    productsMessage.classList.add("hidden");


    products.forEach(product => {

        const card =
            document.createElement("article");


        card.className =
            "bg-slate-900 border border-slate-800 " +
            "rounded-2xl overflow-hidden " +
            "hover:border-cyan-400/50 transition";


        card.innerHTML = `

            <div class="h-52 bg-slate-800
                        flex items-center justify-center">

                ${
                    product.image

                    ? `
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="w-full h-full object-cover"
                        >
                    `

                    : `
                        <span class="text-slate-500">
                            No Image
                        </span>
                    `
                }

            </div>


            <div class="p-5">

                <h2 class="text-xl font-semibold mb-2">
                    ${product.name}
                </h2>


                <p class="text-slate-400 text-sm mb-4">
                    ${
                        product.description
                            ? product.description.length > 100
                                ? product.description.substring(0, 100) + "..."
                                : product.description
                            : "No description available."
                    }
                </p>


                <div
                    class="flex items-center
                           justify-between
                           mb-4">

                    <span
                        class="text-cyan-400
                               text-xl
                               font-bold">

                        ₦${Number(product.price).toLocaleString()}

                    </span>


                    <span
                        class="text-sm ${
                            product.stock > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }">

                        ${
                            product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"
                        }

                    </span>

                </div>


                <div class="flex gap-3">

                    <a
                        href="singleProduct.html?id=${product.id}"
                        class="flex-1
                            text-center
                            py-3
                            rounded-lg
                            border border-slate-700
                            text-slate-300
                            font-semibold
                            hover:border-cyan-400
                            hover:text-cyan-400
                            transition">

                        View Product

                    </a>


                    <button
                        class="add-to-cart
                            flex-1
                            py-3
                            rounded-lg
                            bg-cyan-500
                            text-slate-950
                            font-semibold
                            hover:bg-cyan-400
                            transition
                            ${
                                product.stock <= 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }"

                        data-product-id="${product.id}"

                        ${
                            product.stock <= 0
                            ? "disabled"
                            : ""
                        }>

                        ${
                            product.stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"
                        }

                    </button>

                </div>

            </div>

        `;


        productsContainer.appendChild(card);

    });

};


/* ================================
   APPLY SEARCH AND FILTERS
================================ */

const applyFilters = () => {

    const params =
        new URLSearchParams();


    const search =
        searchInput.value.trim();


    if (search) {

        params.append(
            "search",
            search
        );

    }


    const category =
        categoryFilter.value;


    if (category) {

        params.append(
            "category",
            category
        );

    }


    const minimumPrice =
        minPrice.value;


    if (minimumPrice) {

        params.append(
            "minPrice",
            minimumPrice
        );

    }


    const maximumPrice =
        maxPrice.value;


    if (maximumPrice) {

        params.append(
            "maxPrice",
            maximumPrice
        );

    }


    const sort =
        sortFilter.value;


    if (sort) {

        params.append(
            "sort",
            sort
        );

    }


    const queryString =
        params.toString();


    loadProducts(
        queryString
            ? `?${queryString}`
            : ""
    );
};


/* ================================
   LOAD CATEGORIES
================================ */

const loadCategories = async () => {

    try {

        const { response, data } =
            await apiRequest("/categories");


        if (!response.ok) {

            console.error(
                data.message ||
                "Unable to load categories."
            );

            return;
        }


        categoryFilter.innerHTML = `
            <option value="">
                All Categories
            </option>
        `;


        data.forEach(category => {

            const option =
                document.createElement("option");


            option.value =
                category.id;


            option.textContent =
                category.name;


            categoryFilter.appendChild(
                option
            );

        });

    } catch (error) {

        console.error(
            "Unable to load categories:",
            error
        );

    }
};


/* ================================
   OPEN / CLOSE SEARCH
================================ */

searchButton.addEventListener(
    "click",
    () => {

        const isOpen =
            searchWrapper.classList.contains("w-64");


        if (isOpen) {

            searchWrapper.classList.remove(
                "w-64",
                "opacity-100"
            );

            searchWrapper.classList.add(
                "w-0",
                "opacity-0"
            );

            searchInput.value = "";

            applyFilters();

        } else {

            searchWrapper.classList.remove(
                "w-0",
                "opacity-0"
            );

            searchWrapper.classList.add(
                "w-64",
                "opacity-100"
            );

            setTimeout(() => {
                searchInput.focus();
            }, 300);

        }

    }
);


/* ================================
   LIVE SEARCH
================================ */

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(searchTimer);


        searchTimer =
            setTimeout(() => {

                applyFilters();

            }, 400);

    }
);


/* ================================
   ENTER SEARCH
================================ */

searchInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            clearTimeout(searchTimer);

            applyFilters();

        }

    }
);


/* ================================
   APPLY FILTERS BUTTON
================================ */

applyFiltersButton.addEventListener(
    "click",
    () => {

        applyFilters();

    }
);


/* ================================
   CLEAR FILTERS
================================ */

clearFiltersButton.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        categoryFilter.value = "";

        minPrice.value = "";

        maxPrice.value = "";

        sortFilter.value = "";


        loadProducts();

    }
);


/* ================================
   ADD TO CART
================================ */

productsContainer.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                ".add-to-cart"
            );


        if (!button) {

            return;

        }


        const productId =
            button.dataset.productId;


        try {

            button.disabled = true;

            button.textContent =
                "Adding...";


            const { response, data } =
                await apiRequest(
                    "/cart",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            product_id:
                                Number(productId),

                            quantity: 1
                        })
                    }
                );


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to add product to cart."
                );


                button.disabled = false;

                button.textContent =
                    "Add to Cart";


                return;

            }


            button.textContent =
                "Added ✓";


            setTimeout(() => {

                button.disabled = false;

                button.textContent =
                    "Add to Cart";

            }, 1500);


        } catch (error) {

            console.error(error);


            alert(
                "Unable to connect to the server."
            );


            button.disabled = false;

            button.textContent =
                "Add to Cart";

        }

    }
);


/* ================================
   INITIAL LOAD
================================ */
loadCategories();

loadProducts();