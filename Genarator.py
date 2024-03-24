from run import MainWorkflow
from ZIM.ZGen import EntityGenerator


def executer():
    return -1


def customer_generator(env):
    workinit = MainWorkflow(env)

    entity_format = {
        "type": "customer",
        "id": 0,
        #"priority": lambda: executer(),
    }

    generator = EntityGenerator(env, workinit, entity_format, init_count=0)

    while True:
        for _ in range(1):
            entity = generator.generate_entity()
            workinit.run(entity)

        yield env.timeout(1)