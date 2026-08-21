const token = localStorage.getItem("token");

const authLinks =
    document.getElementById("authLinks");

const createAccountButton =
    document.getElementById("createAccountButton");


let user = null;


const getValidUser = () => {

    if (!token) {
        return null;
    }

    try {

        const tokenParts =
            token.split(".");

        const payload =
            JSON.parse(
                atob(tokenParts[1])
            );

        const currentTime =
            Math.floor(Date.now() / 1000);


        if (
            !payload.exp ||
            payload.exp <= currentTime
        ) {

            localStorage.removeItem("token");

            return null;
        }


        return payload;

    } catch (error) {

        console.error(
            "Invalid token:",
            error
        );

        localStorage.removeItem("token");

        return null;
    }
};


user = getValidUser();


if (authLinks) {

    if (user) {

        authLinks.innerHTML = `
            <a href="cart.html"
               class="hover:text-cyan-400 transition">
                Cart
            </a>

            <a href="orders.html"
               class="hover:text-cyan-400 transition">
                Orders
            </a>

            <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700">

                <span class="max-w-40 truncate text-cyan-400 font-semibold">
                    ${user.name}
                </span>

                <span class="text-slate-700">
                    |
                </span>

                <button id="logoutButton"
                        class="text-red-400 hover:text-red-300 font-medium transition">
                    Logout
                </button>

            </div>
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


if (createAccountButton && user) {

    createAccountButton.classList.add("hidden");

}