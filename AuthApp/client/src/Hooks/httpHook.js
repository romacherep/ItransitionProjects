import React, {useState, useCallback} from "react";
export default function useHttp(){
    const [loading, setLoading] = useState(false)
    const [error, setError]=useState(null)

    const request = useCallback(async (Url, method = 'GET', body = null, headers = {})=>{
        setLoading(true)
        try{
            headers['Content-Type'] = 'application/json'
            if(body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            let responce
            if(method == 'GET'){
                responce = await fetch(Url,{method,headers})
            } else {
                responce = await fetch(Url,{method,body,headers})
            }
            const Data = await responce.json()
            if(!responce.ok){
                throw new Error(Data.message || "Трабл в хуке")
            }
            setLoading(false)
            return Data
        }catch (errors){
            setLoading(false)
            setError(errors.message)
            throw errors
        }
    },[])
    return{loading, request, error}
}