const paymentsTableBody =
    document.getElementById("paymentsTableBody");

const paymentsMessage =
    document.getElementById("paymentsMessage");

const totalPayments =
    document.getElementById("totalPayments");

const successfulPayments =
    document.getElementById("successfulPayments");

const pendingPayments =
    document.getElementById("pendingPayments");

const failedPayments =
    document.getElementById("failedPayments");

const refreshPaymentsBtn =
    document.getElementById("refreshPaymentsBtn");


const showMessage = (message, type = "error") => {

    paymentsMessage.classList.remove("hidden");

    paymentsMessage.className =
        "mb-6 rounded-lg p-4 border";

    if (type === "success") {

        paymentsMessage.classList.add(
            "bg-green-500/10",
            "border-green-500/30",
            "text-green-400"
        );

    } else {

        paymentsMessage.classList.add(
            "bg-red-500/10",
            "border-red-500/30",
            "text-red-400"
        );

    }

    paymentsMessage.textContent = message;

};


const getStatusClass = (status) => {

    const classes = {

        pending:
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

        successful:
            "bg-green-500/10 text-green-400 border-green-500/20",

        failed:
            "bg-red-500/10 text-red-400 border-red-500/20"

    };

    return classes[status] ||
        "bg-slate-700 text-slate-300 border-slate-600";

};


const loadPayments = async () => {

    try {

        const { response, data } =
            await apiRequest("/admin/payments");


        if (!response.ok) {

            showMessage(
                data.message ||
                "Unable to load payments."
            );

            return;
        }


        displayPayments(data.payments);

        updateStatistics(data.payments);


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server."
        );

    }

};


const displayPayments = (payments) => {

    paymentsTableBody.innerHTML = "";


    if (!payments || payments.length === 0) {

        paymentsTableBody.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="px-6 py-10
                           text-center
                           text-slate-500">

                    No payments found.

                </td>

            </tr>
        `;

        return;
    }


    payments.forEach(payment => {

        const row =
            document.createElement("tr");


        row.className =
            "hover:bg-slate-800/50 transition";


        const statusClass =
            getStatusClass(payment.status);


        const formattedDate =
            new Date(
                payment.created_at
            ).toLocaleString();


        row.innerHTML = `

            <td
                class="px-6 py-4
                       font-semibold">

                #${payment.id}

            </td>


            <td
                class="px-6 py-4
                       text-cyan-400
                       font-semibold">

                #${payment.order_id}

            </td>


            <td
                class="px-6 py-4">

                <div class="font-medium">

                    ${payment.name}

                </div>

                <div
                    class="text-xs
                           text-slate-500
                           mt-1">

                    User #${payment.user_id}

                </div>

            </td>


            <td
                class="px-6 py-4
                       text-slate-400">

                ${payment.email}

            </td>


            <td
                class="px-6 py-4
                       text-cyan-400
                       font-semibold
                       whitespace-nowrap">

                ₦${Number(
                    payment.amount
                ).toLocaleString()}

            </td>


            <td
                class="px-6 py-4">

                <span
                    class="inline-flex
                           items-center
                           px-3 py-1
                           rounded-full
                           text-xs
                           font-semibold
                           border
                           ${statusClass}">

                    ${payment.status}

                </span>

            </td>


            <td
                class="px-6 py-4
                       text-slate-400
                       whitespace-nowrap">

                ${formattedDate}

            </td>

        `;


        paymentsTableBody.appendChild(row);

    });

};


const updateStatistics = (payments) => {

    const successful =
        payments.filter(
            payment =>
                payment.status === "successful"
        );


    const pending =
        payments.filter(
            payment =>
                payment.status === "pending"
        );


    const failed =
        payments.filter(
            payment =>
                payment.status === "failed"
        );


    totalPayments.textContent =
        payments.length;


    successfulPayments.textContent =
        successful.length;


    pendingPayments.textContent =
        pending.length;


    failedPayments.textContent =
        failed.length;

};


refreshPaymentsBtn.addEventListener(
    "click",
    loadPayments
);


loadPayments();