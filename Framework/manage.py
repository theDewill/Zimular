import sys
import os
from ZIM.file_manager import FileHandler, InputHandler

#file paths
SAVE_FOLDER = os.path.join(os.path.dirname("/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/MultiAPI/ModelApi/JSON/outputs/outputs.json"))
INPUT_STRUCT_PATH = "/Users/nominsendinu/DEWILL/CODE/Projects/Zimular/ZIM/API/MultiAPI/ModelApi/JSON/recieved"  # path to input structure file( probably inside api folder)


#simulation goble objects
FILERHANDLER = FileHandler(SAVE_FOLDER=SAVE_FOLDER)
SIMINPUT = InputHandler()

#API INPUT DATA
DUMMY_INPUT = {}  # input data from API


def build(fileHandler, input_struct, inputStructPath):
    fileHandler.check_folder_tree()
    fileHandler.create_input_structure(
        inputStructPath=inputStructPath,
        inputStruct=input_struct
    )


def runReady(fileHandler, inputHandler):
    fileHandler.create_output_data_folder()
    #get input file from socket and store in output/newoutputfolder/input
    inputfilepath = fileHandler.create_input_structure(
        inputStructPath=INPUT_STRUCT_PATH,
        inputStruct=DUMMY_INPUT
    )
    inputHandler.setInput(inputfilepath)
    #run simulation
    print("running simulation")

def main():
    arg = sys.argv[1]

    print(arg)

if __name__ == "__main__":
    main()