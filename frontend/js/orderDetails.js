const orderDetailsContainer = document.getElementById("orderDetailsContainer");
const loadingMessage = document.getElementById("loadingMessage");
const orderMessage = document.getElementById("orderMessage");

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const showMessage = (message, type = "error") => {
    orderMessage.classList.remove(
        "hidden",
        "bg-red-500/10",
        "border-red-500/30",
        "text-red-400",
        "bg-green-500/10",
        "border-green-500/30",
        "text-green-400"
    );

    if (type === "success") {
        orderMessage.classList.add(
            "bg-green-500/10",
            "border",
            "border-green-500/30",
            "text-green-400"
        );
    } else {
        orderMessage.classList.add(
            "bg-red-500/10",
            "border",
            "border-red-500/30",
            "text-red-400"
        );
    }

    orderMessage.textContent = message;
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

const loadOrderDetails = async () => {
    if (!orderId) {
        loadingMessage.classList.add("hidden");
        showMessage("Order ID is missing.");
        return;
    }

    try {
        const { response, data } = await apiRequest(`/orders/${orderId}`);

        if (!response.ok) {
            loadingMessage.classList.add("hidden");
            showMessage(data.message || "Unable to load order details.");
            return;
        }

        displayOrderDetails(data);

    } catch (error) {
        console.error(error);

        loadingMessage.classList.add("hidden");
        showMessage("Unable to connect to the server.");
    }
};

const displayOrderDetails = (order) => {
    loadingMessage.classList.add("hidden");
    orderDetailsContainer.classList.remove("hidden");

    const subtotal =
        Number(order.price) * Number(order.quantity);

    orderDetailsContainer.innerHTML = `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <!-- Order Header -->
            <div class="p-5 sm:p-8 border-b border-slate-800">
                <div class="flex items-center justify-between gap-4">

                    <div>
                        <p class="text-sm text-slate-500 mb-1">
                            Order Number
                        </p>

                        <h2 class="text-2xl font-bold">
                            #${order.id}
                        </h2>
                    </div>

                    <span
                        class="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusClasses(order.status)}"
                    >
                        ${order.status}
                    </span>

                </div>
            </div>


            <!-- Product -->
            <div class="p-5 sm:p-8">

                <p class="text-sm text-slate-500 uppercase tracking-wider mb-5">
                    Product
                </p>


                <div class="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">

                    <!-- Product Image -->
                    <div class="w-full h-64 sm:h-72 bg-slate-800 flex items-center justify-center">

                        ${
                            order.image
                                ? `
                                    <img
                                        src="${order.image}"
                                        alt="${order.name}"
                                        class="w-full h-full object-contain"
                                    >
                                `
                                : `
                                    <span class="text-slate-500">
                                        No Image
                                    </span>
                                `
                        }

                    </div>


                    <!-- Product Information -->
                    <div class="p-5 sm:p-6">

                        <h3 class="text-xl sm:text-2xl font-semibold text-white mb-6">
                            ${order.name}
                        </h3>


                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            <div>
                                <p class="text-sm text-slate-500 mb-1">
                                    Unit Price
                                </p>

                                <p class="text-lg text-slate-200 font-medium">
                                    ₦${Number(order.price).toLocaleString()}
                                </p>
                            </div>


                            <div>
                                <p class="text-sm text-slate-500 mb-1">
                                    Quantity
                                </p>

                                <p class="text-lg text-slate-200 font-medium">
                                    ${order.quantity}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                <!-- Order Summary -->
                <div class="mt-8 pt-6 border-t border-slate-800">

                    <div class="flex items-center justify-between gap-4">

                        <span class="text-slate-400">
                            Order Total
                        </span>

                        <span class="text-xl sm:text-2xl font-bold text-cyan-400">
                            ₦${subtotal.toLocaleString()}
                        </span>

                    </div>

                </div>


                <!-- Order Date -->
                <div class="mt-6">

                    <p class="text-sm text-slate-500 mb-1">
                        Order Date
                    </p>

                    <p class="text-slate-300">
                        ${new Date(order.created_at).toLocaleString()}
                    </p>

                </div>

            </div>


            <!-- Actions -->
            <div class="bg-slate-950/40 border-t border-slate-800 p-5 sm:p-6">

                <div class="flex flex-col sm:flex-row gap-3">

                    <a
                        href="orders.html"
                        class="w-full sm:flex-1 px-6 py-3 rounded-lg border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 transition text-center"
                    >
                        Back to Orders
                    </a>

                    ${
                        order.status === "pending"
                            ? `
                                <a
                                    href="payment.html?orderId=${order.id}"
                                    class="w-full sm:flex-1 px-6 py-3 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition text-center"
                                >
                                    Pay Now
                                </a>
                            `
                            : ""
                    }

                </div>

            </div>

        </div>
    `;
};

loadOrderDetails();