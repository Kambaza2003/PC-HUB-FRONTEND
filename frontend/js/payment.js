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
        new URLSearchParams(window.location.search);

    return params.get("orderId");
};


const createPayment = async () => {

    const orderId = getOrderId();


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
         * First get the order so we know
         * the correct payment amount.
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

            return;
        }


        const amount =
            Number(orderData.price) *
            Number(orderData.quantity);


        paymentAmountElement.textContent =
            `₦${amount.toLocaleString()}`;


        /*
         * Create the payment.
         */

        const {
            response,
            data
        } = await apiRequest(
            `/payments/${orderId}`,
            {
                method: "POST",

                body: JSON.stringify({
                    amount
                })
            }
        );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Unable to create payment."
            );

            return;
        }


        /*
         * Store payment ID for
         * the Pay Now button.
         */

        payButton.dataset.paymentId =
            data.paymentId;


        paymentStatusElement.textContent =
            "Pending";


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );
    }
};


const payPayment = async () => {

    const paymentId =
        payButton.dataset.paymentId;


    if (!paymentId) {

        showMessage(
            "Payment has not been created yet."
        );

        return;
    }


    try {

        payButton.disabled = true;

        payButton.textContent =
            "Processing Payment...";


        const {
            response,
            data
        } = await apiRequest(
            `/payments/${paymentId}/pay`,
            {
                method: "POST"
            }
        );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Payment failed."
            );

            payButton.disabled = false;

            payButton.textContent =
                "Pay Now";

            return;
        }


        paymentStatusElement.textContent =
            "Successful";


        paymentStatusElement.className =
            "px-3 py-1 rounded-full text-sm " +
            "bg-green-500/10 text-green-400";


        showMessage(
            "Payment successful!",
            "success"
        );


        payButton.textContent =
            "Payment Completed";


        setTimeout(() => {

            window.location.href =
                "orders.html";

        }, 1500);


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


payButton.addEventListener(
    "click",
    payPayment
);


createPayment();