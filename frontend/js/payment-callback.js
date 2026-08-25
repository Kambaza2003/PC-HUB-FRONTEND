const paymentMessage =
    document.getElementById("paymentMessage");


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


const getReference = () => {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("reference");

};


const verifyPayment = async () => {

    const reference =
        getReference();


    if (!reference) {

        showMessage(
            "Payment reference was not found."
        );

        return;

    }


    try {

        const {
            response,
            data
        } = await apiRequest(
            `/payments/reference/${encodeURIComponent(reference)}/pay`,
            {
                method: "POST"
            }
        );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Payment verification failed."
            );

            return;

        }


        showMessage(
            "Payment successful! Redirecting...",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "orders.html";

        }, 2000);


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );

    }

};


verifyPayment();