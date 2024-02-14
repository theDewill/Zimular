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
                        "name" : "name",
                        "label" : "Input 1",
                        "required" : true,
                    },
                    {
                        "id": "input2",
                        "name" : "name2",
                        "label" : "Input 2",
                        "required" : true,
                    },
                    {
                        "id": "input3",
                        "name" : "name3",
                        "label" : "Input 3",
                        "required" : true,
                    },
                    {
                        "id": "input4",
                        "name" : "name4",
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
                        "name" : "name",
                        "label" : "Input 1",
                        "required" : true,
                    },
                    {
                        "id": "input2",
                        "name" : "name2",
                        "label" : "Input 2",
                        "required" : true,
                    },
                    {
                        "id": "input3",
                        "name" : "name3",
                        "label" : "Input 3",
                        "required" : true,
                    },
                    {
                        "id": "input4",
                        "name" : "name4",
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
                        <div key={item.group_id}>
                            <h2>{item.group_name}</h2>
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