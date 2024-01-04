# main.py
from ZIM.ZResource import ResourcePool
import random


class Workflow:
    def __init__(self, env, entity):
        self.env = env
        self.entity = entity

    def work(self):
        yield self.env.timeout(5)
        yield self.env.process(
            ResourcePool["machine_A"].run(
                timeout=10,
                entity=self.entity
            )
        )

        yield self.env.timeout(8)
        yield self.env.process(
            ResourcePool["machine_B"].run(
                timeout=2,
                entity=self.entity
            )
        )

    def work1(self):
        yield self.env.timeout(5)
        yield self.env.process(
            ResourcePool["test_q"].run(
                random.randint(-2, 0),
                timeout=10,
                entity=self.entity
            )
        )