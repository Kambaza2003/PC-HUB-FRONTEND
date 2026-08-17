const token = localStorage.getItem("token");

const authLinks =
    document.getElementById("authLinks");

if (authLinks) {

    if (token) {

        authLinks.innerHTML = `
            <a href="cart.html"
               class="hover:text-cyan-400 transition">
                Cart
            </a>

            <a href="orders.html"
               class="hover:text-cyan-400 transition">
                Orders
            </a>

            <button id="logoutButton"
                    class="text-red-400 hover:text-red-600 transition">
                Logout
            </button>
        `;


        const logoutButton =
            document.getElementById("logoutButton");


        logoutButton.addEventListener(
            "click",
            () => {

                localStorage.removeItem("token");

                window.location.href =
                    "login.html";
            }
        );

    } else {

        authLinks.innerHTML = `
            <a href="login.html"
               class="hover:text-cyan-400 transition">
                Login
            </a>

            <a href="register.html"
               class="hover:text-cyan-400 transition">
                Register
            </a>
        `;
    }
}