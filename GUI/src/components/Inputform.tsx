"use client"
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const inputs_test = [
    {
      "user_id": "test_user_id",
      "input":"Input_01",
      "group": [
        {
          "group_id": "test_01",
          "name" : "Resource_01",
          "fields": [
            {
              "id" : "in_01",
              "name" : "Input 01",
              "type": "text",
              "defult_value": "test_01",
              "data_type": "string",
            },
            {
              "id" : "in_02",
              "name" : "Input 02",
              "type": "text",
              "defult_value": "test_02",
              "data_type": "string",
            },
            {
              "id" : "in_03",
              "name" : "Input 03",
              "type": "text",
              "defult_value": "test_03",
              "data_type": "number",
            },
            {
              "id" : "in_04",
              "name" : "Input 04",
              "type": "checkbox",
              "defult_value": "false",
              "data_type": "bool",
            }
          ]
        },
        {
          "group_id": "test_02",
          "name" : "Resource_02",
          "fields": [
            {
              "id" : "in_05",
              "name" : "Input 05",
              "type": "text",
              "defult_value": "test_05",
              "data_type": "string",
            },
            {
              "id" : "in_06",
              "name" : "Input 06",
              "type": "text",
              "defult_value": "test_06",
              "data_type": "string",
            },
            {
              "id" : "in_07",
              "name" : "Input 07",
              "type": "text",
              "defult_value": "test_07",
              "data_type": "number",
            },
            
            
            {
              "id" : "in_08",
              "name" : "Input 08",
              "type": "checkbox",
              "defult_value": "false",
              "data_type": "bool",
            }
          ]
        }
      ]
    }
  ]


let inputs : any = [];

export default function Inputform(){

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let toSendData = JSON.parse(JSON.stringify(inputs));

        toSendData.map((input : any) => {
            input.group.map((group : any) => {
                group.fields.map((field : any) => {
                    if(field.type === "text"){
                        field.value= e.target[field.id].value;
                    }else{
                        field.value = e.target[field.id].checked;
                    }
                })
            })
        })

      const queryString = `data=${encodeURIComponent(JSON.stringify(toSendData))}`;    
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
    const { data: session } = useSession();

    useEffect(() => {
      async function fetchData() {
        const response = await fetch(`http://localhost:3005/getui?uid=1&simID=1`);
        const result = await response.json();
        inputs.push(result.data);
        console.log("result ek recieved : " , inputs);
      }
    
      fetchData();
    }, []);

    

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
