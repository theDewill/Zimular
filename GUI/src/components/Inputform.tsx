"use client"
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";


//let inputs : any = [];


export default function Inputform(){

    const [inputs, setInputs] = useState([]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let toSendData = JSON.parse(JSON.stringify(inputs));

        toSendData.map((input : any) => {
            input.group.map((group : any) => {
                group.fields.map((field : any) => {
                    if(field.type === "text"){
                        field.value= e.target[field.id].value;
                    }else{
                        field.value = 0;//e.target[field.id].checked;
                    }
                })
            })
        })

      const queryString = `uid=1&data=${encodeURIComponent(JSON.stringify(toSendData))}`;    
      const apiUrl = `http://localhost:3005/sendInputs?${queryString}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        
    } catch (error) {
        console.error('Fetching error:', error);
        
    }
    }
    //const { data: session } = useSession();

    useEffect(() => {

      
      async function fetchData() {
        let tmpinputs = [];
        const response = await fetch(`http://localhost:3005/getui?uid=1`);
        const result = await response.json();
        tmpinputs.push(result.data);
        setInputs(tmpinputs);
        console.log("result ek recieved : " , result.data);
      }
    
      fetchData();
    }, [inputs]);

    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-10 mt-3">
                    <button type="submit" className="col-start-10 w-[100px] col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Run</button>
                </div>
                {inputs.map((input : any) => {
                    return(
                        input.group.map((group : any) => {
                            return(
                                <>
                                    <div key={group.group_id} className="text-lg  ml-3 font-extrabold">{group.name}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {group.fields.map((field : any)=>{
                                            return(
                                              
                                                <>
                                                  <div>
                                                    <label className="ml-4 mt-7">{field.name}</label>
                                                    {field.type === "text" ? (
                                                        <input className="border-2 border-black p-2 rounded-lg ml-3 mt-3"
                                                            type="text"
                                                            name={field.id}
                                                            defaultValue={field.defult_value}
                                                         />
                                                    ):(
                                                        <input className="ml-3 mt-6"
                                                            type="checkbox"
                                                            defaultChecked={field.defult_value === "true"}
                                                        />
                                                    )}
                                                  </div>
                                                </>
                                              
                                            )
                                        })}
                                    </div>
                                </>
                                
                            )
                        })
                    )
                })}
            </form>
        </div>
    )
}
