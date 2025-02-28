export const  fixAndParseJSON = (str: string): {} | void => {
    const [key, value] = str.split(/:(.+)/);
    if (!key || !value) throw new Error("Invalid input format");

    return JSON.parse(`{"${key.trim()}": ${value.trim()}}`);
}

export const groupProductsByCategory = (products: Product[]): ProductGroups => {
    return products.reduce((acc: ProductGroups, product: Product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {
        // TODO not working..
        [ProductCategory.GROCERIES]: [] as Product[],
        [ProductCategory.SERVICES]: [] as Product[],
        [ProductCategory.OTHERS]: [] as Product[]
    });
};
