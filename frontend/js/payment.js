const orderIdElement =
    document.getElementById("orderId");

const paymentAmountElement =
    document.getElementById("paymentAmount");

const paymentStatusElement =
    document.getElementById("paymentStatus");

const paymentMessage =
    document.getElementById("paymentMessage");

const payButton =
    document.getElementById("payButton");


const showMessage = (message, type = "error") => {

    paymentMessage.classList.remove("hidden");

    paymentMessage.classList.remove(
        "bg-red-500/10",
        "border-red-500/30",
        "text-red-400",
        "bg-green-500/10",
        "border-green-500/30",
        "text-green-400"
    );


    if (type === "success") {

        paymentMessage.classList.add(
            "bg-green-500/10",
            "border",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        paymentMessage.classList.add(
            "bg-red-500/10",
            "border",
            "border-red-500/30",
            "text-red-400"
        );

    }


    paymentMessage.textContent = message;

};


const getOrderId = () => {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("orderId");

};


/*
 * --------------------------------------------------
 * LOAD ORDER
 * --------------------------------------------------
 */

const loadOrder = async () => {

    const orderId =
        getOrderId();


    if (!orderId) {

        showMessage(
            "No order was selected for payment."
        );

        payButton.disabled = true;

        payButton.classList.add(
            "opacity-50",
            "cursor-not-allowed"
        );

        return;

    }


    orderIdElement.textContent =
        `#${orderId}`;


    try {

        /*
         * Get the order only.
         * Do NOT create a payment here.
         */

        const {
            response,
            data
        } = await apiRequest(
            `/orders/${orderId}`
        );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Unable to find order."
            );

            payButton.disabled = true;

            payButton.classList.add(
                "opacity-50",
                "cursor-not-allowed"
            );

            return;

        }


        /*
         * Calculate order amount.
         */

        const amount =
            Number(data.price) *
            Number(data.quantity);


        paymentAmountElement.textContent =
            `₦${amount.toLocaleString()}`;


        /*
         * Payment has not been created yet.
         */

        paymentStatusElement.textContent =
            "Pending";


        payButton.disabled = false;

        payButton.classList.remove(
            "opacity-50",
            "cursor-not-allowed"
        );


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );

        payButton.disabled = true;

        payButton.classList.add(
            "opacity-50",
            "cursor-not-allowed"
        );

    }

};


/*
 * --------------------------------------------------
 * INITIALIZE PAYMENT
 * --------------------------------------------------
 */

const initializePayment = async () => {

    const orderId =
        getOrderId();


    if (!orderId) {

        showMessage(
            "No order was selected for payment."
        );

        return;

    }


    try {

        /*
         * Prevent multiple clicks while
         * payment is being initialized.
         */

        payButton.disabled = true;

        payButton.textContent =
            "Initializing Payment...";


        /*
         * THIS is where the payment record
         * is created.
         */

        const {
            response,
            data
        } = await apiRequest(
            `/payments/${orderId}`,
            {
                method: "POST"
            }
        );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Unable to initialize payment."
            );

            payButton.disabled = false;

            payButton.textContent =
                "Pay Now";

            return;

        }


        /*
         * Update status.
         */

        paymentStatusElement.textContent =
            "Ready for payment";


        /*
         * Redirect to Paystack.
         */

        if (data.authorization_url) {

            window.location.href =
                data.authorization_url;

            return;

        }


        showMessage(
            "Payment authorization URL was not returned."
        );


        payButton.disabled = false;

        payButton.textContent =
            "Pay Now";


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );

        payButton.disabled = false;

        payButton.textContent =
            "Pay Now";

    }

};


/*
 * --------------------------------------------------
 * PAY NOW BUTTON
 * --------------------------------------------------
 */

payButton.addEventListener(
    "click",
    initializePayment
);


/*
 * --------------------------------------------------
 * LOAD PAGE
 * --------------------------------------------------
 */

loadOrder();