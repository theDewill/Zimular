from abc import ABC, abstractmethod

class PoolManager(ABC):
    ResourcePool = {}
    ContainerPool = {}
    StorePool = {}
    ComponentPool = {}
    
    @staticmethod
    def add_pool(catagory: str, name:str, obj):
        if catagory == "resource":
            PoolManager.ResourcePool[name] = obj
        elif catagory == "container":
            PoolManager.ContainerPool[name] = obj
        elif catagory == "store":
            PoolManager.StorePool[name] = obj
        else:
            PoolManager.ComponentPool[name] = obj

    def getResourcePool(name: str):
        return PoolManager.ResourcePool[name]

    def getContainerPool(name: str):
        return PoolManager.ContainerPool[name]
    
    def getStorePool(name: str):
        return PoolManager.StorePool[name]
    
    def getComponentPool(name: str):
        return PoolManager.ComponentPool[name]
    
