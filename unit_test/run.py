import simpy

env = simpy.Environment()
event = env.event()
print(event)