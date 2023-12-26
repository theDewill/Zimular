from simpy import Container
 
ContainerPool = {}  

class ZContainer():
    def __init__(self,env,capacity,initValue=0):
        self.env = env
        self.container = Container(initValue,capacity)
        self.monitor = {}
        #Later tis can be poltted in a graph which is unique for container instance
        self.usageSheet = {'Time':[],'level':[]} 
        self.Trackusage = self.env.process(self.trackUsage())


    def trackUsage(self):
        while True:
            self.usageSheet['Time']=[self.env.now] 
            self.usageSheet['level']=[self.container.level]
            yield self.env.timeout(1)
    

    

