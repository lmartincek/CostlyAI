import {Request, Response} from "express";
import pool from "../db/db";
import {groupByFn} from "../utils/parseHelpers";
import {throwError} from "../utils/responseErrorHandler";

export const getProducts = async (req: Request, res: Response) => {
    const { countryId, cityId } = req.query

    try {
        // Check Redis Cache First
        // const cacheData = await redisClient.get("products");
        // if (cacheData) {
        //     return res.json(JSON.parse(cacheData));
        // }
        const query = `
            SELECT *
            FROM products
            WHERE country_id = $1
            AND ${cityId ? `city_id = $2` : `$2::INTEGER IS NULL`};
        `;

        const { rows } = await pool.query(query, [countryId, cityId]);
        if (!rows.length) res.status(404).json({message:'products not found for this place'})

        // Store result in Redis for caching (optional)
        // await redisClient.setEx("products", 3600, JSON.stringify(result.rows));

        // TODO - toto cele prerobit, groupBy etc
        res.json(groupByFn(rows));
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Error retrieving products" });
    }
};

//todo steps
//1. pri mount appky, sa fetchne z DB, info o krajinach a mestach, --- DONE
//2. by mali mat aj znak ci uz maju produkty ulozene
//3. ak si user vyberie krajinu/mesto ktore ma uz produkty, fetchuje sa z db
//4. ak si user vyberie krajinu/mesto ktore v db nema nic ide na AI

export const saveProducts = async (req: Request, res: Response) => {
    try {
        const { countryId, cityId, products } = req.body
        console.log(req.body, products, 'save products to DB')

        // Get the categories (keys of the object)
        const categories = Object.keys(products);

        // Use `flatMap` to transform and combine the products
        const concatProducts = categories.flatMap(category =>
        // @ts-ignore
        //todo add product type
            products[category].map(product => ({
                ...product,
                category: category // Add the category to each product
            }))
        );

        const query = `
            INSERT INTO products (name, price, category, country_id, city_id)
            VALUES ($1, $2, $3, $4, $5)
        `;

        if (concatProducts.length) {
            for (const {name, price, category} of concatProducts) {
                await pool.query(query, [name,price, category, countryId, cityId])
            }
        }

        res.json({ message: "Products saved successfully!" });
    } catch (error) {
        console.error("Error saving products:", error);
        res.status(500).json({ message: "Error saving products" });
    }
};

export const getCountries = async (req: Request, res: Response) => {
    const query = `
        SELECT *
        FROM countries
        ORDER BY name ASC
    `;

    try {
        const { rows } = await pool.query(query)
        res.json(rows)
    } catch (error) {
        console.error("Error retrieving countries:", error);
        res.status(500).json({ message: "Error retrieving countries" });
    }
}

export const getCities = async (req: Request, res: Response) => {
    const { countryId } = req.query;

    const query = `
            SELECT *
            FROM cities
            WHERE country_id = $1
        `;

    try {
        const { rows } = await pool.query(query, [countryId])
        res.json(rows)
    } catch (error) {
        console.error("Error retrieving cities:", error);
        res.status(500).json({ message: "Error retrieving cities" });
    }
}