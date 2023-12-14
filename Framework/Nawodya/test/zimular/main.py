import simpy
from ZIM import ZResource
from ZIM.ZGen import EntityGenerator
from ZIM.output_table import System_Output


def resources_1(e):
    yield e.timeout(3)


def resources_2(e):
    yield e.timeout(2)


class Simulator:
    def __init__(self, environment, entity):
        self.env = environment
        self.entity = entity

    def workflow(self):
        print(f"enter {self.entity}     @{self.env.now}")
        yield self.env.timeout(3)

        yield self.env.process(resource1.run(self.entity))
        yield self.env.process(resource2.run(self.entity))

        print(f"leave {self.entity}     @{self.env.now}")


if __name__ == '__main__':

    env = simpy.Environment()

    res = simpy.Resource(env, capacity=1)
    resource1 = ZResource.IRes(env, res, "resource 1", resources_1(env))

    res1 = simpy.Resource(env, capacity=2)
    resource2 = ZResource.IRes(env, res, "resource 2", resources_2(env))

    generator = EntityGenerator(env, Simulator)

    def customer_generator():
        for _ in range(20):
            entity = generator.generate_entity()
            env.process(entity.workflow())
            yield env.timeout(1)


    env.process(customer_generator())
    env.run()
    # System_Output.show_table()
    print(resource1.data())
    resource1.staits_plot()
    resource2.staits_plot()

