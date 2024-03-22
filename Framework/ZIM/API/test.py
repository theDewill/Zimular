component_input_dict = {
    "REQUEST_HEAD": {
        "from": "server",
        "to": "client",
        "json_type": "component_input",
    },
    "REQUEST_BODY": {
        "component": {
            "resources": {
                "component_name1": {
                    "input_table": True,
                    "description": "description1",
                    "input_values": {
                        "input_value1": {"default": "default_value1"},
                        "input_value2": {"default": "default_value2"}
                    }
                },
                "component_name2": {
                    "input_table": True,
                    "description": "description2",
                    "input_values": {
                        "input_value1": {"default": "default_value1"},
                        "input_value2": {"default": "default_value2"}
                    }
                }
            },
            "containers": {
                "component_name1": {
                    "input_table": True,
                    "description": "description1",
                    "input_values": {
                        "input_value1": {"default": "default_value1"},
                        "input_value2": {"default": "default_value2"}
                    }
                },
                "component_name2": {
                    "input_table": True,
                    "description": "description2",
                    "input_values": {
                        "input_value1": {"default": "default_value1"},
                        "input_value2": {"default": "default_value2"}
                    }
                }
            }
        }
    }
}

sim_inputs = {
    "REQUEST_HEAD": {
        "from": "client",
        "to": "server",
        "json_type": "simulation_input",
    },
    "REQUEST_BODY": {
        "simulation_run_time": {
            "input_table": True,
            "default": True
        },
        "simulation_start_time": {
            "input_table": True,
            "default": True
        },
        "simulation_end_time": {
            "input_table": True,
            "default": True
        },
        "entity": {
            "entity_name1": {
                "input_table": True,
                "enabled": True,
                "inputs": {
                    "input_value1": "input_value1",
                    "input_value2": "input_value2"
                }
            },
            "entity_name2": {
                "input_table": True,
                "enabled": True,
                "inputs": {
                    "input_value1": "input_value1",
                    "input_value2": "input_value2"
                }
            }
        }
    },
}

# from frontend to backend

run_outputs = {
    "REQUEST_HEAD": {

    },
    "REQUEST_BODY": {
        "simulation_run_time": {"value": True},
        "simulation_start_time": {"value": True},
        "simulation_end_time": {"value": True},
        "entity": {
            "entity_name1": {
                "enabled": True,
                "inputs": {
                    "input_value1": "input_value1",
                    "input_value2": "input_value2"
                }
            },
            "entity_name2": {
                "enabled": True,
                "inputs": {
                    "input_value1": "input_value1",
                    "input_value2": "input_value2"
                }
            }
        }
    }
}