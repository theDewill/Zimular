import os
from ZIM.config import CONFIG



# database
DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable1"
MONGO_URI = "mongodb://localhost:27017"
BUFFER_SIZE = 1000
# "mongodb+srv://antiloger:077antiloger@cluster0.i9knr5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# API INPUT DATA
INPUT = {

    "user_id": "test_user_from_SIMINPUT.input_structure",
        "input": "Input_01",
        "group": [
          {
            "group_id": "test_01",
            "name": "Machine_count",
            "fields": [
              {
                "id": "in_01",
                "name": "modeling_machine_count",
                "type": "text",
                "defult_value": "5",
                "data_type": "int"
              },
              {
                "id": "in_02",
                "name": "inspection_machine_count",
                "type": "text",
                "defult_value": "5",
                "data_type": "int"
              },
              {
                "id": "in_03",
                "name": "packing_machine_count",
                "type": "text",
                "defult_value": "5",
                "data_type": "int"
              }
            ]
          },
          {
            "group_id": "test_02",
            "name": "Core_Data",
            "fields": [
                {
                "id": "in_04",
                "name": "Simualtion_time",
                "type": "text",
                "defult_value": "100",
                "data_type": "int"
                },
                {
                "id": "in_05",
                "name": "entity_per_time",
                "type": "text",
                "defult_value": "1",
                "data_type": "int"
                },
                {
                "id": "in_06",
                "name": "modeling_store_threshold",
                "type": "text",
                "defult_value": "10",
                "data_type": "int"
                },
                {
                "id": "in_07",
                "name": "inspection_store_threshold",
                "type": "text",
                "defult_value": "10",
                "data_type": "int"
                }
              ]
            }
          ]
          
}  # input data from API

SAVE_FOLDER = os.path.join(os.getcwd(), "save")

def run_ready():


    CONFIG.set_config(
        DBNAME,
        MONGO_URI,
        SETNAME,
        TABLENAME,
        SAVE_FOLDER,
        BUFFER_SIZE,
        INPUT
    )

