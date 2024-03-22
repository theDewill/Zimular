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
    
    def get_db_name(self):
    
        '''
        This function is used to get the name of the database.
        '''

        if self.db_name == "":
            raise ValueError("Database name is not set")
        return self.db_name
    
    def get_mongo_uri(self):
        
        '''
        This function is used to get the mongo uri.
        '''
        
        if self.mongo_uri == "":
            raise ValueError("Mongo uri is not set")
        return self.mongo_uri
    
    def get_db_set_name(self):
        
        '''
        This function is used to get the name of the database set.
        '''

        if self.db_set_name == "":
            raise ValueError("Database set name is not set")
        return self.db_set_name
    
    def get_sim_table_name(self):
        
        '''
        This function is used to get the name of the simulation table.
        '''

        if self.sim_table_name == "":
            raise ValueError("Simulation table name is not set")
        return self.sim_table_name
    
    def get_buffer_size(self):
        
        '''
        This function is used to get the buffer size.
        '''

        if self.buffer_size == 0:
            raise ValueError("Buffer size is not set")
        return self.buffer_size

CONFIG = Config()

