const loadDashboardStats = async () => {

    try {

        const [
            productsResult,
            ordersResult,
            usersResult,
            paymentsResult
        ] = await Promise.all([

            apiRequest("/products"),

            apiRequest("/admin/orders"),

            apiRequest("/admin/users"),

            apiRequest("/admin/payments")

        ]);

        /*
         * PRODUCTS
         */

        if (productsResult.response.ok) {

            document.getElementById("productCount").textContent =
                productsResult.data.length;

        } else {

            document.getElementById("productCount").textContent =
                "--";

        }


        /*
         * ORDERS
         */

        if (ordersResult.response.ok) {

            document.getElementById("orderCount").textContent =
                ordersResult.data.length;

        } else {

            document.getElementById("orderCount").textContent =
                "--";

        }


        /*
         * USERS
         */

        if (usersResult.response.ok) {

            document.getElementById("userCount").textContent =
                usersResult.data.users.length;

        } else {

            document.getElementById("userCount").textContent =
                "--";

        }


        /*
         * PAYMENTS
         */

        if (paymentsResult.response.ok) {

            document.getElementById("paymentCount").textContent =
                paymentsResult.data.payments.length;

        } else {

            document.getElementById("paymentCount").textContent =
                "--";

        }

    } catch (error) {

        console.error(
            "Dashboard Statistics Error:",
            error
        );

    }

};

const loadRecentActivity = async () => {

    const recentActivity =
        document.getElementById("recentActivity");

    try {

        const [
            ordersResult,
            paymentsResult
        ] = await Promise.all([

            apiRequest("/admin/orders"),

            apiRequest("/admin/payments")

        ]);


        const activities = [];

        /*
        * ORDERS
        */

        if (ordersResult.response.ok) {

            ordersResult.data.forEach(order => {

                activities.push({
                    type: "order",
                    title: "Order received",
                    description: `Order #${order.id} • ${order.name} × ${order.quantity}`,
                    status: order.status,
                    date: order.created_at
                });

            });

        }


        /*
        * PAYMENTS
        */

if (paymentsResult.response.ok) {

    paymentsResult.data.payments.forEach(payment => {

        activities.push({
            type: "payment",
            title: "Payment recorded",
            description: `Order #${payment.order_id} • ₦${Number(payment.amount).toLocaleString()}`,
            status: payment.status,
            date: payment.created_at
        });

    });

}


        /*
         * SORT BY DATE
         */

        activities.sort((a, b) => {

            return new Date(b.date) - new Date(a.date);

        });


        /*
         * SHOW ONLY 5 MOST RECENT
         */

        const recentActivities =
            activities.slice(0, 5);


        if (recentActivities.length === 0) {

            recentActivity.innerHTML = `
                <div class="p-4 rounded-lg bg-slate-950 text-slate-500">
                    No recent activity found.
                </div>
            `;

            return;
        }

        /*
         * DISPLAY ACTIVITIES
         */

        recentActivity.innerHTML =
    recentActivities.map(activity => {

        const icon =
            activity.type === "order"
                ? "□"
                : "₦";


        const formattedDate =
            new Date(
                activity.date
            ).toLocaleString();


        return `
            <div class="flex items-start gap-4 p-4 rounded-lg bg-slate-950">

                <div class="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">

                    ${icon}

                </div>


                <div class="min-w-0 flex-1">

                    <p class="text-sm font-medium text-slate-300">

                        ${activity.title}

                    </p>


                    <p class="text-sm text-slate-500 truncate">

                        ${activity.description}

                    </p>


                    <div class="flex items-center gap-3 mt-1">

                        <span class="text-xs text-slate-600">

                            ${formattedDate}

                        </span>


                        <span class="text-xs text-cyan-400 capitalize">

                            ${activity.status}

                        </span>

                    </div>

                </div>

            </div>
        `;

    }).join("");

    } catch (error) {

        console.error(
            "Recent Activity Error:",
            error
        );

        recentActivity.innerHTML = `
            <div class="p-4 rounded-lg bg-red-500/10 text-red-400">
                Unable to load recent activity.
            </div>
        `;

    }

};

loadDashboardStats();
loadRecentActivity()
