import useSWR from 'swr';
import axios from 'axios';

export function usePosts(apiendpoint) {
    const fetcher = (url) => axios(url).then(response =>  response.data)
    const {data, error, isLoading, mutate} = useSWR(process.env.REACT_APP_SERVER_URL + `/post${apiendpoint}`, fetcher, {
        refreshInterval: 3000,
        keepPreviousData: true
      })

    return [
        data,
        error,
        isLoading,
        mutate
    ]
}

export function useUsers() {
    const fetcher = (url) => axios(url).then(response =>  response.data)
    const {data, error, isLoading, mutate} = useSWR(process.env.REACT_APP_SERVER_URL + `/users`, fetcher)

    return [
        data,
        error,
        isLoading,
        mutate
    ]
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