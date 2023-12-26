from simpy import Container
 
'''
1) can use ZContainerGenerator to create container pools and manage them 
2) use ZContainer to create a single container and manage it
''' 
class ZContainerGenerator():
    def __init__(self,env,containers):
        self.CPool = {}
        self.env = env
        self.procedure = 1 
    '''
        thsi shows how the containers are selected for populating and consuming items
        1 (default)- when populating the highest level is filled first then go for rest, consumed from lowest level container first
        (always there will be a full container mosly )
        2 - when populating the lowest level is filled first then go for rest, consumed from highest level container first
    '''
        
    '''
    must pass an array including container configs for each container in count[[capacity,initialValue],etc..]
    '''
    def createContainers(self,containerName,count,configs):
        self.CPool.setdefault(containerName)
        for c in range(count):
            #supposing inital value is 0, if not  give it as a parameter
            self.CPool[containerName].append(ZContainer(self.env,containerName,c,configs[c][0],configs[c][1])) 

    def load(self,containerName,amount):
        if self.procedure == 1:
            chosenContainer = None
            highestContainerLevel = 0
            for container in self.CPool[containerName]:
                if container.container.level > highestContainerLevel:
                    chosenContainer = container
                    highestContainerLevel = container.container.level
            chosenContainer.load(amount)
        else:
            chosenContainer = None
            lowestContainerLevel = self.CPool[containerName][0].container.level
            for container in self.CPool[containerName]:
                if container.container.level < lowestContainerLevel:
                    chosenContainer = container
                    lowestContainerLevel = container.container.level
            chosenContainer.load(amount)
        
    def consume(self,containerName,amount):
        if self.procedure == 1:
            chosenContainer = None
            lowestContainerLevel = self.CPool[containerName][0].container.level
            for container in self.CPool[containerName]:
                if container.container.level < lowestContainerLevel:
                    chosenContainer = container
                    lowestContainerLevel = container.container.level
            chosenContainer.consume(amount)
        else:
            chosenContainer = None
            highestContainerLevel = 0
            for container in self.CPool[containerName]:
                if container.container.level > highestContainerLevel:
                    chosenContainer = container
                    highestContainerLevel = container.container.level
            chosenContainer.consume(amount)
        
    
            




        
    

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

    def load(self,amount):
        self.container.put(amount)
    
    def consume(self,amount):
        self.container.get(amount)
    

    

