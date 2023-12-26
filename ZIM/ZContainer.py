from simpy import Container
 
class ContainerGenerator():
    def __init__(self,env,containers):
        self.CPool = {}
        self.env = env
        #thsi shows how the containers are selected for populating and consuming items
        self.procedure = 

    def createContainers(self,containerName,count):
        self.CPool.setdefault(containerName)
        for i in range(count):
            #supposing inital value is 0, if not ficking give it as a parameter
            self.CPool[containerName].append(ZContainer(self.env,100)) 
        
    def requestContainer(self,containerName):
        for container in self.CPool[containerName]:



        
    

class ZContainer():
    def __init__(self,env,name,number,capacity,initValue=0):
        self.env = env
        self.identity = {'name':name,'number':number}
        self.container = Container(initValue,capacity)
        self.monitor = {}
        #Later tis can be poltted in a graph which is unique for container instance
        self.usageSheet = {'title':f'{self.identity[name]}_{self.identity[number]}','data':{'Time':[],'level':[]}} 
        self.Trackusage = self.env.process(self.trackUsage())


    def trackUsage(self):
        while True:
            self.usageSheet['Time']=[self.env.now] 
            self.usageSheet['level']=[self.container.level]
            yield self.env.timeout(5) #every 5 time units, this will record its level and timeStamp

    def Full_fill(self):
        self.container.put(self.container.capacity-self.container.level)

    def Empty(self):
        self.container.get(self.container.level)

    def populate(self,amount):
        self.container.put(amount)
    
    def consume(self,amount):
        self.container.get(amount)
    

    

