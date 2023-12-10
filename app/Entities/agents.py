# Imports
from defaults import masterEntity
from services import ResultMonitor


class Customer(masterEntity):
    def __init__(self,cid,sample_size):
        self.id = cid
        self.purpose = ""
        self.monitorData = Monitoring['external'][cid]

    @self._process
    def setup ():
        pass
