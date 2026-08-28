const API_BASE_URL = "https://e-commerce-fypt.onrender.com";

const getToken = () => {
    return localStorage.getItem("token");
};

const apiRequest = async (endpoint, options = {}) => {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    const data = await response.json();

    if (response.status === 401) {

        localStorage.removeItem("token");

        window.location.href = "login.html";

        return {
            response,
            data
        };
    }

    return {
        response,
        data
    };
};