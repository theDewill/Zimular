import os,sys
from services import WorkflowCreator

from agents import agentList
from resources import resourceList
from containers import containerList
from stores import storeList
from engine import env

#----Here we define different interactions between n-parties (resources and agents)

#TODO: have to couple set of interactions to create a workflow, and create several of such workflows to 

#interaction 1 for workflow A
class CashierArrival():
    def __init__(self):
        self.workflow = ''
        self.order = ''
        self._party1  = agentList
        self._party2 = resourceList['hotelCashier']


    def createWorkflow(self):
        WorkFlows[self.workflow][self.order-1] = self

    def _initate():
        pass
        
    
WorkFlows = WorkflowCreator() #pass array of interaction object arrays to here
