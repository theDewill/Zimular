# ZContainer.py
from simpy import Container
from .output_table import System_Output

ContainerPool = {}

class IContainer(Container):

    def __init__(self, env, name,  capacity = 0, init = 0):
        super().__init__(env=env, capacity=capacity, init=init)
        self.env = env
        self.name = name
        self.put_output = []    # [put_time, put_amount, level(after), entity]
        self.get_output = []    # [get_time, get_amount, level(after), entity]
        ContainerPool[name] = self

    def put(self, amount, entity="unknown"):
        '''
        put amount of items into container
        '''
        entity = entity_name(entity)

        #self.put(amount)
        super().put(amount)
        self.update_put_output(amount, entity)
        self.system_table_append( entity=entity, activity="put")

    def get(self, amount, entity="unknown"):
        '''
        get amount of items from container
        '''
        entity = entity_name(entity)

        #self.container.get(amount)
        super().get(amount)
        self.update_get_output(amount, entity)
        self.system_table_append( entity=entity, activity="get")

    def level(self):
        '''
        returns the current level of the container
        '''
        return super().level
    
    def update_put_output(self, amount, entity):
        if entity == "unknown":
            self.put_output.append(
                [self.env.now, amount, super().level]
            )
        else:
            self.put_output.append(
                [self.env.now, amount, super().level, entity]
            )

    def update_get_output(self, amount, entity):
        if entity == "unknown":
            self.get_output.append(
                [self.env.now, amount, super().level]
            )
        else:
            self.get_output.append(
                [self.env.now, amount, super().level, entity]
            )

    def system_table_append(self, entity, activity: str):
        """
        Appends the system output table.
        """
        System_Output.append([
            str(self.env.now),
            str(entity),
            str(self.name),
            activity,
            f'container_level={str(super().level)}'
        ])


def entity_name(entity) -> str:
    if entity == "unknown":
        return "unknown"
    else:
        return f'{entity["type"]}_{entity["id"]}'


# from simpy import Container
 
# ContainerPool = {}

# '''
# 1) can use ZContainerGenerator to create container pools and manage them 
# 2) use ZContainer to create a single container and manage it
# ''' 
# class ZContainerGenerator():
#     '''
#     giving procedure is optional and default is 1 and 2 can be given
#     '''
#     def __init__(self,env,procedure=1):
#         #self.CPool = {}
#         self.env = env
#         self.procedure = procedure
#     '''
#         thsi shows how the containers are selected for populating and consuming items
#         1 (default)- when populating the highest level is filled first then go for rest, consumed from lowest level container first
#         (always there will be a full container mosly )
#         2 - when populating the lowest level is filled first then go for rest, consumed from highest level container first
#     '''
        
#     '''
#     must pass an array including container configs for each container in count[[capacity,initialValue],etc..]
#     '''
#     def createContainers(self,containerSlot):
#         for key in containerSlot.keys():
#             print(f"error found = {containerSlot[key][0]}")
#             ContainerPool.setdefault(str(key))
#             #print(f"containerPool - {ContainerPool[key]}")


#             for number in range(int(containerSlot[key][0])):
#                 ContainerPool[key] = ZContainer(self.env,str(key),number,containerSlot[key][1])
#                 print(ContainerPool[key])
        
#         print("done execution")


#     def load(self,containerName,amount):
#         if self.procedure == 1:
#             print("procedure 1")
#             chosenContainer = None
#             highestContainerLevel = 0
#             for container in ContainerPool[containerName]:
#                 if container.container.level > highestContainerLevel:
#                     chosenContainer = container
#                     highestContainerLevel = container.container.level
#             chosenContainer.load(amount)
#         else:
#             chosenContainer = None
#             lowestContainerLevel = ContainerPool[containerName][0].container.level
#             for container in ContainerPool[containerName]:
#                 if container.container.level < lowestContainerLevel:
#                     chosenContainer = container
#                     lowestContainerLevel = container.container.level
#             chosenContainer.load(amount)
        
#     def consume(self,containerName,amount):
#         if self.procedure == 1:
#             chosenContainer = None
#             lowestContainerLevel = ContainerPool[containerName][0].container.level
#             for container in ContainerPool[containerName]:
#                 if container.container.level < lowestContainerLevel:
#                     chosenContainer = container
#                     lowestContainerLevel = container.container.level
#             chosenContainer.consume(amount)
#         else:
#             chosenContainer = None
#             highestContainerLevel = 0
#             for container in ContainerPool[containerName]:
#                 if container.container.level > highestContainerLevel:
#                     chosenContainer = container
#                     highestContainerLevel = container.container.level
#             chosenContainer.consume(amount)
        
    
            




        
    

# class ZContainer():
#     def __init__(self,env,name,number,Simpycontainer):
#         self.env = env
#         self.identity = {'name':str(name),'number':number}
#         self.container = Simpycontainer
#         self.monitor = {}
#         #Later tis can be poltted in a graph which is unique for container instance
#         #print(f"identity - {self.identity[name]}")
#         self.usageSheet = {'title':f'{self.identity["name"]}_{self.identity["number"]}','data':{'Time':[],'level':[]}}
#         #self.Trackusage = self.env.process(self.trackUsage())


#     def trackUsage(self):
#             self.usageSheet['Time']=[self.env.now] 
#             self.usageSheet['level']=[self.container.level]
#             #every 5 time units, this will record its level and timeStamp


#     def Full_fill(self):
#         self.container.put(self.container.capacity-self.container.level)

#     def Empty(self):
#         self.container.get(self.container.level)

#     def load(self,amount):
#         self.container.put(amount)
    
#     def consume(self,amount):
#         self.container.get(amount)
    

    

