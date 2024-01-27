import simpy
from ZIM.ZResource import IRes, IPiroRes


class Counter(IRes):
    def __init__(self, env):
        super().__init__(
            env,
            simpy.Resource(env=env, capacity=1),
            "counter"
        )

    @IRes.run
    def run_counter(self, t1):
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
        

