import { useState, useCallback, useEffect } from 'react';

let logoutTimer;
export const useAuth=()=>{
    const [token, setToken] = useState(false)
    const [tokenExpirationDate, setTokenExpirationDate] = useState()
    const [userId, setUserId] = useState(null)

    const login = useCallback((userId, token,expirationDate) => {
        setToken(token)
        setUserId(userId)
        const tokenExpirationDate=expirationDate || new Date(new Date().getTime() + 1000*60*60)
        console.log(tokenExpirationDate)
        setTokenExpirationDate(tokenExpirationDate)
        localStorage.setItem('userData', JSON.stringify({ 
            userId: userId,
            token: token,
            expiration:tokenExpirationDate.toISOString() 
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setTokenExpirationDate(null)
        setUserId(null)
        localStorage.removeItem('userData')
    }, [])

    useEffect(()=>{
        if(token && tokenExpirationDate){
            console.log(tokenExpirationDate)
            const remainingTime=tokenExpirationDate.getTime() -new Date().getTime()
            logoutTimer=setTimeout(logout,remainingTime)
        }else{
            clearTimeout(logoutTimer)
        }
    },[token,logout,tokenExpirationDate])

    useEffect(() => {
        const storedData=JSON.parse(localStorage.getItem('userData'))
        if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
            login(storedData.userId,storedData.token,new Date(storedData.expiration))
        }
    }, [login])

    return {token,login,logout,userId}
}