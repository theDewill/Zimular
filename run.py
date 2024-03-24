# main.py
from ZIM.ZComponets import ZStore
from componets import (
    Inspection_Machien,
    Modeling_Machien,
    Packing_Machien,
    Modeling_Store,
    Inspection_Store,
)
import simpy
from ZIM.config import Config

# -------------template----------------
# class workflow:

#     def __init__(self) -> None:
#         pass

#     def work(self, entity):
#         pass

class MainWorkflow:
    def __init__(self, env) -> None:
        self.env = env
        self.modeling_workspace = Modeling_workspace(env)
        self.inspection_workspace = Inspection_workspace(env)
        self.packing_workspace = Packing_workspace(env)

    def run(self, entity):
        yield self.env.process(self.modeling_workspace.run(entity))
        yield self.env.process(self.inspection_workspace.run(entity))
        yield self.env.process(self.packing_workspace.run(entity))


class Modeling_workspace:
    def __init__(self, env) -> None:
        self.env = env
        self.workflow = "Modeling_workspace"
        self.machiene_count = 5#Config.getinput("modeling_machien_count")
        self.store_threshold = 2#Config.getinput("store_threshold")
        self.modeling_machiens = [
            Modeling_Machien(env, f"Modeling_Machien_{i}", self.workflow)
            for i in range(self.machiene_count)
        ]
        self.modeling_store = Modeling_Store(env, self.workflow)

    def run(self, entity):
        machien = choose_machien(self.modeling_machiens)
        yield from machien.run(entity=entity)
        yield self.modeling_store.put(entity)
        yield self.env.timeout(10)

class Inspection_workspace:
    def __init__(self, env) -> None:
        self.env = env
        self.workflow = "Inspection_workspace"
        self.machiene_count = 5#Config.getinput("inspection_machien_count")
        self.inspection_machiens = [
            Inspection_Machien(env, f"Inspection_Machien_{i}", self.workflow)
            for i in range(self.machiene_count)
        ]
        self.inspection_store = ZStore(env, simpy.Store(env, capacity=10), "Inspection_Store", self.workflow)

    def run(self, entity):
        machien = choose_machien(self.inspection_machiens)
        yield from machien.run(entity=entity)
        yield self.inspection_store.put(entity)
        yield self.env.timeout(10)

class Packing_workspace:
    def __init__(self, env) -> None:
        self.env = env
        self.workflow = "Packing_workspace"
        self.machiene_count = 5#Config.getinput("packing_machien_count")
        self.packing_machiens = [
            Packing_Machien(env, f"Packing_Machien_{i}", self.workflow)
            for i in range(self.machiene_count)
        ]
        self.packing_store = ZStore(env, simpy.Store(env, capacity=10), "Packing_Store", self.workflow)

    def run(self, entity):
        machien = choose_machien(self.packing_machiens)
        yield from machien.run(entity=entity)
        yield self.packing_store.put(entity)
        yield self.env.timeout(10)
        

def choose_machien(machien_pool):
    queue_length = [len(machien.res.queue) for machien in machien_pool]
    return machien_pool[queue_length.index(min(queue_length))]
