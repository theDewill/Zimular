
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