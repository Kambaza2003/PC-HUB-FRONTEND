const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

} else {

    try {

        const tokenParts = token.split(".");

        const payload = JSON.parse(
            atob(tokenParts[1])
        );

        if (payload.role !== "admin") {

            window.location.href = "index.html";

        }

    } catch (error) {

        console.error("Invalid token:", error);

        localStorage.removeItem("token");

        window.location.href = "login.html";

    }

}