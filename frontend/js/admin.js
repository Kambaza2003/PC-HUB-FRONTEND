const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const adminMenu = document.getElementById("adminMenu");
const menuOverlay = document.getElementById("menuOverlay");

menuBtn.addEventListener("click", () => {
    adminMenu.classList.remove("-translate-x-full");
    menuOverlay.classList.remove("opacity-0", "pointer-events-none");
});

closeMenuBtn.addEventListener("click", closeMenu);

menuOverlay.addEventListener("click", closeMenu);

function closeMenu() {
    adminMenu.classList.add("-translate-x-full");
    menuOverlay.classList.add("opacity-0", "pointer-events-none");
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

const user = JSON.parse(
    localStorage.getItem("user")
);

const adminName =
    document.getElementById("adminName");

if (adminName && user) {

    adminName.textContent =
        user.name || "Administrator";

}