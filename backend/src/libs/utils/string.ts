export function fillMTBTemplate(template: string, data: Record<string, string>) {
    let result = template;

    for (const key in data) {
        const value = data[key];
        result = result.replaceAll(new RegExp(`{{${key}}}`, "g"), value);
    }

    return result;
}


export function toEventListenerName(str: string) {
    return str
        .replace(/Event$/, "")
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}