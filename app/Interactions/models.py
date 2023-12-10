#----Here we define different interactions between n-parties (resources and agents)

#TODO: have to couple set of interactions to create a workflow, and create several of such workflows to 
#pass them to Workflows in Services
WorkFlows = []

#interaction 1 for workflow A
class CashierArrival():
    def __init__(self):
        self.workflow = ''
        self.order = ''
        self._party1  = ''
        self._party2 = ''

    def createWorkflow(self):
        WorkFlows[self.workflow][self.order-1] = self

    def _initate():
        pass

