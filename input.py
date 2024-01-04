'''import simpy
from random import randint

env = simpy.Environment()
resp = simpy.PreemptiveResource(env=env, capacity=1)
rre = simpy.Resource(env=env, capacity=1)

def gen():
    num = 0

    pro = [env.process(work(f'{num}.{i}', randint(-2, 0))) for i in range(5)]
    yield env.timeout(1)
    env.process(work(f'{num}.{5}', -1))
def work(name, pri):
    with resp.request(priority=pri) as req:
        print(f"Process {name} - {pri} requesting at {env.now}")
        yield req
        try:
            yield env.timeout(3)
        except simpy.Interrupt as interrupt:
            by = interrupt.cause.by
            usage = env.now - interrupt.cause.usage_since
            print(f'{name} got preempted by {by} at {env.now}'
                  f' after {usage}')

env.process(gen())
env.run()'''

'''import simpy

env = simpy.Environment()
res = simpy.Resource(env, capacity=1)
res2 = simpy.PriorityResource(env, capacity=1)

if isinstance(res2, simpy.Resource):
    print('res is Resource')

if isinstance(res2, simpy.PriorityResource):
    print('res is PriorityResource')

print(f'res: {res} res2: {res2}')'''

import simpy
def resource_user(name, env, resource, wait, prio):
    yield env.timeout(wait)
    with resource.request(priority=prio) as req:
        print(f'{name} requesting at {env.now} with priority={prio}')
        yield req
        print(f'{name} got resource at {env.now}')
        try:
            yield env.timeout(3)
        except simpy.Interrupt as interrupt:
            by = interrupt.cause.by
            usage = env.now - interrupt.cause.usage_since
            print(f'{name} got preempted by {by} at {env.now}'
                  f' after {usage}')

env = simpy.Environment()
res = simpy.PreemptiveResource(env, capacity=2)
p1 = env.process(resource_user(1, env, res, wait=0, prio=0))
p2 = env.process(resource_user(2, env, res, wait=1, prio=0))
p3 = env.process(resource_user(3, env, res, wait=2, prio=-1))
env.run()