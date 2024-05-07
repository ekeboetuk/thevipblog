import useSWR from 'swr';
import axios from 'axios';

export function usePosts(apiendpoint) {
    const fetcher = (url) => axios(url).then(response =>  {return response.data})
    const {data, error, isLoading, isValidating, mutate} = useSWR(process.env.REACT_APP_SERVER_URL + `/posts${apiendpoint}`,
        fetcher,
        {
            keepPreviousData: true,
            refreshInterval: 60000,
            shouldRetryOnError: false
        })

    return {
        posts: data,
        error: error,
        loading: isLoading,
        validating: isValidating,
        mutating: mutate,
    }
}

export function useUsers(apiendpoint) {
    const fetcher = ([url, credentials]) => axios(url, credentials).then(response =>  response.data)
    const {data, error, isLoading, mutate} = useSWR([process.env.REACT_APP_SERVER_URL + `/users${apiendpoint}`, {withCredentials:true}],
    fetcher,
    {
        shouldRetryOnError: false
    })

    return {
        users: data,
        error: error,
        loading: isLoading,
        mutating: mutate
    }
}

export function useUser(apiendpoint) {
    const fetcher = ([url, credentials]) => axios(url, credentials).then(response =>  response.data)
    const {data, error, isLoading, mutate} = useSWR([process.env.REACT_APP_SERVER_URL + `/user${apiendpoint}`, {withCredentials:true}],
    fetcher,
    {
        shouldRetryOnError: false
    })

    return {
        user: data,
        error: error,
        loading: isLoading,
        mutating: mutate
    }
}