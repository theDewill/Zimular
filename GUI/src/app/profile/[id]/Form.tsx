import React from "react";
import { TextField } from "@mui/material";



const data = {
    "form": {
        "group": [
            {
                "group_id": "1",
                "group_name": "Group 1",
                "fields":[
                    {
                        "id": "input1",
                        "name" : "",
                        "label" : "Input 1",
                        "required" : true,
                    },
                    {
                        "id": "input2",
                        "name" : "",
                        "label" : "Input 2",
                        "required" : true,
                    },
                    {
                        "id": "input3",
                        "name" : "",
                        "label" : "Input 3",
                        "required" : true,
                    },
                    {
                        "id": "input4",
                        "name" : "",
                        "label" : "Input 4",
                        "required" : true,
                    }
                ]
            },
            {
                "group_id": "2",
                "group_name": "Group 2",
                "fields": [
                    {
                        "id": "input1",
                        "name" : "",
                        "label" : "Input 1",
                        "required" : true,
                    },
                    {
                        "id": "input2",
                        "name" : "",
                        "label" : "Input 2",
                        "required" : true,
                    },
                    {
                        "id": "input3",
                        "name" : "",
                        "label" : "Input 3",
                        "required" : true,
                    },
                    {
                        "id": "input4",
                        "name" : "",
                        "label" : "Input 4",
                        "required" : true,
                    }
                ]
            }
        ]
    }
}

export default function Form() {
    return (
        <form>
            {
                data.form.group.map((item) => {
                    return (
                        <div className="mb-6  space-x-10 space-y-6" key={item.group_id}>
                            <h2 className="mb-5 pl-5">{item.group_name}</h2>
                            {
                                item.fields.map((field) => {
                                    return(
                                        
                                        <TextField 
                                            key={field.id}
                                            label={field.label}
                                            required={field.required}
                                            variant="outlined"
                                            defaultValue={field.name}
                                            size="small"
                                        />
                                        
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </form>
    )
}