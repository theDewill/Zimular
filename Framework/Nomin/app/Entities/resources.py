import sys,os
import simpy as sp
from defaults import masterResource
from services import ResultMonitor
from engine import table,env


resourceList = {} #this will hold all resource instances

# {'Time':[],'Customer':[],'Activity':[],'Resource':[],'Things':[]} = table architecture TEMP
class hotelCashier(masterResource):

    def __init__(self, rid , env):
        self.id = rid
        self.env = env
        self.currentUser = None
        self.monitorData = ResultMonitor(rid,'int')
        self.AllocateResource(3,10) #1 - count / 1 - Capacity | there are defaults set up

    #Following are different actions done by the resource which are to be used in interaction object

    @masterResource._process
    def registerCustomer(self,user,process,Thing = None):
        self.currentUser = user
        table['Time'].append(self.env.now())
        table['Customer'].append( self.currentUser)
        table['Activity'].append("Registering the Cutomer Arrival in Log")
        table['Resource'].append(self)
        table['Things'].append(Thing)

    
    

#object initiation which will be exported to models
resourceList['hotelCashier'] = hotelCashier(1,env)
        





