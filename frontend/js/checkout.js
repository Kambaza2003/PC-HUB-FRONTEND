const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutItemCount =
    document.getElementById("checkoutItemCount");

const checkoutMessage =
    document.getElementById("checkoutMessage");

const completeCheckoutButton =
    document.getElementById("completeCheckoutButton");


const showMessage = (message, type = "error") => {

    checkoutMessage.classList.remove("hidden");

    checkoutMessage.classList.remove(
        "bg-red-500/10",
        "border-red-500/30",
        "text-red-400",
        "bg-green-500/10",
        "border-green-500/30",
        "text-green-400"
    );


    if (type === "success") {

        checkoutMessage.classList.add(
            "bg-green-500/10",
            "border",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        checkoutMessage.classList.add(
            "bg-red-500/10",
            "border",
            "border-red-500/30",
            "text-red-400"
        );
    }


    checkoutMessage.textContent = message;
};


const loadCheckout = async () => {

    try {

        const { response, data } =
            await apiRequest("/checkout");


        if (!response.ok) {

            if (response.status === 404) {

                checkoutItems.innerHTML = `

                    <div class="bg-slate-900
                                border border-slate-800
                                rounded-2xl p-10
                                text-center">

                        <h2 class="text-2xl font-semibold mb-3">
                            Your cart is empty
                        </h2>

                        <p class="text-slate-400 mb-6">
                            Add products to your cart before checkout.
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

                completeCheckoutButton.disabled = true;

                completeCheckoutButton.classList.add(
                    "opacity-50",
                    "cursor-not-allowed"
                );

                return;
            }


            showMessage(
                data.message ||
                "Unable to load checkout."
            );

            return;
        }


        displayCheckout(data);


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );
    }
};


const displayCheckout = (checkout) => {

    checkoutItems.innerHTML = "";


    checkout.items.forEach(item => {

        const itemElement =
            document.createElement("article");


        itemElement.className =
            "bg-slate-900 border border-slate-800 " +
            "rounded-2xl p-6";


        itemElement.innerHTML = `

            <div class="flex flex-col sm:flex-row
                        sm:items-center
                        sm:justify-between gap-4">

                <div>

                    <h2 class="text-xl font-semibold mb-2">
                        ${item.product_name}
                    </h2>

                    <p class="text-slate-400">
                        ₦${Number(item.price).toLocaleString()}
                        ×
                        ${item.quantity}
                    </p>

                </div>


                <div class="text-lg font-bold text-cyan-400">

                    ₦${Number(item.subtotal).toLocaleString()}

                </div>

            </div>

        `;


        checkoutItems.appendChild(itemElement);

    });


    checkoutTotal.textContent =
        `₦${Number(checkout.total).toLocaleString()}`;


    const itemCount =
        checkout.items.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );


    checkoutItemCount.textContent =
        itemCount;

};


const completeCheckout = async () => {

    try {

        completeCheckoutButton.disabled = true;

        completeCheckoutButton.textContent =
            "Processing...";


        const { response, data } =
            await apiRequest(
                "/checkout",
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Checkout failed."
            );

            completeCheckoutButton.disabled = false;

            completeCheckoutButton.textContent =
                "Complete Order";

            return;
        }


        showMessage(
            "Order created successfully!",
            "success"
        );


        completeCheckoutButton.textContent =
            "Order Completed";


        setTimeout(() => {

            window.location.href =
                "orders.html";

        }, 1500);


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );

        completeCheckoutButton.disabled = false;

        completeCheckoutButton.textContent =
            "Complete Order";
    }
};


completeCheckoutButton.addEventListener(
    "click",
    completeCheckout
);


loadCheckout();