const contentTableBody = document.getElementById("contentTableBody");

const contentMessage = document.getElementById("contentMessage");

const contentForm = document.getElementById("contentForm");

const loadingMessage = document.getElementById("loadingMessage");

const emptyMessage = document.getElementById("emptyMessage");

const tableContainer = document.getElementById("tableContainer");

const saveContentBtn = document.getElementById("saveContentBtn");


let editingContentId = null;


const showMessage = (message, type = "error") => {

    contentMessage.classList.remove("hidden");

    contentMessage.className = "mb-6 rounded-lg p-4 border";

    if (type === "success") {

        contentMessage.classList.add(
            "bg-green-500/10",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        contentMessage.classList.add(
            "bg-red-500/10",
            "border-red-500/30",
            "text-red-400"
        );

    }

    contentMessage.textContent = message;

};


const loadContent = async () => {

    loadingMessage.classList.remove("hidden");

    tableContainer.classList.add("hidden");

    emptyMessage.classList.add("hidden");

    try {

        const { response, data } =
            await apiRequest("/admin/content");


        if (!response.ok) {

            showMessage(
                data.message ||
                "Unable to load page content."
            );

            loadingMessage.classList.add("hidden");

            return;
        }


        loadingMessage.classList.add("hidden");


        if (!data || data.length === 0) {

            emptyMessage.classList.remove("hidden");

            return;
        }


        displayContent(data);

        tableContainer.classList.remove("hidden");

    } catch (error) {

        console.error("Page Content Error:", error);

        loadingMessage.classList.add("hidden");

        showMessage(
            error.message || "Unable to connect to the server."
        );

    }

};


const displayContent = (contents) => {

    contentTableBody.innerHTML = "";


    contents.forEach(item => {

        const row =
            document.createElement("tr");

        row.className =
            "hover:bg-slate-800/50 transition";


        const shortenedContent =
            item.content.length > 100
                ? `${item.content.substring(0, 100)}...`
                : item.content;


        const formattedDate =
            new Date(
                item.updated_at
            ).toLocaleString();


        row.innerHTML = `

            <td class="px-6 py-4 text-slate-400">
                ${item.id}
            </td>


            <td class="px-6 py-4 text-cyan-400 font-medium">
                ${item.page}
            </td>


            <td class="px-6 py-4 text-slate-300">
                ${item.section}
            </td>


            <td class="px-6 py-4">
                ${item.title || "-"}
            </td>


            <td class="px-6 py-4 text-slate-400 max-w-md">
                ${shortenedContent}
            </td>


            <td class="px-6 py-4 text-slate-400 whitespace-nowrap">
                ${formattedDate}
            </td>


            <td class="px-6 py-4">

                <button
                    class="edit-content-btn px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition"
                    data-id="${item.id}">

                    Edit

                </button>

            </td>

        `;


        contentTableBody.appendChild(row);

    });

};


contentForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const page =
            document.getElementById("page").value.trim();

        const section =
            document.getElementById("section").value.trim();

        const title =
            document.getElementById("title").value.trim();

        const content =
            document.getElementById("content").value.trim();


        if (!page || !section || !content) {

            showMessage(
                "Page, section and content are required."
            );

            return;
        }


        try {

            saveContentBtn.disabled = true;

            saveContentBtn.textContent =
                editingContentId
                    ? "Updating..."
                    : "Adding...";


            const url =
                editingContentId
                    ? `/admin/content/${editingContentId}`
                    : "/admin/content";


            const method =
                editingContentId
                    ? "PUT"
                    : "POST";


            const { response, data } =
                await apiRequest(
                    url,
                    {
                        method,
                        body: JSON.stringify({
                            page,
                            section,
                            title,
                            content
                        })
                    }
                );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Unable to save content."
                );

                return;
            }


            showMessage(
                editingContentId
                    ? "Content updated successfully."
                    : "Content added successfully.",
                "success"
            );


            contentForm.reset();

            editingContentId = null;

            saveContentBtn.textContent =
                "Add Content";


            await loadContent();

        } catch (error) {

            console.error("Add/Update Content Error:", error);

            showMessage(
                error.message || "Unable to connect to the server."
            );

        } finally {
            saveContentBtn.disabled = false;

            if (!editingContentId) {

                saveContentBtn.textContent =
                    "Add Content";

            }

        }

    }
);


contentTableBody.addEventListener(
    "click",
    async (event) => {

        const editButton =
            event.target.closest(
                ".edit-content-btn"
            );


        if (!editButton) {
            return;
        }


        const contentId =
            editButton.dataset.id;


        try {

            const { response, data } =
                await apiRequest(
                    `/admin/content/${contentId}`
                );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Unable to load content."
                );

                return;
            }


            document.getElementById("page").value =
                data.page;

            document.getElementById("section").value =
                data.section;

            document.getElementById("title").value =
                data.title || "";

            document.getElementById("content").value =
                data.content;


            editingContentId =
                data.id;


            saveContentBtn.textContent =
                "Update Content";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to connect to the server."
            );

        }

    }
);


loadContent();