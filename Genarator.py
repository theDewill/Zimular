from run import Modeling_workspace
from ZIM.ZGen import EntityGenerator


def executer():
    return -1


def customer_generator(env):
    workinit = Modeling_workspace(env)

    entity_format = {
        "type": "customer",
        "id": 0,
        #"priority": lambda: executer(),
    }

    generator = EntityGenerator(env, workinit, entity_format, init_count=1)

    for _ in range(5):
        entity = generator.generate_entity()
        env.process(workinit.run(entity))
        yield env.timeout(1)

    generator.save_entity()