

export const useFetcher = () => {
     const fetcher = (url: string) => fetch(url).then(res => res.json());
    return { fetcher }
}