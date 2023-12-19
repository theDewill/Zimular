import simpy
from ZIM.ZResource import IRes


env = simpy.Environment()

Resource = {
    "counter": simpy.Resource(env=env, capacity=1),
    "machine_A": simpy.Resource(env=env, capacity=1),
    "machine_B": simpy.Resource(env=env, capacity=1),
}

Resource_obj = {}


def resource_maker():
    for res in Resource:
        Resource_obj[res] = IRes(env, Resource[res], res)

resource_maker()
print(Resource_obj)

Resource_obj["counter"].run(
    timeout=10,
    entity="customer"
)
