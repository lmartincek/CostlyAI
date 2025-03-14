import {Request, Response} from "express";
import {returnError} from "../utils/responseErrorHandler";
import {FailedResponse} from "../types/responseStatus";
import {
    loginUserWithCredentials,
    loginUserWithProvider,
    logoutUser,
    registerUser
} from "../services/authService";
import {supabase} from "../utils/supabaseClient";

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

        if (error) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        return res.status(200).json({
            // @ts-ignore
            access_token: data.session.access_token,
            user: data.user,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(returnError('Email and password are required', 400));
    }

    const data = await registerUser(email, password);

    if ('error' in data) {
        const { error, statusCode } = data;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json({
        access_token: data.session?.access_token,
        user: data.user,
    });};

export const loginWithCredentials = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json(returnError('Email is required', 400));
    }

    if (!password) {
        return res.status(400).json(returnError('Password is required', 400));
    }

    const data = await loginUserWithCredentials(email, password)

    if ('error' in data) {
        const { error, statusCode } = data as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    res.cookie('refresh_token', data.session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
        access_token: data.session?.access_token,
        user: data.user,
    });
}

export const loginWithProvider = async (req: Request, res: Response) => {
    const { provider } = req.body;

    if (!provider) {
        return res.status(400).json(returnError('Provider is required', 400));
    }

    const response = await loginUserWithProvider(provider);

    if ('error' in response) {
        const { error, statusCode } = response as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(response);
};


export const logout = async (req: Request, res: Response) => {
    const message = await logoutUser()

    if ('error' in message) {
        const { error, statusCode } = message as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(message);
}