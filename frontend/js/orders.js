const ordersContainer =
    document.getElementById("ordersContainer");

const ordersMessage =
    document.getElementById("ordersMessage");


const showMessage = (message, type = "error") => {

    ordersMessage.classList.remove("hidden");

    ordersMessage.classList.remove(
        "bg-red-500/10",
        "border-red-500/30",
        "text-red-400",
        "bg-green-500/10",
        "border-green-500/30",
        "text-green-400"
    );

    if (type === "success") {

        ordersMessage.classList.add(
            "bg-green-500/10",
            "border",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        ordersMessage.classList.add(
            "bg-red-500/10",
            "border",
            "border-red-500/30",
            "text-red-400"
        );
    }

    ordersMessage.textContent = message;
};


const loadOrders = async () => {

    try {

        const {
            response,
            data
        } = await apiRequest("/orders");


        if (!response.ok) {

            if (response.status === 404) {

                displayEmptyOrders();

                return;
            }

            showMessage(
                data.message ||
                "Unable to load orders."
            );

            return;
        }


        displayOrders(data);

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );
    }
};


const displayEmptyOrders = () => {

    ordersContainer.innerHTML = `

        <div class="bg-slate-900
                    border border-slate-800
                    rounded-2xl
                    p-10
                    text-center">

            <h2 class="text-2xl font-semibold mb-3">
                No orders yet
            </h2>

            <p class="text-slate-400 mb-6">
                Your completed orders will appear here.
            </p>

            <a href="products.html"
               class="inline-block
                      px-6 py-3
                      rounded-lg
                      bg-cyan-500
                      text-slate-950
                      font-semibold
                      hover:bg-cyan-400
                      transition">

                Start Shopping

            </a>

        </div>

    `;
};


const getStatusClasses = (status) => {

    switch (status) {

        case "pending":

            return "bg-yellow-500/10 text-yellow-400";

        case "processing":

            return "bg-blue-500/10 text-blue-400";

        case "shipped":

            return "bg-purple-500/10 text-purple-400";

        case "delivered":

            return "bg-green-500/10 text-green-400";

        case "cancelled":

            return "bg-red-500/10 text-red-400";

        default:

            return "bg-slate-800 text-slate-400";
    }
};


const displayOrders = (orders) => {

    ordersContainer.innerHTML = "";


    orders.forEach(order => {

        const orderElement =
            document.createElement("article");


        const subtotal =
            Number(order.price) *
            Number(order.quantity);


        orderElement.className =
            "bg-slate-900 " +
            "border border-slate-800 " +
            "rounded-2xl " +
            "overflow-hidden " +
            "shadow-lg";


        orderElement.innerHTML = `

            <!-- HEADER -->

            <div class="px-6 py-5
                        flex flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                        border-b
                        border-slate-800">

                <div>

                    <p class="text-sm
                              text-slate-500
                              mb-1">

                        Order

                    </p>

                    <p class="text-lg
                              font-semibold
                              text-white">

                        #${order.id}

                    </p>

                </div>


                <!-- STATUS -->

                <span class="self-start
                             sm:self-auto
                             px-4
                             py-1.5
                             rounded-full
                             text-sm
                             font-medium
                             ${getStatusClasses(
                                 order.status
                             )}">

                    ${order.status}

                </span>

            </div>


            <!-- ORDER INFORMATION -->

            <div class="px-6 py-6">


                <div class="flex flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-6">


                    <!-- PRODUCT -->

                    <div class="min-w-0">

                        <p class="text-xs
                                  uppercase
                                  tracking-widest
                                  text-slate-500
                                  mb-2">

                            Product

                        </p>


                        <h2 class="text-xl
                                   md:text-2xl
                                   font-semibold
                                   text-white
                                   break-words">

                            ${order.name}

                        </h2>


                        <p class="text-slate-400
                                  mt-3">

                            ₦${Number(
                                order.price
                            ).toLocaleString()}

                            <span class="mx-2">
                                ×
                            </span>

                            ${order.quantity}

                        </p>

                    </div>


                    <!-- TOTAL -->

                    <div class="md:text-right
                                md:min-w-[200px]">

                        <p class="text-xs
                                  uppercase
                                  tracking-widest
                                  text-slate-500
                                  mb-2">

                            Total

                        </p>


                        <p class="text-2xl
                                  font-bold
                                  text-cyan-400">

                            ₦${subtotal.toLocaleString()}

                        </p>

                    </div>

                </div>


                <!-- DATE -->

                <div class="mt-6
                            pt-5
                            border-t
                            border-slate-800">

                    <p class="text-xs
                              uppercase
                              tracking-widest
                              text-slate-500
                              mb-1">

                        Ordered on

                    </p>


                    <p class="text-sm
                              text-slate-300">

                        ${new Date(
                            order.created_at
                        ).toLocaleString()}

                    </p>

                </div>

            </div>


            <!-- ACTION FOOTER -->

            <div class="px-6
                        py-5
                        bg-slate-950/40
                        border-t
                        border-slate-800">


                <div class="flex flex-col
                            sm:flex-row
                            sm:justify-end
                            gap-3">


                    <!-- VIEW DETAILS -->

                    <a
                        href="orderDetails.html?id=${order.id}"
                        class="w-full
                               sm:w-auto
                               min-w-[150px]
                               px-6
                               py-3
                               rounded-lg
                               bg-slate-800
                               border
                               border-slate-700
                               text-slate-200
                               font-semibold
                               text-center
                               hover:bg-slate-700
                               hover:border-slate-600
                               transition">

                        View Details

                    </a>


                    <!-- PAY NOW -->

                    ${
                        order.status === "pending"
                        ? `
                            <a
                                href="payment.html?orderId=${order.id}"
                                class="w-full
                                       sm:w-auto
                                       min-w-[150px]
                                       px-6
                                       py-3
                                       rounded-lg
                                       bg-cyan-500
                                       text-slate-950
                                       font-semibold
                                       text-center
                                       hover:bg-cyan-400
                                       transition">

                                Pay Now

                            </a>
                          `
                        : ""
                    }


                    <!-- CANCEL ORDER -->

                    ${
                        order.status === "pending"
                        ? `
                            <button
                                type="button"
                                class="cancel-order-btn
                                       w-full
                                       sm:w-auto
                                       min-w-[150px]
                                       px-6
                                       py-3
                                       rounded-lg
                                       bg-transparent
                                       text-red-400
                                       border
                                       border-red-500/40
                                       font-semibold
                                       hover:bg-red-500/10
                                       hover:border-red-500/60
                                       transition"
                                data-order-id="${order.id}">

                                Cancel Order

                            </button>
                          `
                        : ""
                    }

                </div>

            </div>

        `;


        ordersContainer.appendChild(orderElement);

    });


    /*
     * CANCEL ORDER BUTTONS
     */

    const cancelButtons =
        document.querySelectorAll(
            ".cancel-order-btn"
        );


    cancelButtons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const orderId =
                    button.dataset.orderId;


                const confirmed =
                    confirm(
                        "Are you sure you want to cancel this order?"
                    );


                if (!confirmed) {
                    return;
                }


                button.disabled = true;

                button.textContent =
                    "Cancelling...";


                try {

                    const {
                        response,
                        data
                    } = await apiRequest(
                        `/orders/${orderId}/cancel`,
                        {
                            method: "PUT"
                        }
                    );


                    if (!response.ok) {

                        showMessage(
                            data.message ||
                            "Unable to cancel order."
                        );

                        button.disabled = false;

                        button.textContent =
                            "Cancel Order";

                        return;
                    }


                    showMessage(
                        "Order cancelled successfully.",
                        "success"
                    );


                    await loadOrders();


                } catch (error) {

                    console.error(error);

                    showMessage(
                        "Unable to connect to the server."
                    );

                    button.disabled = false;

                    button.textContent =
                        "Cancel Order";

                }

            }
        );

    });

};

loadOrders();