import {returnError} from "../utils/responseErrorHandler";
import {supabase} from "../utils/supabaseClient";
import {Providers} from "../types/auth";

export const registerUser = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) return returnError(`Failed to register user with credentials: ${error.message}`, 400);
        return data
    } catch (error: any) {
        return returnError(`Unexpected error in registerUser: ${error.message}`);
    }
}

export const loginUserWithCredentials = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) return returnError(`Failed to login with credentials: ${error.message}`, 400);
        return data
    } catch (error: any) {
        return returnError(`Unexpected error in loginUser: ${error.message}`);
    }
}

export const loginUserWithProvider = async (provider: Providers) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
        })

        if (error) return returnError(`Failed to login with ${provider}: ${error.message}`, 400);
        return data
    } catch (error: any) {
        return returnError(`Unexpected error in loginWithProvider: ${error.message}`);
    }
}

export const logoutUser = async () => {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) return returnError(`Failed to logout: ${error.message}`, 400);
        return { message: 'Successfully logged out!' }
    } catch (error: any) {
        return returnError(`Unexpected error in logoutUser: ${error.message}`);
    }
}