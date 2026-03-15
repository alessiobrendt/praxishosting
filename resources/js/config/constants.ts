export const META_DATA = {
    name: typeof import.meta.env.VITE_APP_NAME === 'string'
        ? import.meta.env.VITE_APP_NAME
        : 'Laravel',
    title: '',
    description: '',
    author: '',
    username: '',
};

export const currentYear = new Date().getFullYear();
