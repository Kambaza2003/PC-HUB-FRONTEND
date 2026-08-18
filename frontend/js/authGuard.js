const token = localStorage.getItem("token");

if (!token) {

    const currentPage =
        window.location.pathname.split("/").pop();

    const redirect =
        currentPage || "index.html";

    window.location.href =
        `login.html?redirect=${redirect}`;

}