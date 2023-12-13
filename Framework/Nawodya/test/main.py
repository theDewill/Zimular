import simpy
import ZResource

env = simpy.Environment()
res = simpy.Resource(env, capacity=1)
res01 = simpy.Resource(env, capacity=1)


def rerr():
    print("sta")
    yield env.timeout(4)


resource01 = ZResource.IRes(env, res, rerr)


def gen():
    for i in range(10):
        pr = env.process(main(i))
        print(pr)
        yield env.timeout(2)


def main(cus):
    print(f" + {cus} arrive @ {env.now}")
    yield env.timeout(4)
    print(f" | {cus} a4 @ {env.now}")

    # yield env.process(rerr())

    yield env.process(resource01.run())

    print(f"{cus} res leave @ {env.now}")


"""
    with res01.request() as req:
        yield req
        print(f"{cus} res01 @ {env.now}")
        yield env.timeout(2)

    print(f"{cus} leave @ {env.now}")"""


env.process(gen())
env.run()

print(resource01.data())
