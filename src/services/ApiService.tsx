import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const isDev = import.meta.env.DEV;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    Object.assign(config.headers, getAuthHeaders());

    if (isDev) {
        console.debug("[api]", config.method?.toUpperCase(), `${config.baseURL || ""}/${String(config.url || "").replace(/^\//, "")}`);
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error?.message || "Network request failed";

        if (isDev) {
            console.error("[api] request failed", {
                status,
                message,
                url: error?.config?.url,
                baseURL: error?.config?.baseURL,
            });
        }

        // Auto-clear token and redirect to login on 401
        if (status === 401) {
            localStorage.removeItem("token");
            // Only redirect if not already on an auth page
            if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export const post = async (endpoint: string, data: any) => {
    return await apiClient.post(endpoint.replace(/^\//, ""), data);
};

export const get = async (endpoint: string) => {
    return await apiClient.get(endpoint.replace(/^\//, ""));
};

export const downloadPdf = async (
    html: string,
    css: string,
    filename: string
): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/resume/generate-pdf`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        } as HeadersInit,
        body: JSON.stringify({ html, css, filename }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to generate PDF");
    }

    return response.blob();
};
