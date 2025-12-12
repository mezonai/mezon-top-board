export function fillMTBTemplate(template: string, data: Record<string, string>) {
    let result = template;

    for (const key in data) {
        const value = data[key];
        result = result.replaceAll(new RegExp(`{{${key}}}`, "g"), value);
    }

    return result;
}