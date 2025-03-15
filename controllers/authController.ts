import {Request, Response} from "express";
import {returnError} from "../utils/responseErrorHandler";
import {FailedResponse} from "../types/responseStatus";
import {
    signUp,
    signInWithOAuth,
    signInWithPassword,
    refreshSession,
    getUser,
    setSession,
} from "../services/authService";

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json(returnError('Refresh token missing', 401));
    }

    const data = await refreshSession(refreshToken);

    if ('error' in data) {
        const { error, statusCode } = data;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    if (data.session) {
        res.cookie('access_token', data.session.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.cookie('refresh_token', data.session.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    res.json({ user: data.user });
};


export const getUserSession = async (req: Request, res: Response) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const data = await getUser(accessToken);

    if ('error' in data) {
        const { error, statusCode } = data;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    res.json({ user: data.user });
};

export const setUserSession = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: 'Missing access token' });
    }

    const data = await setSession(accessToken, refreshToken);

    if ('error' in data) {
        const { error, statusCode } = data;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    res.json({ message: "Authenticated", user: data.user });
};


export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(returnError('Email and password are required', 400));
    }

    const data = await signUp(email, password);

    if ('error' in data) {
        const { error, statusCode } = data;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    if (data.session) {
        res.cookie('access_token', data.session.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.cookie('refresh_token', data.session.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    return res.status(200).json({ user: data.user });
};

export const loginWithCredentials = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = await signInWithPassword(email, password);

    if ('error' in data) {
        const { error, statusCode } = data;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    if (data.session) {
        res.cookie('access_token', data.session.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.cookie('refresh_token', data.session.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    return res.status(200).json({ user: data.user });
};

export const loginWithProvider = async (req: Request, res: Response) => {
    const { provider } = req.body;

    if (!provider) {
        return res.status(400).json(returnError('Provider is required', 400));
    }

    const response = await signInWithOAuth(provider);

    if ('error' in response) {
        const { error, statusCode } = response as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(response);
};


export const logout = async (req: Request, res: Response) => {
    res.cookie('access_token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refresh_token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'strict' });

    res.json({ message: 'Logged out' });
};
