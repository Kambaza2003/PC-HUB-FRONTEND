const contactForm =
    document.querySelector("form");


contactForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message").value.trim();


        if (!name || !email || !message) {

            alert("Please fill in all fields.");

            return;
        }


        try {

            const { response, data } =
                await apiRequest(
                    "/contact",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            name,
                            email,
                            message
                        })
                    }
                );


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to send message."
                );

                return;
            }


            alert(
                "Your message has been sent successfully."
            );


            contactForm.reset();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        }

    }
);