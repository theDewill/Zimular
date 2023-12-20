from ZIM.ZGen import EntityGenerator
from run import Workflow
from componets import env, ResourceSlot
from ZIM.ZResource import resource_maker
from ZIM.output_table import System_Output


generator = EntityGenerator(env, Workflow)


def customer_generator():
    for _ in range(5):
        entity = [generator.generate_entity() for _ in range(1)]

        _process_entity = [env.process(ent.work()) for ent in entity]
        # env.process(entity.workflow())
        yield env.timeout(1)


def run_simulation():
    print("Running simulation...")
    print("creating resources...")
    resource_maker(env, ResourceSlot)
    print("creating entities...")
    env.process(customer_generator())
    env.run()
    print("Simulation done.")
    System_Output.show_table()


run_simulation()
