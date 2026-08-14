const productsContainer =
    document.getElementById("productsContainer");

const productsMessage =
    document.getElementById("productsMessage");


const loadProducts = async () => {

    try {

        const { response, data } =
            await apiRequest("/products");

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
            "No products available.";

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "bg-slate-900 border border-slate-800 " +
            "rounded-2xl overflow-hidden " +
            "hover:border-cyan-400/50 transition";


        card.innerHTML = `

            <div class="h-52 bg-slate-800 flex items-center justify-center">

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
                    ${product.description || "No description available."}
                </p>


                <div class="flex items-center justify-between mb-4">

                    <span class="text-cyan-400 text-xl font-bold">
                        ₦${Number(product.price).toLocaleString()}
                    </span>


                    <span class="text-sm ${
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


                <button
                    class="add-to-cart w-full py-3 rounded-lg
                           bg-cyan-500 text-slate-950
                           font-semibold
                           hover:bg-cyan-400 transition
                           ${
                               product.stock <= 0
                               ? "opacity-50 cursor-not-allowed"
                               : ""
                           }"

                    data-product-id="${product.id}"

                    ${product.stock <= 0 ? "disabled" : ""}>

                    ${
                        product.stock > 0
                        ? "Add to Cart"
                        : "Out of Stock"
                    }

                </button>

            </div>

        `;


        productsContainer.appendChild(card);

    });

};


loadProducts();

productsContainer.addEventListener("click", async (event) => {

    const button = event.target.closest(".add-to-cart");

    if (!button) {
        return;
    }

    const productId = button.dataset.productId;

    try {

        button.disabled = true;
        button.textContent = "Adding...";

        const { response, data } = await apiRequest(
            "/cart",
            {
                method: "POST",

                body: JSON.stringify({
                    product_id: Number(productId),
                    quantity: 1
                })
            }
        );

        if (!response.ok) {

            alert(data.message || "Unable to add product to cart.");

            button.disabled = false;
            button.textContent = "Add to Cart";

            return;
        }

        button.textContent = "Added ✓";

        setTimeout(() => {
            button.disabled = false;
            button.textContent = "Add to Cart";
        }, 1500);

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

        button.disabled = false;
        button.textContent = "Add to Cart";
    }
});