const relatedProductsSection = 
    document.getElementById("relatedProductsSection");

const relatedProductsContainer = 
    document.getElementById("relatedProductsContainer");

const productContainer =
    document.getElementById("productContainer");

const loadingMessage =
    document.getElementById("loadingMessage");

const productMessage =
    document.getElementById("productMessage");

const productImage =
    document.getElementById("productImage");

const productImageGallery =
    document.getElementById("productImageGallery");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productStock =
    document.getElementById("productStock");

const productDescription =
    document.getElementById("productDescription");

const productCategory =
    document.getElementById("productCategory");

const productCategoryInfo =
    document.getElementById("productCategoryInfo");

const productAvailability =
    document.getElementById("productAvailability");

const productIdElement =
    document.getElementById("productId");

const quantityInput =
    document.getElementById("quantity");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");

const addToCartButton =
    document.getElementById("addToCartButton");


/* ================================
   GET PRODUCT ID
================================ */

const getProductId = () => {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
};


/* ================================
   SHOW MESSAGE
================================ */

const showMessage = (message) => {

    productMessage.classList.remove(
        "hidden"
    );

    productMessage.classList.add(
        "bg-red-500/10",
        "border",
        "border-red-500/30",
        "text-red-400"
    );

    productMessage.textContent =
        message;
};


/* ================================
   LOAD PRODUCT
================================ */

const loadProduct = async () => {

    const id = getProductId();


    if (!id) {

        loadingMessage.classList.add(
            "hidden"
        );

        showMessage(
            "No product was selected."
        );

        return;
    }


    try {

        const {
            response,
            data
        } = await apiRequest(
            `/products/${id}`
        );


        if (!response.ok) {

            loadingMessage.classList.add(
                "hidden"
            );

            showMessage(
                data.message ||
                "Unable to load product."
            );

            return;
        }


        displayProduct(data);

        loadRelatedProducts(data);


    } catch (error) {

        console.error(error);

        loadingMessage.classList.add(
            "hidden"
        );

        showMessage(
            "Unable to connect to the server."
        );

    }

};

/* ================================
   LOAD PRODUCT IMAGE GALLERY
================================ */

const loadProductImages = async (product) => {

    productImageGallery.innerHTML = "";

    /*
     * Add the main product image
     * as the first gallery image.
     */

    if (product.image) {

        createThumbnail(
            product.image,
            product.name,
            true
        );

    }


    try {

        const {
            response,
            data
        } = await apiRequest(
            `/product-images/${product.id}`
        );


        if (!response.ok) {

            return;

        }


        data.forEach(image => {

            createThumbnail(
                image.image,
                product.name,
                false
            );

        });


    } catch (error) {

        console.error(
            "Unable to load product images:",
            error
        );

    }

};


/* ================================
   CREATE IMAGE THUMBNAIL
================================ */

const createThumbnail = (
    imagePath,
    productName,
    active = false
) => {

    const thumbnail =
        document.createElement("button");

    thumbnail.type = "button";

    thumbnail.className =
        "w-24 h-24 " +
        "rounded-xl " +
        "border-2 " +
        "bg-slate-900 " +
        "overflow-hidden " +
        "transition " +
        "hover:border-cyan-400";


    if (active) {

        thumbnail.classList.add(
            "border-cyan-400"
        );

    } else {

        thumbnail.classList.add(
            "border-slate-800"
        );

    }


    thumbnail.innerHTML = `
        <img
            src="${imagePath}"
            alt="${productName}"
            class="w-full h-full object-contain p-2"
        >
    `;


    thumbnail.addEventListener(
        "click",
        () => {

            productImage.src =
                imagePath;

            productImage.alt =
                productName;


            const thumbnails =
                productImageGallery.querySelectorAll(
                    "button"
                );


            thumbnails.forEach(item => {

                item.classList.remove(
                    "border-cyan-400"
                );

                item.classList.add(
                    "border-slate-800"
                );

            });


            thumbnail.classList.remove(
                "border-slate-800"
            );

            thumbnail.classList.add(
                "border-cyan-400"
            );

        }
    );


    productImageGallery.appendChild(
        thumbnail
    );

};


/* ================================
   DISPLAY PRODUCT
================================ */

const displayProduct = async (product) => {

    loadingMessage.classList.add(
        "hidden"
    );

    productContainer.classList.remove(
        "hidden"
    );


    /* PRODUCT NAME */

    productName.textContent =
        product.name;


    /* PRICE */

    productPrice.textContent =
        `₦${Number(product.price).toLocaleString()}`;


    /* DESCRIPTION */

    productDescription.textContent =
        product.description ||
        "No description available.";

    /* IMAGE */

    if (product.image) {

        productImage.src =
            product.image;

        productImage.alt =
            product.name;

    } else {

        productImage.removeAttribute(
            "src"
        );

        productImage.alt =
            "No image available";

    }


    /*
    * Load product image gallery.
    */

    await loadProductImages(product);


    /* PRODUCT ID */

    productIdElement.textContent =
        product.id;


    /* CATEGORY */

    const categoryName =
        await getCategoryName(product.category_id);

    productCategoryInfo.textContent =
        categoryName;

    productCategory.textContent =
        `PC HUB • ${categoryName}`;


    /* STOCK */

    if (product.stock > 0) {

        productStock.textContent =
            `${product.stock} in stock`;

        productStock.className =
            "inline-flex px-4 py-2 rounded-full " +
            "text-sm font-semibold " +
            "bg-green-500/10 text-green-400";

        productAvailability.textContent =
            "Available";

        productAvailability.className =
            "font-medium text-green-400";

    } else {

        productStock.textContent =
            "Out of stock";

        productStock.className =
            "inline-flex px-4 py-2 rounded-full " +
            "text-sm font-semibold " +
            "bg-red-500/10 text-red-400";

        productAvailability.textContent =
            "Unavailable";

        productAvailability.className =
            "font-medium text-red-400";

        addToCartButton.disabled =
            true;

        addToCartButton.textContent =
            "Out of Stock";

    }


    /*
     * Limit quantity to available stock.
     */

    quantityInput.max =
        product.stock;


    /*
     * Store product ID and stock
     * for Add to Cart.
     */

    addToCartButton.dataset.productId =
        product.id;

};

/* ================================
   LOAD RELATED PRODUCTS
================================ */

const loadRelatedProducts = async (product) => {

    try {

        const { response, data } =
            await apiRequest(
                `/products?category=${product.category_id}`
            );


        if (!response.ok) {

            return;

        }


        const relatedProducts =
            data.filter(
                item => item.id !== product.id
            );


        if (relatedProducts.length === 0) {

            return;

        }


        relatedProductsContainer.innerHTML = "";


        relatedProducts
            .slice(0, 3)
            .forEach(item => {

                const card =
                    document.createElement("article");


                card.className =
                    "bg-slate-900 border border-slate-800 " +
                    "rounded-2xl overflow-hidden " +
                    "hover:border-cyan-400/50 transition";


                card.innerHTML = `

                    <div
                        class="h-48
                               bg-slate-800
                               flex items-center
                               justify-center">

                        ${
                            item.image

                            ? `
                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
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

                        <h3
                            class="text-lg
                                   font-semibold
                                   mb-2">

                            ${item.name}

                        </h3>


                        <p
                            class="text-cyan-400
                                   text-xl
                                   font-bold
                                   mb-4">

                            ₦${Number(
                                item.price
                            ).toLocaleString()}

                        </p>


                        <a
                            href="singleProduct.html?id=${item.id}"
                            class="block
                                   w-full
                                   text-center
                                   py-3
                                   rounded-lg
                                   border
                                   border-slate-700
                                   text-slate-300
                                   font-semibold
                                   hover:border-cyan-400
                                   hover:text-cyan-400
                                   transition">

                            View Product

                        </a>

                    </div>

                `;


                relatedProductsContainer
                    .appendChild(card);

            });


        relatedProductsSection
            .classList.remove("hidden");


    } catch (error) {

        console.error(
            "Unable to load related products:",
            error
        );

    }

};


/* ================================
   DECREASE QUANTITY
================================ */

decreaseQuantity.addEventListener(
    "click",
    () => {

        let quantity =
            Number(quantityInput.value);


        if (quantity > 1) {

            quantity--;

            quantityInput.value =
                quantity;

        }

    }
);


/* ================================
   INCREASE QUANTITY
================================ */

increaseQuantity.addEventListener(
    "click",
    () => {

        let quantity =
            Number(quantityInput.value);

        const max =
            Number(quantityInput.max);


        if (quantity < max) {

            quantity++;

            quantityInput.value =
                quantity;

        }

    }
);


/* ================================
   QUANTITY VALIDATION
================================ */

quantityInput.addEventListener(
    "change",
    () => {

        let quantity =
            Number(quantityInput.value);

        const max =
            Number(quantityInput.max);


        if (!Number.isInteger(quantity) ||
            quantity < 1) {

            quantity = 1;

        }


        if (max > 0 &&
            quantity > max) {

            quantity = max;

        }


        quantityInput.value =
            quantity;

    }
);


/* ================================
   ADD TO CART
================================ */

addToCartButton.addEventListener(
    "click",
    async () => {

        const productId =
            addToCartButton.dataset.productId;


        const quantity =
            Number(quantityInput.value);


        if (!productId) {

            showMessage(
                "Product information is missing."
            );

            return;

        }


        if (!quantity ||
            quantity < 1) {

            showMessage(
                "Please select a valid quantity."
            );

            return;

        }


        try {

            addToCartButton.disabled =
                true;

            addToCartButton.textContent =
                "Adding...";


            const {
                response,
                data
            } = await apiRequest(
                "/cart",
                {
                    method: "POST",

                    body: JSON.stringify({
                        product_id:
                            Number(productId),

                        quantity
                    })
                }
            );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Unable to add product to cart."
                );

                addToCartButton.disabled =
                    false;

                addToCartButton.textContent =
                    "Add to Cart";

                return;

            }


            addToCartButton.textContent =
                "Added ✓";


            setTimeout(() => {

                addToCartButton.disabled =
                    false;

                addToCartButton.textContent =
                    "Add to Cart";

            }, 1500);


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );

            addToCartButton.disabled =
                false;

            addToCartButton.textContent =
                "Add to Cart";

        }

    }
);


/* ================================
   INITIAL LOAD
================================ */
/* ================================
   GET CATEGORY NAME
================================ */

const getCategoryName = async (categoryId) => {

    try {

        const { response, data } =
            await apiRequest("/categories");

        if (!response.ok) {

            return `Category ${categoryId}`;

        }

        const category =
            data.find(
                category => category.id === categoryId
            );

        return category
            ? category.name
            : `Category ${categoryId}`;

    } catch (error) {

        console.error(
            "Unable to load category:",
            error
        );

        return `Category ${categoryId}`;
    }
};

loadProduct();