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
