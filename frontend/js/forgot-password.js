const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const forgotPasswordMessage =
    document.getElementById("forgotPasswordMessage");


const showMessage = (message, type = "error") => {

    forgotPasswordMessage.classList.remove(
        "hidden",
        "text-red-400",
        "text-green-400"
    );

    if (type === "success") {

        forgotPasswordMessage.classList.add(
            "text-green-400"
        );

    } else {

        forgotPasswordMessage.classList.add(
            "text-red-400"
        );

    }

    forgotPasswordMessage.textContent = message;
};


forgotPasswordForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        try {

            const { response, data } =
                await apiRequest(
                    "/user/forgot-password",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            email
                        })
                    }
                );

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Something went wrong."
                );

                return;
            }


            /*
             * The token is currently returned by the backend
             * for testing purposes.
             */

            if (data.resetToken) {

                const resetUrl =
                    `reset-password.html?token=${encodeURIComponent(
                        data.resetToken
                    )}`;

                showMessage(
                    "Reset link generated. Redirecting...",
                    "success"
                );

                setTimeout(() => {

                    window.location.href = resetUrl;

                }, 1000);

            } else {

                showMessage(
                    data.message ||
                    "If an account with that email exists, a password reset link will be sent.",
                    "success"
                );

            }

        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );
        }

    }
);
