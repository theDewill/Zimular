from ZIM.ZComponets import ZStore
from componets import (
    Inspection_Machien,
    Modeling_Machien,
    Packing_Machien,
    Modeling_Store,
    Inspection_Store,
    Packing_Store,
)
import simpy
from ZIM.config import CONFIG as Config

# -------------template----------------
# class workflow:

#     def __init__(self) -> None:
#         pass

#     def work(self, entity):
#         pass

class MainWorkflow:
    def __init__(self, env) -> None:
        self.env = env
        self.ms_thershold = Config.getinput("Core_Data", "modeling_store_threshold") #10
        self.is_thershold = Config.getinput("Core_Data", "inspection_store_threshold") #10
        self.modeling_workspace = Modeling_workspace(env)
        self.inspection_workspace = Inspection_workspace(env)
        self.packing_workspace = Packing_workspace(env)

    def run(self, entity):
        self.env.process(self.modeling_workspace.run(entity))
        self.env.process(self.run_inspection())
        self.env.process(self.run_packing())
        
    def run_inspection(self):
        while True:
            if self.modeling_workspace.modeling_store.level() > self.ms_thershold:
                
                for i in range(10):
                    item = yield self.modeling_workspace.modeling_store.get()
                    yield self.env.process(self.inspection_workspace.run(item))
            yield self.env.timeout(5)

    def run_packing(self):
        while True:
            if self.inspection_workspace.inspection_store.level() > self.is_thershold:
                for i in range(10):
                    item = yield self.inspection_workspace.inspection_store.get()
                    yield self.env.process(self.packing_workspace.run(item))
            yield self.env.timeout(4)

class Modeling_workspace:
    def __init__(self, env) -> None:
        self.env = env
        self.workflow = "Modeling_workspace"
        self.machiene_count = Config.getinput("Machine_count", "modeling_machine_count") #5
        self.modeling_machiens = [
            Modeling_Machien(env, f"Modeling_Machien_{i}", self.workflow)
            for i in range(self.machiene_count)
        ]
        self.modeling_store = Modeling_Store(env, self.workflow)

    def run(self, entity):
        machien = choose_machien(self.modeling_machiens)
        yield from machien.run(entity=entity)
        yield self.modeling_store.put(entity)

    def get_item_store(self, entity):
        return self.modeling_store.get(entity=entity)

class Inspection_workspace:
    def __init__(self, env) -> None:
        self.env = env
        self.workflow = "Inspection_workspace"
        self.machiene_count = Config.getinput("Machine_count", "inspection_machine_count") #5
        self.inspection_machiens = [
            Inspection_Machien(env, f"Inspection_Machien_{i}", self.workflow)
            for i in range(self.machiene_count)
        ]
        self.inspection_store = Inspection_Store(env, self.workflow)

    def run(self, entity):
        machien = choose_machien(self.inspection_machiens)
        yield from machien.run(entity=entity)
        yield self.inspection_store.put(entity)

    def get_item_store(self, entity):
        return self.inspection_store.get(entity=entity)

class Packing_workspace:
    def __init__(self, env) -> None:
        self.env = env
        self.workflow = "Packing_workspace"
        self.packing_count = Config.getinput("Machine_count", "packing_machine_count") #5
        self.packing_machiens = [
            Packing_Machien(env, f"Packing_Machien_{i}", self.workflow)
            for i in range(self.packing_count)
        ]
        self.packing_store = Packing_Store(env, self.workflow)

    def run(self, entity):
        machien = choose_machien(self.packing_machiens)
        yield from machien.run(entity=entity)
        yield self.packing_store.put(entity)

    def get_item_store(self, entity):
        return self.packing_store.get(entity=entity)
        

def choose_machien(machien_pool):
    queue_length = [len(machien.res.queue) for machien in machien_pool]
    return machien_pool[queue_length.index(min(queue_length))]
