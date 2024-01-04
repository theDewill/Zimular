import simpy


env = simpy.Environment()

ResourceSlot = {
    "counter": simpy.Resource(env=env, capacity=1),
    "machine_A": simpy.Resource(env=env, capacity=1),
    "machine_B": simpy.Resource(env=env, capacity=1),
    "test_q": simpy.PriorityResource(env=env, capacity=1),
}
