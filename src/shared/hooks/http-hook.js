import {useState, useCallback,useRef,useEffect} from 'react'

export const useHttpClient=()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest=useCallback ( async (url,method='GET',body=null,headers={})=>{

        setIsLoading(true);
        //This is an API supported in modern browsers.
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const response = await fetch(url, {
              method,
              body,
              headers,
              signal: httpAbortCtrl.signal
            });
    
            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            )
    
            if (!response.ok) {
              throw new Error(responseData.message);
            }
    
            setIsLoading(false);
            return responseData;
          } catch (err) {
              console.log(err)
            setError(err.message);
            setIsLoading(false);
            throw err;
          }
    },[])

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        //this return function is executed as a cleanup function before the next time use effect runs again
        return () => {
            //request to which it is linked will therefore be aborted.
          activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    },[])

    return {isLoading,error,sendRequest,clearError}
}