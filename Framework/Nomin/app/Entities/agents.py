#---agents Dictionery must be of entity objects with their identifiers as keys () - service ekt
agentList = {}
sampleSize = 100 # change this based on your sample
# Imports
from defaults import masterEntity
from services import ResultMonitor,CreateSample 



class Customer(masterEntity):
    def __init__(self,cid):
        self.id = cid
        self.purpose = ""
        self.monitorData = ResultMonitor(cid,'ext')

    #@self._process
    def setup ():
        pass


CreateSample(agentList,Customer,'customer',sampleSize) #writeable#

print("sampleCreated!!")

