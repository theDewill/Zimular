import sys,os
import simpy as sp

#file importer 
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..','utility')))
from entityImporter import ImportFiles

masterResource = ImportFiles('../../Services')
print(masterResource)

class hotelCashier(masterResource):
    def __init__(self, env, count):
        self.user = None
        self.env = env
        self.count = count
        self.instances = sp.Resource(self.env,self.count, capacity=1)

    #process generator for the internal entity

    #@masterResource.process
    def setup(self,user):
        self.user = user
        #jsadhfjsdhfjh
        




