# ZResource.py
from simpy import Resource, Environment, PriorityResource
from .output_table import System_Output
from .charts.charts import stairs_plot
import sys


ResourcePool= {}


def resource_maker(env, Res):

    for res in Res:
        print(Res[res])
        if isinstance(Res[res], PriorityResource):
            ResourcePool[res] = IPiroRes(env, Res[res], res)
        elif isinstance(Res[res], Resource):
            ResourcePool[res] = IRes(env, Res[res], res)

    print(ResourcePool)


class IResource:
    def __init__(self, env: Environment, res: Resource, res_name):
        self.env = env
        self.res = res
        self.res_name = res_name
        self.cap = res.capacity
        self.user_time = []
        self.queue_time = []
        self.enter_time = []
        self.leave_time = []

    def system_table_append(self, entity,activity: str, priority: int = 0):
        """
        Appends the system output table.
        """
        System_Output.append([
            str(self.env.now),
            str(entity),
            str(self.res_name),
            activity,
            str(priority)
        ])

    def staits_plot(self):
        """
        Generates a stairs plot based on the queue time data.
        """
        stairs_plot(self.queue_time, f'{self.res_name} queue time')

    def event_check(self):
        """
        Performs event checking.
        """
        pass


class IRes(IResource):
    """
    Represents an interactive resource in a simulation environment.

    """

    def __init__(self, env: Environment, res: Resource, res_name):
        super().__init__(env, res, res_name)

    def run(self, timeout: int = None, func=None, arg=[], entity="entity"):

        with self.res.request() as req:
            self.system_table_append(entity, "queued")
            self.user_time.append([str(req.proc), self.env.now])
            self.queue_time.append([self.env.now, len(self.res.queue)])

            yield req

            self.system_table_append(entity, "enter")

            if timeout is not None:
                yield self.env.timeout(timeout)
            elif func is not None:
                yield self.env.process(func(*arg))
            else:
                raise Exception("No function or timeout provided")

        self.system_table_append(entity, "leave")


class IPiroRes(IResource):
    def __init__(self, env: Environment, res: PriorityResource, res_name):
        super().__init__(env, res, res_name)
        self.priority = 0

    def run(self, prio, timeout: int = None, func=None, arg=[], entity="entity"):
        self.priority = prio
        with self.res.request(priority=prio) as req:

            self.system_table_append(entity, "queued", priority=self.priority)

            self.user_time.append([str(req.proc), self.env.now])
            self.queue_time.append([self.env.now, len(self.res.queue)])

            yield req

            self.system_table_append(entity, "enter", priority=self.priority)

            if timeout is not None:
                yield self.env.timeout(timeout)
            elif func is not None:
                yield self.env.process(func(*arg))
            else:
                raise Exception("No function or timeout provided")

        self.system_table_append(entity, "leave", priority=self.priority)

