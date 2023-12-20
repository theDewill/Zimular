import simpy as sp
from engine import env

class masterResource:
    def __init__():
        self.env = env
        self._resource = None
        self._store = "" #TODO: here apply the container or any simpy container part
    

    def AllocateResource(count=1,capacity=10):
        self._resource = sp.Resource(self.env,count,capacity)
    

    def _process(process): 
        def process_handler():
            #decorator for user difined resource process
            pass
        return process_handler

class masterEntitiy():
    def __init__():
        pass

    def _process(process): 
        def process_handler():
            #deocrator for user defined entity process
            pass

        return process_handler


