import simpy


class Compoent:
    def __init__(self, priority, description):
        self.priority = priority
        self.description = description


# component objects

class priorityComponents:
    def __init__(self):
        self.env = simpy.Environment()
        self.Components = simpy.PriorityStore(self.env)

    def priorityorder(self):
        # componentobjects
        for component in [...]:
            yield self.env.timeout(1)
            # print(self.env.now, 'log', component.description)
            yield self.Components.put(simpy.PriorityItem(component.priority, component))

    def Element(self):
        while True:
            # yield self.env.timeout(3)
            # behaviour of the element
            ...
            issue = yield self.Components.get()
            # print(self.env.now, 'repair', issue.item.description)

    def run_simulation(self):
        _ = self.env.process(self.priorityorder())
        _ = self.env.process(self.Element())
        self.env.run()


def main():
    maintenance_system = priorityComponents()
    maintenance_system.run_simulation()


if __name__ == "__main__":
    main()
