export type JobData = {
    to: string | string[];
    subject: string;
    template?: string;
    context: Record<string, string | number | boolean>
}