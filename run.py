# main.py
from componets import *


# -------------template----------------
# class workflow:

#     def __init__(self) -> None:
#         pass

#     def work(self, entity):
#         pass
        

class Workflow1:
    def __init__(self, env):
        self.env = env
        self.counter = Counter(self.env)
        self.store = Item_store(self.env)
        self.env.process(self.store_start())
        # self.store.items = [1,2,3,4]
        # self.counter1 = Counter1(self.env)
        
    def work(self, entity):

        yield self.env.timeout(2)

        yield self.env.process(self.counter.run_counter(entity=entity))

        item = yield self.store.get(lambda item: item in ['item - 1','item - 2'], entity=entity)

        #print(item)
        yield self.env.timeout(1)

        # yield self.env.process(
        #     self.counter1.run_counter(
        #         t1=10,
        #         entity=entity,
        #         priority=entity["priority"]
        #     )
        # )

    def store_start(self):
        for i in range(4):
            yield self.env.timeout(1)
            self.store.put(f'item - {i}')


    def outstore(self, entity):
        if entity["id"] in [1,2]:
            return True


    
        

