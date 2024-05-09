import { useState, useEffect } from 'react';

import axios from 'axios';

export const useToken = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

  useEffect(()=>{
      if(token == null) return
      (async function(){
        await axios.get(process.env.REACT_APP_SERVER_URL + `/user/${token?.id}`,{
          withCredentials: true
        })
        .then((response) => {
            return setToken(response.data)
        })
        .catch((error) => {
            if(error.request && error.response?.status >= 500){
              return null
            }else if(error.response?.status >= 400 && error.response?.status < 500){
              removeToken()
            }
        })
      }
    )()
  },[])

  const saveToken = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    setToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem("token")
    document.cookie = `session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${process.env.REACT_APP_SERVER_DOMAIN}; path=/;`;
    setToken()
  }

  return {
    setToken: saveToken,
    token,
    unsetToken: removeToken
  }
}