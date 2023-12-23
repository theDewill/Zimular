import simpy
from collections import namedtuple

class MachineShop:
    def __init__(self, capacity):
        self.env = simpy.Environment()
        self.machine_shop = simpy.FilterStore(self.env, capacity=capacity)
        self.machine_shop.items = []  # Start with an empty machine shop

    def add_machine(self, machine):
        #validations
        ...
        self.machine_shop.items.append(machine)
        #testing
        ...

    def run_simulation(self, users):
        user_processes = [self.env.process(self.user(i, size)) for i, size in enumerate(users)]
        self.env.run()

    def user(self, name, size):
        ...
        machine = yield self.machine_shop.get(lambda m: m.size == size)
        ...
       # print(name, 'got', machine, 'at', self.env.now)
        yield self.env.timeout(machine.duration)
        ...
        yield self.machine_shop.put(machine)
        ...
        print(name, 'released', machine, 'at', self.env.now)

def main():
    # Define machines
    #m1 = Machine(1, 2)  # Small and slow
    #m2 = Machine(2, 1)  # Big and fast
    ...

    for i in [...]:
    # Create machine shop
        machine_shop = MachineShop(capacity=2)
        machine_shop.add_machine(i)

    # Define users
    users =[...] #[2, 3, 4]  # User sizes (machine requirements)

    # Run simulation
    machine_shop.run_simulation(users)

class Machine(namedtuple('Machine', 'size, duration')):
    pass

if __name__ == "__main__":
    main()
