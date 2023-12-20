'''
import simpy
from ZIM import ZResource
from ZIM.ZGen import EntityGenerator
from ZIM.output_table import System_Output


class Simulator:
    def __init__(self, environment, entity):
        self.env = environment
        self.entity = entity

    def workflow(self):
        # 1 component
        yield self.env.timeout(5)

        # 2 component
        yield self.env.process(
            resource1.run(
                timeout=10,
                entity=self.entity
            )
        )

        # 3 component
        yield self.env.timeout(8)

        # 4 component
        yield self.env.process(
            resource2.run(
                timeout=2,
                entity=self.entity
            )
        )


if __name__ == "__main__":

    env = simpy.Environment()

    # 2 component
    res = simpy.Resource(env, capacity=2)
    resource1 = ZResource.IRes(env, res, "resource 1")

    # 4 component
    res1 = simpy.Resource(env, capacity=1)
    resource2 = ZResource.IRes(env, res1, "resource 2")

    generator = EntityGenerator(env, Simulator)

    def customer_generator():
        for _ in range(5):
            entity = [generator.generate_entity() for _ in range(1)]

            _process_entity = [env.process(ent.workflow()) for ent in entity]
            # env.process(entity.workflow())
            yield env.timeout(1)

    env.process(customer_generator())
    env.run()
    System_Output.show_table()
    print(resource1.data())

    # resource1.staits_plot()
    # resource2.staits_plot()
'''