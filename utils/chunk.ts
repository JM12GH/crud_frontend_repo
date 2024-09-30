export const chunk = <T>(array: T[] | undefined, size: number): T[][] => {
    if (!array || !Array.isArray(array)) {
        return [];
    }

    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};
