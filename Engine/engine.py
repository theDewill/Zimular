# This engine here imports all the entities,workflows and initate the simulation 
import simpy as sp

# Here is the initial configurations for file imports by adding them to sys path
import os,sys
utility_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utility'))
Services_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Services'))
sys.path.append(utility_path)
sys.path.append(Services_path)

#user defined file adding to system
workflow_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app','interactions'))
sys.path.append(workflow_path)
from models import WorkFlows #TODO: make it such exports Workflows

# Initializing the environment
env = sp.Environment()

#here we load user defined agents and resource instances 
entities = {}
class Engine ():
    def __init__(self,entity):
        
        self.entity = entity
        pass

    def _ignite (self):
        pass
   



engine = Engine(entities) 
env.process(engine._ignite())
env.run(until=100)