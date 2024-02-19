import { useState } from 'react';

export const useToken = () => {
  const getToken = () => {
      const token = localStorage.getItem("token");
      return JSON.parse(token);
    };

    const [token, setToken] = useState(getToken);

    const saveToken = userToken => {
      localStorage.setItem("token", JSON.stringify(userToken));
      setToken(userToken);
    };

    const removeToken = () => {
      localStorage.removeItem("token")
      document.cookie = "authorization_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setToken()
    }

    return {
      setToken: saveToken,
      token,
      unsetToken: removeToken
    }
  }