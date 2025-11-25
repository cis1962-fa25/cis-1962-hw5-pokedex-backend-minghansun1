export function dashToCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
}

export function dashToTitleCaseWithSpace(str: string): string {
    let words = str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}