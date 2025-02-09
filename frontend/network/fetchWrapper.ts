import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "./authentication";

let isRefreshing = false; // Flag to track if a token refresh is in progress
let refreshQueue: ((token: string) => void)[] = []; // Queue to hold pending requests

export const fetchWrapper = async (url: string, options: RequestInit): Promise<Response> => {
    let accessToken = await AsyncStorage.getItem('access_token');

    // Automatically add access token to all headers
    if (accessToken) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        };
    }

    const response = await fetch(url, options);

    // If the response is unauthorized, try to refresh the token
    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true; // Set the flag to indicate a token refresh is in progress

            try {
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                const body = JSON.stringify({ refresh: refreshToken });
                const refreshResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: body,
                });

                if (refreshResponse.status === 200) {
                    const { access, refresh } = await refreshResponse.json();
                    await AsyncStorage.setItem('access_token', access);
                    await AsyncStorage.setItem('refresh_token', refresh);

                    // Update headers with the new access token
                    const headers = {
                        ...(options.headers || {}),
                        Authorization: `Bearer ${access}`,
                    };

                    const updatedOptions = {
                        ...options,
                        headers,
                    };

                    // Retry the original request
                    const retryResponse = await fetch(url, updatedOptions);

                    // Resolve all queued requests with the new token
                    refreshQueue.forEach((callback) => callback(access));
                    refreshQueue = []; // Clear the queue

                    return retryResponse;
                } else {
                    console.error("[error] failed to refresh token; response not ok");
                    console.error(body);
                    console.error(refreshResponse);

                    // Log out the user
                    console.error(`Logging out user`);
                    await logoutUser();
                }
            } catch (error) {
                console.error(`[error] failed to refresh token: ${error}`);
                // Log out the user if an error occurs during token refresh
                await logoutUser();
            } finally {
                isRefreshing = false; // Reset the flag
            }
        } else {
            // If a token refresh is already in progress, wait for it to complete
            return new Promise((resolve, reject) => {
                // Add the request to the queue
                refreshQueue.push((newAccessToken: string) => {
                    // Update headers with the new access token
                    const headers = {
                        ...(options.headers || {}),
                        Authorization: `Bearer ${newAccessToken}`,
                    };

                    const updatedOptions = {
                        ...options,
                        headers,
                    };

                    // Retry the original request
                    fetch(url, updatedOptions)
                        .then(resolve)
                        .catch(reject);
                });
            });
        }
    }

    return response;
};