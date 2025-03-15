import {returnError} from "../utils/responseErrorHandler";
import {supabase} from "../utils/supabaseClient";
import {Providers} from "../types/auth";

export const signUp = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return returnError(`Failed to register user: ${error.message}`, error.status);
        }

        return data;
    } catch (error: any) {
        return returnError(`Unexpected error in registerUser: ${error.message}`);
    }
};

export const signInWithPassword = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) return returnError(`Failed to login with credentials: ${error.message}`, error.status);
        return data
    } catch (error: any) {
        return returnError(`Unexpected error in loginUser: ${error.message}`);
    }
}

export const signInWithOAuth = async (provider: Providers) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
            },
        });

        if (error) return returnError(`Failed to login with ${provider}: ${error.message}`, error.status);
        return { url: data.url };
    } catch (error: any) {
        return returnError(`Unexpected error in loginWithProvider: ${error.message}`);
    }
};

export const refreshSession = async (refreshToken: string) => {
    try {
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (error) {
            return returnError(`Invalid refresh token: ${error.message}`, error.status);
        }

        return data;
    } catch (error: any) {
        return returnError(`Unexpected error in refreshSession: ${error.message}`);
    }
}

export const setSession = async (accessToken: string, refreshToken: string) => {
    try {
        const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (error) {
            return returnError(`Invalid refresh token: ${error.message}`, error.status);
        }

        return data;
    } catch (error: any) {
        return returnError(`Unexpected error in refreshSession: ${error.message}`);
    }
}

export const getUser = async (accessToken: string) => {
    try {
        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error) {
            return returnError(`Invalid session: ${error.message}`, error.status);
        }

        return data;
    } catch (error: any) {
        return returnError(`Unexpected error in refreshSession: ${error.message}`);
    }
}
