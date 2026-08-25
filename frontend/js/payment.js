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


const createPayment = async () => {

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
         * Get the order first so we can
         * display the correct amount.
         */

        const {
            response: orderResponse,
            data: orderData
        } = await apiRequest(
            `/orders/${orderId}`
        );


        if (!orderResponse.ok) {

            showMessage(
                orderData.message ||
                "Unable to find order."
            );

            payButton.disabled = true;

            return;

        }


        const amount =
            Number(orderData.price) *
            Number(orderData.quantity);


        paymentAmountElement.textContent =
            `₦${amount.toLocaleString()}`;


        /*
         * Create and initialize the
         * Paystack transaction.
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

            return;

        }


        /*
         * Store payment information.
         */

        payButton.dataset.paymentId =
            data.paymentId;

        payButton.dataset.reference =
            data.reference;

        window.paymentAuthorizationUrl =
            data.authorization_url;


        paymentStatusElement.textContent =
            "Ready for payment";


        /*
         * The actual payment will happen
         * when the user clicks Pay Now.
         */

        payButton.disabled = false;

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );

    }

};


const payPayment = () => {

    const authorizationUrl =
        window.paymentAuthorizationUrl;


    if (!authorizationUrl) {

        showMessage(
            "Payment has not been initialized."
        );

        return;

    }


    window.location.href =
        authorizationUrl;

};


payButton.addEventListener(
    "click",
    payPayment
);


createPayment();