from typing import Any
import simpy as sp
import sys
import os

#setup entity import
grandparent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
print(grandparent_path)
sys.path.append(grandparent_path)
from entityImporter import ImportEntities

#load entities
entities = ImportEntities('../app/Entity')

env = sp.Environment()


#DONE
class MonitorData:
    def __init__(self,rid):
        self.id = rid
        self.report = {}

Monitoring = {'internal':{MonitorData(1),MonitorData(2)}
              ,
              'external':[MonitorData(1),MonitorData(2),MonitorData(3),MonitorData(4),MonitorData(5)]} #so on upto sample

#resources internal and external
class resource:

    def __init__(self,env,rid):
        self.id = rid
        self.monitorData = Monitoring['internal'][rid]
        self.purpose = ''
        self.root = sp.Resource(env, capacity=1)

class customer:
    def __init__(self,cid):
        self.id = cid
        self.monitorData = Monitoring['external'][cid]

        
hotelCashier = resource(env, capacity=1) # resource 1
hotelAttendant = resource(env, capacity=1) # resource 2

customer_workflow = [hotelCashier,hotelAttendant] #sample array 

def gen_process():
    pass



env.process(gen_process())
env.run(until=100)











def customer_gen():


def gen_1 ():
    






