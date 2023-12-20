# main.py
from ZIM.ZResource import ResourcePool


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
