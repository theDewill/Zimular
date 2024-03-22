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

