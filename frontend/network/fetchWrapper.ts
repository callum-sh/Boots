import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "./authentication";


export const fetchWrapper = async (url: string, options: RequestInit): Promise<Response> => {
    const accessToken = AsyncStorage.getItem('access_token');

    // automatically add access token to all headers 
    if (accessToken) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        };
    };

    const response = await fetch(url, options);

    // if the response is unauthorized, try to refresh the token
    if (response.status === 401) {
        try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            const body = JSON.stringify({ refresh: refreshToken });
            const refreshResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: body,
            });

            if (refreshResponse.status === 200) {
                const {access, refresh } = await refreshResponse.json();
                await AsyncStorage.setItem('access_token', access);
                await AsyncStorage.setItem('refresh_token', refresh);

                // update headers with auth token 
                const headers = {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${access}`,
                };
                
                const updatedOptions = {
                ...options,
                headers,
                };

                // retry the original request
                return fetch(url, updatedOptions);
            } else {
                console.error("[error] failed to refresh token; response not ok");
                console.error(body);
                console.error(refreshResponse);

                // send to login page 
                const refresh = await AsyncStorage.getItem('refresh_token');
                if (refresh) {
                    logoutUser(refresh);
                } else {
                    console.error('No refresh token found in storage');
                }
            }
        } catch (error) {
            console.error(`[error] failed to refresh token: ${error}`);
            // setIsAuthenticated(false);
        }
    }

    return response;
};
