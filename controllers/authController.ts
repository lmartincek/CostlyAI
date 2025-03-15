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

const setAuthCookies = (res: Response, session: { access_token: string; refresh_token?: string }) => {
    res.cookie('access_token', session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    if (session.refresh_token) {
        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
};

const handleAuthRequest = async (
    res: Response,
    authFunction: (arg1: any, arg2?: any) => Promise<any>,
    arg1?: any,
    arg2?: any
) => {
    const data = await authFunction(arg1, arg2);

    if ('error' in data) {
        return res.status(data.statusCode ?? 500).json(returnError(data.error, data.statusCode));
    }

    if (data.session) {
        setAuthCookies(res, data.session);
    }

    return res.status(200).json({ user: data.user });
};

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(returnError('Email and password are required', 400));
    return handleAuthRequest(res, signUp, email, password);
};

export const loginWithCredentials = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(returnError('Email and password are required', 400));
    return handleAuthRequest(res, signInWithPassword, email, password);
};

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json(returnError('Refresh token missing', 401));
    return handleAuthRequest(res, refreshSession, token);
};

export const getUserSession = async (req: Request, res: Response) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json(returnError('Not authenticated', 401));
    return handleAuthRequest(res, getUser, token);
};

export const setUserSession = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = req.body;
    if (!accessToken) return res.status(400).json(returnError('Missing access token', 400));
    return handleAuthRequest(res, setSession, accessToken, refreshToken);
};

export const loginWithProvider = async (req: Request, res: Response) => {
    const { provider } = req.body;

    if (!provider) return res.status(400).json(returnError('Provider is required', 400));

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
