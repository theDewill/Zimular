import os
from ZIM.file_manager import FileHandler, InputHandler

# database
DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable1"
MONGO_URI = "mongodb://localhost:27017"
# "mongodb+srv://antiloger:077antiloger@cluster0.i9knr5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


# file paths
SAVE_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sim_db")
INPUT_STRUCT_PATH = ""  # path to input structure file( probably inside api folder)


# simulation goble objects
FILERHANDLER = FileHandler(SAVE_FOLDER=SAVE_FOLDER)
SIMINPUT = InputHandler()



#TEMP TODO: remove this
SIMINPUT.input_structure = {
    "user_id": "test_user_from_SIMINPUT.input_structure now updated",
      "input":"Input_01",
      "group": [
        {
          "group_id": "test_01",
          "name" : "Resource_01_now_testing",
          "fields": [
            {
              "id" : "in_01",
              "name" : "Input 01",
              "type": "text",
              "defult_value": "test_01",
              "data_type": "string"
            },
            {
              "id" : "in_02",
              "name" : "Input 02",
              "type": "text",
              "defult_value": "test_02",
              "data_type": "string"
            },
            {
              "id" : "in_03",
              "name" : "Input 03",
              "type": "text",
              "defult_value": "test_03",
              "data_type": "number"
            },
            {
              "id" : "in_04",
              "name" : "Input 04",
              "type": "checkbox",
              "defult_value": "false",
              "data_type": "bool"
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
              "data_type": "string"
            },
            {
              "id" : "in_06",
              "name" : "Input 06",
              "type": "text",
              "defult_value": "test_06",
              "data_type": "string"
            },
            {
              "id" : "in_07",
              "name" : "Input 07",
              "type": "text",
              "defult_value": "test_07",
              "data_type": "number"
            },
            {
              "id" : "in_08",
              "name" : "Input 08",
              "type": "checkbox",
              "defult_value": "false",
              "data_type": "bool"
            }
          ]
        }
      ]
}


# API INPUT DATA
DUMMY_INPUT = {
    "group 1": {
        "name": "",
        "counter_t1": {
            "value": 2,
            "default": "trutyle={{ height: '100%', width: '100e",
        },
        "input 2": {"value": "", "default": "true"},
        "input 3": {"value": "", "default": "true"},
    }
}  # input data from API


def build(fileHandler, input_struct, inputStructPath):
    fileHandler.check_folder_tree()
    fileHandler.create_input_structure(
        inputStructPath=inputStructPath, inputStruct=input_struct
    )


def runReady():
    FILERHANDLER.create_output_data_folder()
    
    # get input file from socket and store in output/newoutputfolder/input

    # Nomin : u should get the input data from the socket and create a variable to store the input data
    # and then u can pass to setdefaultstruct() (for only test)

    # inputfilepath = fileHandler.create_input_structure(
    #     inputStructPath=INPUT_STRUCT_PATH,
    #     inputStruct=DUMMY_INPUT
    # )
    # inputHandler.setInput(inputfilepath)
    SIMINPUT.setdefaultstruct(DUMMY_INPUT)
    print(SIMINPUT.input_structure)
