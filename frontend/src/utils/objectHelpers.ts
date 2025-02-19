export const  fixAndParseJSON = (str: string): {} | void => {
    const [key, value] = str.split(/:(.+)/);
    if (!key || !value) throw new Error("Invalid input format");

    return JSON.parse(`{"${key.trim()}": ${value.trim()}}`);
}