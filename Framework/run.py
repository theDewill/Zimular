# main.py
from ZIM.ZComponets import ZStore
from componets import (
    Inspection_Machien,
    Modeling_Machien,
    Packing_Machien,
    Modeling_Store,
)
import simpy

# -------------template----------------
# class workflow:

#     def __init__(self) -> None:
#         pass

#     def work(self, entity):
#         pass


class Modeling_workspace:
    def __init__(self, env) -> None:
        self.env = env
        self.workflow = "Modeling_workspace"
        self.Modeling_Machien_Pool = [
            Modeling_Machien(env, f"Modeling_Machien_{i}", self.workflow)
            for i in range(5)
        ]
        self.Modeling_Store = Modeling_Store(env, self.workflow)
        self.Inception_Machien_Pool = [
            Inspection_Machien(env, f"Inspection_Machien_{i}", self.workflow)
            for i in range(5)
        ]
        self.Inception_Store = ZStore(
            env, simpy.Store(env, capacity=10), "Inception_Store", self.workflow
        )
        self.Packing_Machien_Pool = [
            Packing_Machien(env, f"Packing_Machien_{i}", self.workflow)
            for i in range(5)
        ]
        self.Packing_Store = ZStore(
            env, simpy.Store(env, capacity=10), "packing_store", self.workflow
        )

    def run(self, entity):
        machien = self.choose_machien(self.Modeling_Machien_Pool)
        yield from machien.run(entity=entity)
        yield self.Modeling_Store.put(entity)
        # yield self.env.timeout(2)

        if self.Modeling_Store.level() > 2:
            #print("Inception_Store is full")
            b = yield self.Modeling_Store.get()
            machien2 = self.choose_machien(self.Inception_Machien_Pool)
            yield from machien2.run(entity=b)
            yield self.Inception_Store.put(b)

            if self.Inception_Store.level() > 2:
                #print("Packing_Store is full")
                c = yield self.Inception_Store.get()
                machien3 = self.choose_machien(self.Packing_Machien_Pool)
                yield from machien3.run(entity=c)
                yield self.Packing_Store.put(c)

                print(f"Product {c} is done")

        # if self.Modeling_Store.level():
        #     b2 = yield self.Modeling_Store.get()
        #     machien21 = self.choose_machien(self.Inception_Machien_Pool)
        #     yield from machien21.run(entity=b2)
        #     yield self.Inception_Store.put(b2)

        # if self.Inception_Store.level():
        #     c2 = yield self.Inception_Store.get()
        #     machien31 = self.choose_machien(self.Packing_Machien_Pool)
        #     yield from machien31.run(entity=c2)
        #     yield self.env.timeout(2)
        #     yield self.Packing_Store.put(c2)
        #     print(f"Product {c2} is done")

    def choose_machien(self, machien_pool):
        queue_length = [len(machien.res.queue) for machien in machien_pool]
        # print(f'queue_length -> {queue_length}')
        return machien_pool[queue_length.index(min(queue_length))]
