#This module will be loaded on start thorugh engine
#----Monitoring Department-------

Monitorings = {'internal':[],'external':[]} #Object that holds all the monitored data acroding to schema
class ResultMonitor:
    def __init__(self,oid,entityType): #either resource or entity its oid [object id], and type -['ext','int']...]
        self.id = oid
        self._report = ""
        Monitorings[entityType].append(self)
    
    def submitReport (self,report): #you must pass the report object created acording to your defined schema
        self._report = report
#prepare monitoring set




#----- Sample Creator-----

def CreateSample(writable,agentClass,identity,size):
    for count in range(0,size):
        writable[identity][count] = agentClass(count)


#----- Workflow Creator-----
def WorkflowCreator(*args):
    workflow = [] #args will get arrays if interaction model objects 
    for arg in range(0,len(args)):
        workflow.append(arg)
    return workflow


#------ EVENT HANDLing Deaprtment -----------

class Event():
    def __init__(self,event_list = []):
        self.event_list = event_list
        self.event_handlerArray = {
            event_list[0]: lambda: self.handleExampleEvent(),
            event_list[1]: lambda: self.handleExampleEvent_2() #todo - parse to generator 
                
        }
    
    def Emit(self,event):
        self.event_handlerArray[event]()

    #Custom declaration of eventHandlers.... [by using dev]

    def handleExampleEvent_1(self):
        pass

    def handleExampleEvent_2(self):
        pass


#-------- Result Exporter --------