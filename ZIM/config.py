import time

class Config:

    '''
    This class is used to store the configuration of the simulation.
    '''

    def __init__(self) -> None:
        self.db_name = ""
        self.mongo_uri = ""
        self.db_set_name = ""
        self.sim_table_name = ""
        self.save_folder = ""
        self.buffer_size = 0
        self.input_struct = {}
        self.api_input = {}

    def __str__(self) -> str:
        return f"db_name: {self.db_name}, mongo_uri: {self.mongo_uri}, db_set_name: {self.db_set_name}, sim_table_name: {self.sim_table_name}, save_folder: {self.save_folder}, buffer_size: {self.buffer_size}, input_struct: {self.input_struct}"
    
    def set_config(self, db_name, mongo_uri, db_set_name, sim_table_name, save_folder, buffer_size, input_struct):
        
        '''
        This function is used to set the configuration of the simulation.
        '''
        
        self.db_name = db_name
        self.mongo_uri = mongo_uri
        self.db_set_name = db_set_name
        self.sim_table_name = self.set_sim_name(sim_table_name)
        self.save_folder = save_folder
        self.buffer_size = buffer_size
        self.input_struct = input_struct

    def set_sim_name(self, sim_name):
        
        '''
        This function is used to set the name of the simulation.
        '''
        
        name = f"{sim_name}_{time.time()}"
        return name
    
    def get_db_name(self) -> str:
    
        '''
        This function is used to get the name of the database.
        '''

        if self.db_name == "":
            raise ValueError("Database name is not set")
        return self.db_name
    
    def get_mongo_uri(self) -> str:
        
        '''
        This function is used to get the mongo uri.
        '''
        
        if self.mongo_uri == "":
            raise ValueError("Mongo uri is not set")
        return self.mongo_uri
    
    def get_db_set_name(self) -> str:
        
        '''
        This function is used to get the name of the database set.
        '''

        if self.db_set_name == "":
            raise ValueError("Database set name is not set")
        return self.db_set_name
    
    def get_sim_table_name(self) -> str:
        
        '''
        This function is used to get the name of the simulation table.
        '''

        if self.sim_table_name == "":
            raise ValueError("Simulation table name is not set")
        return self.sim_table_name
    
    def get_buffer_size(self) -> int:
        
        '''
        This function is used to get the buffer size.
        '''

        if self.buffer_size == 0:
            raise ValueError("Buffer size is not set")
        return self.buffer_size

    def set_api_input(self, api_input: dict):
        
        '''
        This function is used to set the api input.
        '''

        self.api_input = api_input

    def getinput(self, group_name, input_name):
        for group in self.input_struct["group"]:
            if group["name"] == group_name:
                for field in group["fields"]:
                    if field["name"] == input_name:
                        value = field.get("value", field["defult_value"])
                        data_type = field["data_type"]
                        if value == "":
                            value = field["defult_value"]
                        if data_type == "string":
                            return str(value)
                        elif data_type == "int":
                            return int(value)
                        elif data_type == "float":
                            return float(value)
                        elif data_type == "bool":
                            return value.lower() == "true"
        return None  # If group or input name not found

    
    

CONFIG = Config()

