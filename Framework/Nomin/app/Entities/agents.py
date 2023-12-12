#---agents Dictionery must be of entity objects with their identifiers as keys () - service ekt
agents = {}
# Imports
from defaults import masterEntity
from services import ResultMonitor 



class Customer(masterEntity):
    def __init__(self,cid,sample_size):
        self.id = cid
        self.purpose = ""
        self.monitorData = ResultMonitor(cid,'ext')

    @self._process
    def setup ():
        pass






#object creation Area....
agents['customer'] = Customer