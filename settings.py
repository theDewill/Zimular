import os
from ZIM.config import CONFIG



# database
DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable1"
MONGO_URI = "mongodb://admin:pass2@127.0.0.1:27018"
BUFFER_SIZE = 1000
# "mongodb+srv://antiloger:077antiloger@cluster0.i9knr5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# API INPUT DATA
INPUT = {
    # "group 1": {
    #     "name": "",
    #     "counter_t1": {
    #         "value": 2,
    #         "default": "trutyle={{ height: '100%', width: '100e",
    #     },
    #     "input 2": {"value": "", "default": "true"},
    #     "input 3": {"value": "", "default": "true"},
    # }
    "user_id": "test_user_from_SIMINPUT.input_structure",
        "input": "Input_01",
        "group": [
          {
            "group_id": "test_01",
            "name": "Resource_01_now_testing",
            "fields": [
              {
                "id": "in_01",
                "name": "Input 01",
                "type": "text",
                "defult_value": "test_01",
                "data_type": "string"
              },
              {
                "id": "in_02",
                "name": "Input 02",
                "type": "text",
                "defult_value": "test_02",
                "data_type": "string"
              },
              {
                "id": "in_03",
                "name": "Input 03",
                "type": "text",
                "defult_value": "test_03",
                "data_type": "number"
              },
              {
                "id": "in_04",
                "name": "Input 04",
                "type": "checkbox",
                "defult_value": "false",
                "data_type": "bool"
              }
            ]
          },
          {
            "group_id": "test_02",
            "name": "Resource_02",
            "fields": [
              {
                "id": "in_05",
                "name": "Input 05",
                "type": "text",
                "defult_value": "test_05",
                "data_type": "string"
              },
              {
                "id": "in_06",
                "name": "Input 06",
                "type": "text",
                "defult_value": "test_06",
                "data_type": "string"
              },
              {
                "id": "in_07",
                "name": "Input 07",
                "type": "text",
                "defult_value": "test_07",
                "data_type": "number"
              },
              {
                "id": "in_08",
                "name": "Input 08",
                "type": "checkbox",
                "defult_value": "false",
                "data_type": "bool"
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

