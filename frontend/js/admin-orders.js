const ordersTableBody =
    document.getElementById("ordersTableBody");

const ordersMessage =
    document.getElementById("ordersMessage");


const showMessage = (message, type = "error") => {

    ordersMessage.classList.remove("hidden");

    ordersMessage.className =
        "mb-6 rounded-lg p-4 border";

    if (type === "success") {

        ordersMessage.classList.add(
            "bg-green-500/10",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        ordersMessage.classList.add(
            "bg-red-500/10",
            "border-red-500/30",
            "text-red-400"
        );

    }

    ordersMessage.textContent = message;
};


const getStatusClass = (status) => {

    const classes = {

        pending:
            "bg-yellow-500/10 text-yellow-400",

        processing:
            "bg-blue-500/10 text-blue-400",

        shipped:
            "bg-purple-500/10 text-purple-400",

        delivered:
            "bg-green-500/10 text-green-400",

        cancelled:
            "bg-red-500/10 text-red-400"

    };

    return classes[status] ||
        "bg-slate-700 text-slate-300";
};


const loadOrders = async () => {

    try {

        const { response, data } =
            await apiRequest("/admin/orders");


        if (!response.ok) {

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


const displayOrders = (orders) => {

    ordersTableBody.innerHTML = "";


    if (orders.length === 0) {

        ordersTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="px-6 py-10 text-center text-slate-500">

                    No orders found.

                </td>
            </tr>
        `;

        return;
    }


    orders.forEach(order => {

        const row =
            document.createElement("tr");

        row.className =
            "hover:bg-slate-800/50 transition";


        const isLocked =
            ["shipped", "delivered", "cancelled"]
                .includes(order.status);


        row.innerHTML = `

            <td class="px-6 py-4 font-semibold">
                #${order.id}
            </td>


            <td class="px-6 py-4 text-slate-400">
                ${order.user_id}
            </td>


            <td class="px-6 py-4">
                ${order.name}
            </td>


            <td class="px-6 py-4 text-cyan-400 font-semibold">
                ₦${Number(order.price).toLocaleString()}
            </td>


            <td class="px-6 py-4">
                ${order.quantity}
            </td>


            <td class="px-6 py-4">

                <select
                    class="status-select rounded-lg border border-slate-700
                           bg-slate-800 px-3 py-2
                           ${getStatusClass(order.status)}
                           focus:outline-none focus:border-cyan-400"

                    data-order-id="${order.id}"

                    ${isLocked ? "disabled" : ""}>

                    <option
                        value="pending"
                        ${order.status === "pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option
                        value="processing"
                        ${order.status === "processing" ? "selected" : ""}>
                        Processing
                    </option>

                    <option
                        value="shipped"
                        ${order.status === "shipped" ? "selected" : ""}>
                        Shipped
                    </option>

                    <option
                        value="delivered"
                        ${order.status === "delivered" ? "selected" : ""}>
                        Delivered
                    </option>

                    <option
                        value="cancelled"
                        ${order.status === "cancelled" ? "selected" : ""}>
                        Cancelled
                    </option>

                </select>

            </td>


            <td class="px-6 py-4 text-slate-400 whitespace-nowrap">
                ${new Date(order.created_at).toLocaleString()}
            </td>

        `;


        ordersTableBody.appendChild(row);

    });

};


ordersTableBody.addEventListener(
    "change",
    async (event) => {

        const select =
            event.target.closest(".status-select");

        if (!select) {
            return;
        }


        const orderId =
            select.dataset.orderId;

        const status =
            select.value;


        try {

            select.disabled = true;


            const { response, data } =
                await apiRequest(
                    `/orders/${orderId}/status`,
                    {
                        method: "PUT",

                        body: JSON.stringify({
                            status
                        })
                    }
                );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Unable to update order status."
                );

                loadOrders();

                return;
            }


            showMessage(
                "Order status updated successfully.",
                "success"
            );


            loadOrders();


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );

            loadOrders();

        }

    }
);


loadOrders();