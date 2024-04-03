import useSWR from 'swr';
import axios from 'axios';

export function usePosts(apiendpoint) {
    const fetcher = (url) => axios(url).then(response =>  {return response.data})
    const {data, error, isLoading, isValidating, mutate} = useSWR(process.env.REACT_APP_SERVER_URL + `/posts${apiendpoint}`,
        fetcher,
        {
            keepPreviousData: true,
            refreshInterval: 10000
        })

    return {
        posts: data,
        error,
        isLoading,
        isValidating,
        mutate,
    }
}

export function useUsers(apiendpoint) {
    const fetcher = (url) => axios(url).then(response =>  response.data)
    const {data, error, isLoading, mutate} = useSWR(process.env.REACT_APP_SERVER_URL + `/user${apiendpoint}`, fetcher)

    return {
        users: data,
        isError: error,
        isLoading,
        mutate
    }
}

export function useUser() {
    const fetcher = (url) => axios(url).then(response =>  response.data)
    const {data, error, isLoading, mutate} = useSWR(process.env.REACT_APP_SERVER_URL + `/user/login`, fetcher)

    return [
        data,
        error,
        isLoading,
        mutate
    ]
}