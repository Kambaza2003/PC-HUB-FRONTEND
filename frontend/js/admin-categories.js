const categoryTableBody = document.getElementById("categoryTableBody");
const categoryTotal = document.getElementById("categoryTotal");

const categoryModal = document.getElementById("categoryModal");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryId = document.getElementById("categoryId");

const modalMode = document.getElementById("modalMode");
const saveCategoryBtn = document.getElementById("saveCategoryBtn");

const categoryMessage = document.getElementById("categoryMessage");
const formMessage = document.getElementById("formMessage");


let categories = [];
let editingCategoryId = null;


/* SHOW MESSAGE */

const showMessage = (message, type = "error") => {

    categoryMessage.classList.remove("hidden");

    categoryMessage.className =
        "mb-6 rounded-lg p-4 border";

    if (type === "success") {

        categoryMessage.classList.add(
            "bg-green-500/10",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        categoryMessage.classList.add(
            "bg-red-500/10",
            "border-red-500/30",
            "text-red-400"
        );

    }

    categoryMessage.textContent = message;

};


/* LOAD CATEGORIES */

const loadCategories = async () => {

    try {

        const { response, data } =
            await apiRequest("/categories");


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load categories."
            );

        }


        categories = data;


        renderCategories(categories);


    } catch (error) {

        console.error(
            "Load Categories Error:",
            error
        );


        categoryTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-10 text-center text-red-400">
                    ${error.message || "Unable to load categories."}
                </td>
            </tr>
        `;

    }

};


/* DISPLAY CATEGORIES */

const renderCategories = (data) => {

    categoryTotal.textContent =
        `${data.length} categor${data.length === 1 ? "y" : "ies"}`;


    if (data.length === 0) {

        categoryTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-10 text-center text-slate-500">
                    No categories found.
                </td>
            </tr>
        `;

        return;

    }


    categoryTableBody.innerHTML = "";


    data.forEach(category => {

        const row =
            document.createElement("tr");

        row.className =
            "border-t border-slate-800 hover:bg-slate-950/50 transition";


        row.innerHTML = `

            <td class="px-6 py-4 text-slate-400">
                ${category.id}
            </td>

            <td class="px-6 py-4 text-slate-200 font-medium">
                ${category.name}
            </td>

            <td class="px-6 py-4">

                <div class="flex items-center gap-2">

                    <button
                        class="edit-category-btn px-3 py-2 rounded-lg text-sm text-cyan-400 hover:bg-cyan-500/10 transition"
                        data-id="${category.id}">

                        Edit

                    </button>


                    <button
                        class="delete-category-btn px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
                        data-id="${category.id}">

                        Delete

                    </button>

                </div>

            </td>

        `;


        categoryTableBody.appendChild(row);

    });

};


/* OPEN ADD MODAL */

addCategoryBtn.addEventListener("click", () => {

    editingCategoryId = null;

    categoryForm.reset();

    categoryId.value = "";

    modalMode.textContent =
        "Add Category";

    saveCategoryBtn.textContent =
        "Save Category";

    formMessage.classList.add("hidden");

    categoryModal.classList.remove("hidden");

    categoryModal.classList.add("flex");

});


/* CLOSE MODAL */

const closeModal = () => {

    categoryModal.classList.add("hidden");

    categoryModal.classList.remove("flex");

    categoryForm.reset();

    categoryId.value = "";

    editingCategoryId = null;

    formMessage.classList.add("hidden");

};


closeModalBtn.addEventListener(
    "click",
    closeModal
);

cancelBtn.addEventListener(
    "click",
    closeModal
);


/* ADD / UPDATE */

categoryForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            categoryName.value.trim();


        if (!name) {

            formMessage.classList.remove("hidden");

            formMessage.className =
                "mb-5 px-4 py-3 rounded-lg text-sm bg-red-500/10 text-red-400";

            formMessage.textContent =
                "Category name is required.";

            return;

        }


        try {

            saveCategoryBtn.disabled = true;

            saveCategoryBtn.textContent =
                editingCategoryId
                    ? "Updating..."
                    : "Saving...";


            const endpoint =
                editingCategoryId
                    ? `/categories/${editingCategoryId}`
                    : "/categories";


            const method =
                editingCategoryId
                    ? "PUT"
                    : "POST";


            const { response, data } =
                await apiRequest(
                    endpoint,
                    {
                        method,
                        body: JSON.stringify({
                            name
                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Category operation failed."
                );

            }


            closeModal();


            showMessage(
                editingCategoryId
                    ? "Category updated successfully."
                    : "Category created successfully.",
                "success"
            );


            await loadCategories();


        } catch (error) {

            console.error(
                "Add/Update Category Error:",
                error
            );


            formMessage.classList.remove("hidden");

            formMessage.className =
                "mb-5 px-4 py-3 rounded-lg text-sm bg-red-500/10 text-red-400";

            formMessage.textContent =
                error.message ||
                "Unable to connect to the server.";

        } finally {

            saveCategoryBtn.disabled = false;

            saveCategoryBtn.textContent =
                editingCategoryId
                    ? "Update Category"
                    : "Save Category";

        }

    }
);


/* EDIT / DELETE BUTTONS */

categoryTableBody.addEventListener(
    "click",
    async (event) => {

        const editButton =
            event.target.closest(
                ".edit-category-btn"
            );


        const deleteButton =
            event.target.closest(
                ".delete-category-btn"
            );


        /* EDIT */

        if (editButton) {

            const id =
                Number(editButton.dataset.id);


            const category =
                categories.find(
                    item => item.id === id
                );


            if (!category) {

                return;

            }


            editingCategoryId =
                category.id;


            categoryId.value =
                category.id;


            categoryName.value =
                category.name;


            modalMode.textContent =
                "Edit Category";


            saveCategoryBtn.textContent =
                "Update Category";


            formMessage.classList.add(
                "hidden"
            );


            categoryModal.classList.remove(
                "hidden"
            );

            categoryModal.classList.add(
                "flex"
            );


            return;

        }


        /* DELETE */

        if (deleteButton) {

            const id =
                Number(deleteButton.dataset.id);


            const category =
                categories.find(
                    item => item.id === id
                );


            if (!category) {

                return;

            }


            const confirmed =
                confirm(
                    `Are you sure you want to delete "${category.name}"?`
                );


            if (!confirmed) {

                return;

            }


            try {

                const { response, data } =
                    await apiRequest(
                        `/categories/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to delete category."
                    );

                }


                showMessage(
                    data.message ||
                    "Category deleted successfully.",
                    "success"
                );


                await loadCategories();


            } catch (error) {

                console.error(
                    "Delete Category Error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to delete category."
                );

            }

        }

    }
);


/* INITIAL LOAD */

loadCategories();