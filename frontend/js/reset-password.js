const resetPasswordForm =
    document.getElementById("resetPasswordForm");

const resetPasswordMessage =
    document.getElementById("resetPasswordMessage");


const showMessage = (message, type = "error") => {

    resetPasswordMessage.classList.remove(
        "hidden",
        "text-red-400",
        "text-green-400"
    );

    if (type === "success") {

        resetPasswordMessage.classList.add(
            "text-green-400"
        );

    } else {

        resetPasswordMessage.classList.add(
            "text-red-400"
        );

    }

    resetPasswordMessage.textContent = message;
};


const getResetToken = () => {

    const params =
        new URLSearchParams(window.location.search);

    return params.get("token");

};


resetPasswordForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const token = getResetToken();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (!token) {

            showMessage(
                "Password reset token is missing."
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match."
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters."
            );

            return;
        }


        try {

            const { response, data } =
                await apiRequest(
                    "/user/reset-password",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            token,
                            password
                        })
                    }
                );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Password reset failed."
                );

                return;
            }


            showMessage(
                "Password reset successful. Redirecting to login...",
                "success"
            );


            setTimeout(() => {

                window.location.href = "login.html";

            }, 2000);


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );

        }

    }
);
