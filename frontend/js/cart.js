const cartContainer =
    document.getElementById("cartContainer");

const cartMessage =
    document.getElementById("cartMessage");

const cartTotal =
    document.getElementById("cartTotal");

const cartItemCount =
    document.getElementById("cartItemCount");

const checkoutButton =
    document.getElementById("checkoutButton");


let cartItems = [];


const showMessage = (message, type = "error") => {

    cartMessage.classList.remove("hidden");

    cartMessage.classList.remove(
        "bg-red-500/10",
        "border-red-500/30",
        "text-red-400",
        "bg-green-500/10",
        "border-green-500/30",
        "text-green-400"
    );


    if (type === "success") {

        cartMessage.classList.add(
            "bg-green-500/10",
            "border",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        cartMessage.classList.add(
            "bg-red-500/10",
            "border",
            "border-red-500/30",
            "text-red-400"
        );
    }


    cartMessage.textContent = message;
};


const loadCart = async () => {

    try {

        const { response, data } =
            await apiRequest("/cart");

        if (!response.ok) {

            if (response.status === 404) {

                displayEmptyCart();

                return;
            }

            showMessage(
                data.message || "Unable to load cart."
            );

            return;
        }


        cartItems = data;

        displayCart(cartItems);

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );
    }
};


const displayEmptyCart = () => {

    cartContainer.innerHTML = `

        <div class="bg-slate-900
                    border border-slate-800
                    rounded-2xl p-10
                    text-center">

            <h2 class="text-2xl font-semibold mb-3">
                Your cart is empty
            </h2>

            <p class="text-slate-400 mb-6">
                Add some products before checking out.
            </p>

            <a href="products.html"
               class="inline-block px-6 py-3
                      rounded-lg bg-cyan-500
                      text-slate-950 font-semibold
                      hover:bg-cyan-400 transition">

                Browse Products

            </a>

        </div>

    `;


    cartTotal.textContent = "₦0";

    cartItemCount.textContent = "0";

    checkoutButton.disabled = true;

    checkoutButton.classList.add(
        "opacity-50",
        "cursor-not-allowed"
    );
};


const displayCart = (items) => {

    cartContainer.innerHTML = "";

    let total = 0;

    let itemCount = 0;


    items.forEach(item => {

        const subtotal =
            Number(item.price) * Number(item.quantity);

        total += subtotal;

        itemCount += Number(item.quantity);


        const cartItem =
            document.createElement("article");


        cartItem.className =
            "bg-slate-900 border border-slate-800 " +
            "rounded-2xl p-5";


       cartItem.innerHTML = `

            <div class="flex flex-col gap-5">

                <div class="flex flex-col sm:flex-row
                            sm:items-center
                            sm:justify-between gap-4">

                    <div>

                        <h2 class="text-xl font-semibold mb-2">
                            ${item.name}
                        </h2>

                        <p class="text-slate-400">
                            ₦${Number(item.price).toLocaleString()}
                            each
                        </p>

                    </div>


                    <div class="text-lg font-bold text-cyan-400">

                        ₦${subtotal.toLocaleString()}

                    </div>

                </div>


                <div class="flex flex-wrap
                            items-center
                            justify-between gap-4">

                    <!-- QUANTITY CONTROLS -->

                    <div class="flex items-center
                                border border-slate-700
                                rounded-lg overflow-hidden">

                        <button
                            class="decrease-quantity
                                px-4 py-2
                                bg-slate-800
                                hover:bg-slate-700
                                transition"

                            data-cart-id="${item.id}"
                            data-quantity="${item.quantity}">

                            -

                        </button>


                        <span class="px-5 py-2
                                    bg-slate-900
                                    min-w-[60px]
                                    text-center">

                            ${item.quantity}

                        </span>


                        <button
                            class="increase-quantity
                                px-4 py-2
                                bg-slate-800
                                hover:bg-slate-700
                                transition"

                            data-cart-id="${item.id}"
                            data-quantity="${item.quantity}">

                            +

                        </button>

                    </div>


                    <!-- REMOVE -->

                    <button
                        class="delete-cart-item
                            px-4 py-2 rounded-lg
                            border border-red-500/40
                            text-red-400
                            hover:bg-red-500/10
                            transition"

                        data-cart-id="${item.id}">

                        Remove

                    </button>

                </div>

            </div>

        `;


        cartContainer.appendChild(cartItem);

    });


    cartTotal.textContent =
        `₦${total.toLocaleString()}`;

    cartItemCount.textContent =
        itemCount;


    checkoutButton.disabled = false;

    checkoutButton.classList.remove(
        "opacity-50",
        "cursor-not-allowed"
    );
};

const updateQuantity = async (cartId, quantity) => {

    if (quantity < 1) {
        return;
    }

    try {

        const { response, data } =
            await apiRequest(
                `/cart/${cartId}`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        quantity
                    })
                }
            );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Unable to update quantity."
            );

            return;
        }


        await loadCart();

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );
    }
};

cartContainer.addEventListener(
    "click",
    async (event) => {

        /*
         * Increase quantity
         */

        const increaseButton =
            event.target.closest(".increase-quantity");


        if (increaseButton) {

            const cartId =
                increaseButton.dataset.cartId;

            const currentQuantity =
                Number(increaseButton.dataset.quantity);


            await updateQuantity(
                cartId,
                currentQuantity + 1
            );

            return;
        }


        /*
         * Decrease quantity
         */

        const decreaseButton =
            event.target.closest(".decrease-quantity");


        if (decreaseButton) {

            const cartId =
                decreaseButton.dataset.cartId;

            const currentQuantity =
                Number(decreaseButton.dataset.quantity);


            if (currentQuantity <= 1) {

                return;
            }


            await updateQuantity(
                cartId,
                currentQuantity - 1
            );

            return;
        }


        /*
         * Remove item
         */

        const deleteButton =
            event.target.closest(".delete-cart-item");


        if (!deleteButton) {
            return;
        }


        const cartId =
            deleteButton.dataset.cartId;


        try {

            deleteButton.disabled = true;

            deleteButton.textContent = "Removing...";


            const { response, data } =
                await apiRequest(
                    `/cart/${cartId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Unable to remove item."
                );

                deleteButton.disabled = false;

                deleteButton.textContent = "Remove";

                return;
            }


            await loadCart();


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );

            deleteButton.disabled = false;

            deleteButton.textContent = "Remove";
        }

    }
);


checkoutButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "checkout.html";

    }
);


loadCart();