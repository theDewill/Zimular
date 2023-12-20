# This engine here imports all the entities,workflows and initate the simulation 
import simpy as sp
import pandas as pd
# Initializing the environment
env = sp.Environment()
table = {'Time':[],'Customer':[],'Activity':[],'Resource':[],'Things':[]}


# Here is the initial configurations for file imports by adding them to sys path
import os,sys
utility_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
sys.path.append(utility_path)
import loadConfigs #this will load all the paths to system path

from models import WorkFlows #TODO: make it such exports Workflows



#here we load user defined agents and resource instances 
entities = {}
class Engine ():
    def __init__(self,entity):
        
        
        pass

    def _ignite (self):
        pass
   



engine = Engine(entities) 
env.process(engine._ignite())
env.run(until=100)
SimulationSheet = pd.DataFrame(table)
print(SimulationSheet)