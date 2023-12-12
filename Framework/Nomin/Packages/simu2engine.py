import simpy as sp
import random as rnd
from termcolor import colored as clr


env = sp.Environment()

#----------utility-----------
def entityDetector(txt):
    if "_" not in txt:
        return None
    startPlace = txt.find("_")+1
    endPlace = txt.find("_",int(startPlace))
    return txt[startPlace:endPlace]

def time_splitter(time):
    time = str(time)
    return f"{time[0:2]}.{time[2:4] or '0'}0"

def stringFormatter(txt):
    startPlace = txt.find("_")+1
    endPlace = txt.find("_",int(startPlace))
    restStr1 = txt[:startPlace-1]
    restStr2 = txt[endPlace+1:]
    word = entityDetector(txt)
    return restStr1+word+restStr2



def resourceDataCollector():
    #[{id:"withdrawCounter",count:4,eff:5,objects:{--sp.resources--}},{id:"depositCounter",count:3}]

    size = int(input("how many resources will be needed? "))
    resources = []
    for x in range(size):
        entry = {}
        entry["id"] = input(f"Enter a name for the {x+1} - resource person (Remember this): ")
        entry["functions"] = []
        entry["eff"] = {}
        functionCount = int(input(f"How many different functions will the {entry['id']} do: "))
        for func in range(functionCount):
            entry["functions"].append(input(f"describe the function {func+1}: "))
        for funcName in entry["functions"]:
            entry["eff"][funcName] = int(input(f"Efficiency Score of the resource for the function {funcName}: "))

        entry["count"] = int(input(f"How many of that Resources to be allocated: "))
        #entry["eff"] = int(input(f"Efficiency Score for the the above resource: "))
        
        entry["objects"] = None

        resources.append(entry)
    return resources

def stepsCollector():
    #multidimensional array
    steps = []
    count = int(input("How many different workflows will the partisipants get: "))
    print("[ type q to finish a workflow ]\n[ type exact resource's funation name in each step in between 2 underscores eg:- _entity_ OR if no entity just type the time taken for the process inside 2 _  ]")
    for cnt in range(count):
        print(f"\n---- workflow variant - {cnt+1} ----")
        counter = 1
        stepin = [] 
        #temp take count of steps
        #cnt = int(input("How many steps will there be"))
        while(True):
            step = input(f"enter step {counter}: ")
            if step == 'q':
                break
            stepin.append(step)
            counter+=1
        steps.append(stepin)
    return steps




class person(object):
    def __init__(self,wflow,num,identity):
        self.identity = identity
        self.number = num
        self.routine = wflow
        self.delay = None
    
    #general process cutomized based on user inputs 
    def process (self,resources,env):
        for work in self.routine:
            agent = None
            for resource in resources:
                #if resource["id"] == entityDetector(work):
                if entityDetector(work) in resource["functions"]:
                    agent = resource

            if agent == None:
                
                if entityDetector(work) == None:
                    print(f"{time_splitter(env.now)} : {self.identity}[{self.number}] - {stringFormatter(work)}")
                else:
                    
                    time = int(entityDetector(work))
                    print(f"{time_splitter(env.now)} : {self.identity}[{self.number}] - {stringFormatter(work)}")
                    env.timeout(time)
            else:
                with agent["objects"].request() as object:
                    yield object
                    print(f"{time_splitter(env.now)} : {self.identity}[{self.number}] - {stringFormatter(work)}")
                    env.timeout(int(agent["eff"][entityDetector(work)]))



class context(object):
    def __init__(self,env,samplesize,partisipant,context,resDetails):
        self.env = env
        self.sample = []
        self.sampleSize  = samplesize
        self.context = context
        self.resources = resDetails #array of dict
        self.partisipants = partisipant
        #[{id:"withdrawCounter",functions:["function1","function2"],count:4,eff:{"function1":3,"function2":4},objects:{--sp.resources--}},{id:"depositCounter",count:3}]
        
    
    def initateResources(self):
        for resource in self.resources:
            resource["objects"] = sp.Resource (self.env , resource["count"])
            

    def createSample (self,steps):
        for count in range(self.sampleSize):
            self.sample.append(person(steps[rnd.randint(0,len(steps)-1)],count,self.partisipants))


    def Simulate(self): 
        #multiD str array wtih steps of a agent for each resource with exact name given
        #and all possible flows in each dimesion
        
        print(f"Simulating a {self.context}")
        for person in self.sample:
            
            self.env.process(person.process(self.resources,self.env))
            yield env.timeout(rnd.randint(0,5))


#--initiate---
topic = input("what environment do you wish to simulate: ")
partisipants = input("who are going to be the partisipant model: ")
smSize = int(input("how much crowd do you wish to simulate: "))
contextEnv = context(env,smSize,partisipants,topic,resourceDataCollector())
contextEnv.initateResources()
contextEnv.createSample(stepsCollector())
env.process(contextEnv.Simulate())
env.run()

