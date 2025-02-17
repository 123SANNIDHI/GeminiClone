 import { createContext, useState } from "react";
 import run from '../config/gemini';

 export const Context=createContext();

 const Contextprovider=(props)=>{

    const[input,setInput]=useState("");
    const[recentPromt,setRecentPromt]=useState("");
    const[prevPromts,setPrevPromts]=useState([]);
    const[showResult,setShowresult]=useState(false);
    const[loading,setloading]=useState(false);
    const[resultData,setResultData]=useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat=()=>{
        setloading(false)
        setShowresult(false)
    }

    const onSent=async(prompt)=>{
        setResultData("")
        setloading(true)
        setShowresult(true)
        let response;
        if(prompt !==undefined){
            response = await run(prompt);
            setRecentPromt(prompt)
        }
        else{
            setPrevPromts(prev=>[...prev,input])
            setRecentPromt(input)
            response = await run(input)
        }
   
        
        let responsearray=response.split("**");
        let newResponse="";
        for(let i=0;i<responsearray.length;i++)
        {
            if(i===0 || i%2!==1){
                newResponse+=responsearray[i];
            }
            else{
                newResponse+="<b>"+responsearray[i]+"</b>";
            }
        }
        let newResponse2=newResponse.split("*").join("</br>")
        let newResponsearray=newResponse2.split(" ");
        for(let i=0;i<newResponsearray.length;i++)
            {
            const nextWord=newResponsearray[i];
            delayPara(i,nextWord+" ")
        }
        setloading(false)
        setInput("")

    }
    // onSent("What you mean by love")
    const contextValue={
        prevPromts,
        setPrevPromts,
        onSent,
        recentPromt,
        setRecentPromt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat

    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
 }
 export default Contextprovider;