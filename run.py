# main.py
from componets import Counter, Counter1


class Workflow1:
    def __init__(self, env):
        self.env = env
        self.counter = Counter(self.env)
        # self.counter1 = Counter1(self.env)

    def work(self, entity):
        yield self.env.timeout(2)

        yield self.env.process(self.counter.run_counter(t1=3, entity=entity))

        yield self.env.timeout(1)

        # yield self.env.process(
        #     self.counter1.run_counter(
        #         t1=10,
        #         entity=entity,
        #         priority=entity["priority"]
        #     )
        # )
