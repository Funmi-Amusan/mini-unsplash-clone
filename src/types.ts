export type Image = {
    id: string;
    urls: {
        regular: string;
        full: string;
    };
    user: {
        name: string;
        location: string;
    };
    height: number;
    width: number;
    alt_description: string;
    color: string;
} | null;