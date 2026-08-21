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


loadDashboardStats();