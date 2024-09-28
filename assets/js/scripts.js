document.addEventListener('DOMContentLoaded', () => {
    // Initialize your app, for example
    // Initialize AlpineJS or other functionalities

    // Example function to handle pagination
    function createPagination(pagination) {
        const paginationContainer = document.getElementById('ipagination');
        paginationContainer.innerHTML = ''; // Clear previous content

        const { currentPage, totalPages } = pagination;
        const delta = 2; // Number of pages around the current page
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }
        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        range.forEach((page) => {
            const button = document.createElement('button');
            button.textContent = page;
            button.className = 'page';

            if (page === '...') {
                button.classList.add("gap")
                button.disabled = true;
            } else {
                if (page === currentPage) {
                    button.classList.add("current")
                    button.disabled = true;
                    button.style.fontWeight = 'bold';
                }
                button.addEventListener('click', () => {
                    fetchDataForPage(page);
                });
            }

            paginationContainer.appendChild(button);
        });
    }

    function fetchDataForPage(page) {
        let url = new URL(window.location.href);
        url.searchParams.delete('page');
        url.searchParams.append('page', page);
        window.location.href = url.toString();
    }

    // Additional JS functions as per your requirements
});
