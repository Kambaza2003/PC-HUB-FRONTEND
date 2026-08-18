const usersTableBody =
    document.getElementById("usersTableBody");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const emptyMessage =
    document.getElementById("emptyMessage");

const tableContainer =
    document.getElementById("tableContainer");

const totalUsers =
    document.getElementById("totalUsers");

const adminCount =
    document.getElementById("adminCount");

const regularUserCount =
    document.getElementById("regularUserCount");

const refreshUsersBtn =
    document.getElementById("refreshUsersBtn");


const showError = (message) => {

    loadingMessage.classList.add("hidden");

    tableContainer.classList.add("hidden");

    emptyMessage.classList.add("hidden");

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

};


const loadUsers = async () => {

    try {

        loadingMessage.classList.remove("hidden");

        tableContainer.classList.add("hidden");

        emptyMessage.classList.add("hidden");

        errorMessage.classList.add("hidden");


        const { response, data } =
            await apiRequest("/admin/users");


        if (!response.ok) {

            showError(
                data.message ||
                "Unable to load users."
            );

            return;
        }


        displayUsers(data.users);


    } catch (error) {

        console.error(error);

        showError(
            "Unable to connect to the server."
        );

    }

};


const displayUsers = (users) => {

    loadingMessage.classList.add("hidden");


    if (!users || users.length === 0) {

        tableContainer.classList.add("hidden");

        emptyMessage.classList.remove("hidden");

        updateStatistics([]);

        return;
    }


    usersTableBody.innerHTML = "";


    users.forEach(user => {

        const row =
            document.createElement("tr");


        row.className =
            "hover:bg-slate-800/50 transition";


        const roleBadge =
            user.role === "admin"

                ? `
                    <span
                        class="inline-flex items-center
                               px-3 py-1 rounded-full
                               text-xs font-semibold
                               bg-purple-500/10
                               text-purple-400
                               border border-purple-500/20">

                        Admin

                    </span>
                `

                : `
                    <span
                        class="inline-flex items-center
                               px-3 py-1 rounded-full
                               text-xs font-semibold
                               bg-emerald-500/10
                               text-emerald-400
                               border border-emerald-500/20">

                        User

                    </span>
                `;


        const registeredDate =
            new Date(user.created_at);


        const formattedDate =
            registeredDate.toLocaleDateString(
                "en-NG",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );


        row.innerHTML = `

            <td class="px-6 py-4 font-semibold">
                #${user.id}
            </td>


            <td class="px-6 py-4">

                <span class="font-medium">

                    ${user.name}

                </span>

            </td>


            <td class="px-6 py-4 text-slate-400">

                ${user.email}

            </td>


            <td class="px-6 py-4">

                ${roleBadge}

            </td>


            <td class="px-6 py-4 text-slate-400 whitespace-nowrap">

                ${formattedDate}

            </td>

        `;


        usersTableBody.appendChild(row);

    });


    updateStatistics(users);


    tableContainer.classList.remove("hidden");

};


const updateStatistics = (users) => {

    const admins =
        users.filter(
            user => user.role === "admin"
        );


    const regularUsers =
        users.filter(
            user => user.role !== "admin"
        );


    totalUsers.textContent =
        users.length;


    adminCount.textContent =
        admins.length;


    regularUserCount.textContent =
        regularUsers.length;

};


refreshUsersBtn.addEventListener(
    "click",
    loadUsers
);


loadUsers();