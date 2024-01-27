from ZIM.ZGen import EntityGenerator
from run import Workflow1
from ZIM.output_table import System_Output
import simpy
from ZIM.ZResource import ResourcePool
from ZIM.ZContainer import ContainerPool

env = simpy.Environment()
workinit = Workflow1(env)

entity_format = {
    "type": "customer",
    "id": 0,
    "priority": lambda: executer(),
}

def executer():
    return -1

generator = EntityGenerator(env, workinit, entity_format, init_count=1)


def customer_generator():
    
    # for _ in range(5):
    #     env.process(generator.generate_entity())
    #     yield env.timeout(1)
    for _ in range(5):
        entity = generator.generate_entity()
        env.process(workinit.work(entity))
        yield env.timeout(1)

def customer_generator1():

    env.process(workinit.work(
        generator.enter_format(
            priority=0
        )
    ))
    yield env.timeout(1)

    env.process(workinit.work(
        generator.enter_format(
            priority=0
        )
    ))
    yield env.timeout(1)


    env.process(workinit.work(
        generator.enter_format(
            priority=-1
        )
    ))



def run_simulation():
    print("Running simulation...")
    print("creating resources...")
    print("creating entities...")
    env.process(customer_generator())
    env.run()
    print("Simulation done.")
    System_Output.show_table()

    print(ResourcePool["counter"].user_time)
    print(ResourcePool["counter"].leave_time)
    print("--------------------------------------------------------")
    # print(ResourcePool["counter1"].user_time)
    # print(ResourcePool["counter1"].leave_time)
    
    print(ContainerPool["item_container"].put_output)
    print(ContainerPool["item_container"].get_output)
if __name__ == "__main__":
    run_simulation()
