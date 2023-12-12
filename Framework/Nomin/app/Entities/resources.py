import sys,os
import simpy as sp
from defaults import masterResource
from services import ResultMonitor
from engine import env

resourceList = {} #this will hold all resource instances

class hotelCashier(masterResource):

    def __init__(self, rid,env, count ):
        self.id = rid
        self.user = None
        self.env = env
        self.count = count
        self.monitorData = ResultMonitor(rid,'int')
        self.instances = sp.Resource(self.env,self.count, capacity=1)

    #process generator for the internal entity

    @masterResource._process
    def setup(self,user):
        self.user = user

    
    

#object initiation which will be exported to models
resourceList['hotelCashier'] = hotelCashier(1,env,3)
        





