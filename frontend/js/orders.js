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
            "rounded-2xl p-6";


        orderElement.innerHTML = `

            <div class="flex flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-5">

                <!-- ORDER INFORMATION -->

                <div>

                    <p class="text-sm
                              text-slate-500
                              mb-2">

                        Order #${order.id}

                    </p>


                    <h2 class="text-xl
                               font-semibold
                               mb-2">

                        ${order.name}

                    </h2>


                    <p class="text-slate-400">

                        ₦${Number(order.price).toLocaleString()}
                        ×
                        ${order.quantity}

                    </p>


                    <p class="text-sm
                              text-slate-500
                              mt-2">

                        ${new Date(
                            order.created_at
                        ).toLocaleString()}

                    </p>

                </div>


                <!-- ORDER STATUS / TOTAL -->

                <div class="flex flex-col
                            md:items-end
                            gap-3">


                    <!-- STATUS -->

                    <span class="inline-block
                                 px-3 py-1
                                 rounded-full
                                 text-sm
                                 ${getStatusClasses(
                                     order.status
                                 )}">

                        ${order.status}

                    </span>


                    <!-- TOTAL -->

                    <span class="text-xl
                                 font-bold
                                 text-cyan-400">

                        ₦${subtotal.toLocaleString()}

                    </span>


                    <!-- PAY NOW -->

                    ${
                        order.status === "pending"
                        ? `
                            <a
                                href="payment.html?orderId=${order.id}"
                                class="px-5 py-2
                                       rounded-lg
                                       bg-cyan-500
                                       text-slate-950
                                       font-semibold
                                       hover:bg-cyan-400
                                       transition
                                       text-center">

                                Pay Now

                            </a>
                          `
                        : ""
                    }

                </div>

            </div>

        `;


        ordersContainer.appendChild(orderElement);

    });
};


loadOrders();