import {NextFunction, Request, Response} from "express";
import {returnError} from "../utils/responseErrorHandler";
import {addProducts, fetchCities, fetchCountries, fetchProducts} from "../services/generalService";
import {FailedResponse} from "../types/responseStatus";
import {Product, ProductAIResponse} from "../types/products";

export const getCountries = async (req: Request, res: Response, next: NextFunction) => {
    const countries = await fetchCountries()

    if ('error' in countries) {
        const { error, statusCode } = countries as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(countries)
}

export const getCities = async (req: Request, res: Response) => {
    const { countryId } = req.query;

    if (!countryId) {
        return res.status(400).json(returnError('countryId is required', 400));
    }

    const cities = await fetchCities(Number(countryId))
    if ('error' in cities) {
        const { error, statusCode } = cities as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(cities);
}

export const getProducts = async (req: Request, res: Response) => {
    const { countryId, cityId } = req.query;

    if (!countryId) {
        return res.status(400).json(returnError('countryId is required', 400));
    }

    const products = await fetchProducts(Number(countryId), cityId ? Number(cityId) : null);

    if ('error' in products) {
        const { error, statusCode } = products as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(products);
};

export const saveProducts = async (req: Request, res: Response) => {
    const { countryId, cityId, products } = req.body

    const invalidProduct = products.find(
        (product: ProductAIResponse) => !product.name || !product.price || !product.category
    );
    if (invalidProduct) {
        return res.status(400).json(returnError('Missing required fields in one or more products', 400));
    }

    const mappedProducts = products.map((product: ProductAIResponse): Product => {
        return {
            ...product,
            country_id: countryId,
            city_id: cityId ?? null
        };
    })

    const message = await addProducts(mappedProducts);

    if (message && 'error' in message) {
        const { error, statusCode } = message as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    //TODO - when supabase accepts data it returns null, thus the message is null = rewrite later
    return res.status(201).json({ message: "Products saved successfully!" });
};