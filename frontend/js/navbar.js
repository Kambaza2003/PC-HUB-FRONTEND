const token = localStorage.getItem("token");

const authLinks =
    document.getElementById("authLinks");

const mobileAuthLinks =
    document.getElementById("mobileAuthLinks");

const createAccountButton =
    document.getElementById("createAccountButton");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");


let user = null;


/*
 * --------------------------------------------------
 * VALIDATE USER
 * --------------------------------------------------
 */

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


/*
 * --------------------------------------------------
 * DESKTOP AUTHENTICATION
 * --------------------------------------------------
 */

if (authLinks) {

    if (user) {

        authLinks.innerHTML = `

            <a
                href="cart.html"
                class="hover:text-cyan-400 transition">

                Cart

            </a>

            <a
                href="orders.html"
                class="hover:text-cyan-400 transition">

                Orders

            </a>

            <div
                class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700">

                <span
                    class="max-w-40 truncate text-cyan-400 font-semibold">

                    ${user.name}

                </span>

                <span class="text-slate-700">

                    |

                </span>

                <button
                    id="logoutButton"
                    type="button"
                    class="text-red-400 hover:text-red-300 font-medium transition">

                    Logout

                </button>

            </div>

        `;


        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                () => {

                    localStorage.removeItem("token");

                    window.location.href =
                        "login.html";

                }
            );

        }

    } else {

        authLinks.innerHTML = `

            <a
                href="login.html"
                class="hover:text-cyan-400 transition">

                Login

            </a>

            <a
                href="register.html"
                class="hover:text-cyan-400 transition">

                Register

            </a>

        `;

    }

}


/*
 * --------------------------------------------------
 * MOBILE AUTHENTICATION
 * --------------------------------------------------
 */

if (mobileAuthLinks) {

    if (user) {

        mobileAuthLinks.innerHTML = `

            <a
                href="cart.html"
                class="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition">

                Cart

            </a>


            <a
                href="orders.html"
                class="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition">

                Orders

            </a>


            <div
                class="px-4 py-3 text-slate-400">

                Signed in as
                <span class="text-cyan-400 font-semibold">

                    ${user.name}

                </span>

            </div>


            <button
                id="mobileLogoutButton"
                type="button"
                class="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-slate-900 transition">

                Logout

            </button>

        `;


        const mobileLogoutButton =
            document.getElementById(
                "mobileLogoutButton"
            );


        if (mobileLogoutButton) {

            mobileLogoutButton.addEventListener(
                "click",
                () => {

                    localStorage.removeItem("token");

                    window.location.href =
                        "login.html";

                }
            );

        }

    } else {

        mobileAuthLinks.innerHTML = `

            <a
                href="login.html"
                class="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition">

                Login

            </a>


            <a
                href="register.html"
                class="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition">

                Register

            </a>

        `;

    }

}


/*
 * --------------------------------------------------
 * MOBILE MENU
 * --------------------------------------------------
 */

if (mobileMenuButton && mobileMenu) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            const menuIsHidden =
                mobileMenu.classList.contains("hidden");


            if (menuIsHidden) {

                mobileMenu.classList.remove("hidden");

                mobileMenuButton.innerHTML = "✕";

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Close navigation menu"
                );

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

            } else {

                mobileMenu.classList.add("hidden");

                mobileMenuButton.innerHTML = "☰";

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/*
 * --------------------------------------------------
 * CREATE ACCOUNT BUTTON
 * --------------------------------------------------
 */

if (createAccountButton && user) {

    createAccountButton.classList.add(
        "hidden"
    );

}