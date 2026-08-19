const loadPageContent = async (page) => {

    try {

        const { response, data } =
            await apiRequest(`/content/${page}`);

        if (!response.ok) {

            console.error(
                `Unable to load ${page} content.`,
                data
            );

            return;
        }

        if (!data || data.length === 0) {

            console.log(`No content found for ${page}.`);

            return;
        }

        data.forEach(item => {

            const titleElement =
                document.querySelector(
                    `[data-content-title="${item.section}"]`
                );

            const contentElement =
                document.querySelector(
                    `[data-content-text="${item.section}"]`
                );

            if (titleElement && item.title) {

                titleElement.textContent =
                    item.title;

            }

            if (!contentElement) {
                return;
            }

            if (item.section === "what-we-offer") {

                const items =
                    item.content
                        .split("\n")
                        .map(value => value.trim())
                        .filter(value => value);

                contentElement.innerHTML = "";

                items.forEach(value => {

                    const li =
                        document.createElement("li");

                    li.textContent = `✓ ${value}`;

                    contentElement.appendChild(li);

                });

                return;
            }

            if (item.section === "working-hours") {

                contentElement.innerHTML =
                    item.content.replace(
                        /\n/g,
                        "<br>"
                    );

                return;
            }

            contentElement.textContent =
                item.content;

        });

    } catch (error) {

        console.error(
            `Page Content Error (${page}):`,
            error
        );

    }

};