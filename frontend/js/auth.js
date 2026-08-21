const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("registerMessage");

        try {

            const response = await fetch(
                `${API_BASE_URL}/user/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            message.classList.remove("hidden");

            if (!response.ok) {

                message.classList.add("text-red-400");
                message.classList.remove("text-green-400");

                message.textContent =
                    data.message || "Registration failed.";

                return;
            }

            message.classList.remove("text-red-400");
            message.classList.add("text-green-400");

            message.textContent =
                data.message || "Registration successful.";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {

            console.error(error);

            message.classList.remove("hidden");
            message.classList.add("text-red-400");

            message.textContent =
                "Unable to connect to the server.";
        }

    });

}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("loginMessage");

        try {

            const response = await fetch(
                `${API_BASE_URL}/user/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            message.classList.remove("hidden");

            if (!response.ok) {

                message.classList.add("text-red-400");
                message.classList.remove("text-green-400");

                message.textContent =
                    data.message || "Login failed.";

                return;
            }


            /*
             * Save the JWT token.
             */

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            /*
             * Get the user's role from
             * the JWT payload.
             */

            const tokenParts =
                data.token.split(".");

            const payload =
                JSON.parse(
                    atob(tokenParts[1])
                );


            /*
             * Redirect based on user role.
             */

            if (payload.role === "admin") {

                window.location.href =
                    "admin.html";

            } else {

                window.location.href =
                    "index.html";

            }

        } catch (error) {

            console.error(error);

            message.classList.remove("hidden");
            message.classList.add("text-red-400");

            message.textContent =
                "Unable to connect to the server.";
        }

    });

}


const requireAuth = () => {

    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "login.html";

        return false;
    }


    return true;
};