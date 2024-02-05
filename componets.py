import simpy
from ZIM.ZResource import IRes, IPiroRes
from ZIM.ZContainer import IContainer
from ZIM.ZStore import ZStore, ZFilterStore


class Counter(IRes):
    def __init__(self, env):
        super().__init__(
            env,
            simpy.Resource(env=env, capacity=1),
            "counter"
        )
        
        

    @IRes.run
    def run_counter(self, t1, entity):
        print(t1)
        yield self.env.timeout(t1)
        


    def output_customer_otime(self):
        arr = []
        for i in range(len(self.user_time)):
            time = self.leave_time[i][1] - self.user_time[i][1]
            arr.append([self.user_time[i][0], time])

        return arr


class Counter1(IPiroRes):
    def __init__(self, env):
        super().__init__(
            env,
            simpy.PriorityResource(env=env, capacity=1),
            "counter1"
        )

    @IRes.run
    def run_counter(self, t1):
        print(t1)
        yield self.env.timeout(t1)

    def output_customer_otime(self):
        arr = []
        for i in range(len(self.user_time)):
            time = self.user_time[i][1] - self.leave_time[i][1]
            arr.append([self.user_time[i][0], time])

        return arr
        

class Item_container(IContainer):
    def __init__(self, env):
        super().__init__(
            env=env,
            capacity=5,
            init=0,
            name="item_container"
        )

    def output_data(self):
        return self.put_output, self.get_output
    

class Item_store(ZFilterStore):
    def __init__(self, env):
        super().__init__(
            env,
            simpy.FilterStore(env=env, capacity=5),
            "item_store"
        )

    def output_data(self):
        return self.put_output, self.get_output