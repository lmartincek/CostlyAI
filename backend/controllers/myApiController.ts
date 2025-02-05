import {Request, Response} from "express";
import pool from "../db/db";

const groupByFn = (products: {id: number, category: string, name: string}[]) => {
    return products.reduce((x, y) => {
        // @ts-ignore
        (x[y.category] = (x[y.category] || [])).push(y);
        return x;
    }, {})
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        // Check Redis Cache First
        // const cacheData = await redisClient.get("products");
        // if (cacheData) {
        //     return res.json(JSON.parse(cacheData));
        // }
        const query = `
            SELECT *
            FROM products
            ORDER BY  id ASC
        `;

        const { rows } = await pool.query(query);

        const groupedResult = groupByFn(rows) || null;
        if (!groupedResult) throw new Error('Unable to group products')

        // TODO - toto cele prerobit, groupBy etc
        console.log(groupedResult)
        // Store result in Redis for caching (optional)
        // await redisClient.setEx("products", 3600, JSON.stringify(result.rows));

        res.json(groupedResult);
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

export const saveProducts = async (req: Request, res: Response, products: any) => {
    try {
        //todo use this in externalapicontroller

        console.log(products, 'save products to DB')

        // const query = `
        //     INSERT INTO products (name, price, category, country_id, city_id)
        //     VALUES ($1, $2, $3, $4, $5)
        // `

        // for (const [name, price] of Object.entries(aiData)) {
        //     await pool.query(query, [name, price, ]);
        // }
        //
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
    const { countryId } = req.params; // Extract countryId from the URL
    console.log(req, 'halooo')

    const query = `
            SELECT *
            FROM cities
            WHERE country_id = $1;
        `;

    try {
        const { rows } = await pool.query(query, [countryId])
        res.json(rows)
    } catch (error) {
        console.error("Error retrieving cities:", error);
        res.status(500).json({ message: "Error retrieving cities" });
    }
}