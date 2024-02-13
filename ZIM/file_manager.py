import os
from datetime import datetime
import uuid
from abc import ABC, abstractmethod
import json


class FileHandler:
    def __init__(self, SAVE_FOLDER):
        self.SAVE_FOLDER = SAVE_FOLDER
        self.INPUT_FOLDER = os.path.join(SAVE_FOLDER, "input")
        self.OUTPUT_FOLDER = os.path.join(SAVE_FOLDER, "output")
        self.INPUT_FOLDER_CONFIG = os.path.join(self.INPUT_FOLDER, "config")
        self.OUTPUT_FOLDER_DATA = os.path.join(self.OUTPUT_FOLDER, "data")

        self.check_folder_tree()

    def check_folder_tree(self):
        '''
        Check if the folder tree exists. If not, create it.
        '''

        for dir in [self.INPUT_FOLDER, self.OUTPUT_FOLDER, self.INPUT_FOLDER_DATA, self.INPUT_FOLDER_CONFIG, self.OUTPUT_FOLDER_DATA]:
            if not os.path.exists(dir):
                print(f'{dir} does not exist. Creating...')
                os.makedirs(dir)
            else:
                print(f'{dir} exists.')

    def create_input_structure(self):
        pass

    def create_output_data_folder(self):
        '''
        Create a folder for the output data files
        '''

        folder_name = self.create_odf_name()
        folder_path = os.path.join(self.OUTPUT_FOLDER_DATA, folder_name)
        os.makedirs(folder_path)

        return folder_name, folder_path

    def create_odf_name(self):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_id = str(uuid.uuid4())

        return f'odf_{timestamp}_{unique_id}'
        

class InputHandler:
    def __init__(self, input_struct):

        self.input_structure = input_struct
        self.input_data_path = ""

    @staticmethod
    def buildInput(inputStructPath, inputStruct):
        filename = os.path.join(inputStructPath, "input_struct.json")

        with open(filename, "w") as file:
            json.dump(inputStruct, file)

        return filename
        

    def getInput(self, input_group, input_name, default):
        pass

    def setInputPath(self, inputStructPath, file_name):
        file_set = os.path.join(inputStructPath, file_name)
        self.input_data_path = file_set
        return file_set
        
    def checkInput(self):
        pass
