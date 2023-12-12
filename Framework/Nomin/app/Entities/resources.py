import sys,os
import simpy as sp
from defaults import masterResource
from services import ResultMonitor


resourceList = {} #this will hold all resource instances

class hotelCashier(masterResource):

    def __init__(self, rid):
        self.id = rid
        self.currentUser = None
        self.monitorData = ResultMonitor(rid,'int')
        self.AllocateResource(3,10) #1 - count / 1 - Capacity | there are defaults set up

    #process generator for the internal entity

    @masterResource._process
    def setup(self,user):
        self.currentUser = user

    
    

#object initiation which will be exported to models
resourceList['hotelCashier'] = hotelCashier(1)
        





