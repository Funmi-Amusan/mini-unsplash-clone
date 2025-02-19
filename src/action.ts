import axios from 'axios';
import type { Image } from './types';

const clientId = import.meta.env.VITE_CLIENT_ID;

export const fetchImagesAction = async (query: string, page: number, limit: number) => {
    let images: Image[] = [];
    let hasMore = true;
    let loading = true;

    try {
        const response = await axios.get(
            query ? 'https://api.unsplash.com/search/photos' : 'https://api.unsplash.com/photos',
            {
                params: {
                    client_id: clientId,
                    per_page: limit,
                    page: page,
                    query: query || undefined
                }
            }
        );

        images = query ? response.data.results : response.data;
        hasMore = images.length === limit;
    } catch (error) {
        console.error(error);
        loading = false;
    }

    return {
        images,
        hasMore,
        loading
    };
};
