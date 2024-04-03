import { useState, useEffect, useRef } from 'react';

import axios from 'axios';

export const useToken = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const tokenRef = useRef(token)

  useEffect(()=>{
    if(token){
      (async function(){
          await axios.get(process.env.REACT_APP_SERVER_URL + `/user/${JSON.parse(localStorage.getItem("token"))?.id}`)
          .then((response) => {
              tokenRef.current = response.data
              localStorage.setItem('token', JSON.stringify(response.data))
              setToken(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
      })()
    }
  },[])

  const saveToken = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    tokenRef.current = token
    setToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem("token")
    document.cookie = "authorization_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    tokenRef.current = null
    setToken()
  }

  return {
    setToken: saveToken,
    token,
    tokenRef,
    unsetToken: removeToken
  }
}