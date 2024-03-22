import os
from ZIM.file_manager import FileHandler, InputHandler
from ZIM.config import CONFIG


# database
DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable1"
MONGO_URI = "mongodb://localhost:27017"
BUFFER_SIZE = 1000
# "mongodb+srv://antiloger:077antiloger@cluster0.i9knr5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


# file paths
SAVE_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sim_db")
INPUT_STRUCT_PATH = ""  # path to input structure file( probably inside api folder)


# simulation goble objects
FILERHANDLER = FileHandler(SAVE_FOLDER=SAVE_FOLDER)
SIMINPUT = InputHandler()

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

CONFIG.set_config(
    DBNAME,
    MONGO_URI,
    SETNAME,
    TABLENAME,
    SAVE_FOLDER,
    BUFFER_SIZE,
    SIMINPUT.input_structure,
)