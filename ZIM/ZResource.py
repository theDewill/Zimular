# ZResource.py
from simpy import Resource, Environment, PriorityResource
from .output_table import System_Output
from .charts.charts import stairs_plot
import sys


ResourcePool= {}


class IResource:
    def __init__(self, env: Environment, res: Resource, res_name):
        ResourcePool[res_name] = self

        self.env = env
        self.res = res
        self.res_name = res_name
        print(self)
        self.cap = res.capacity
        self.user_time = []
        self.queue_time = []
        self.enter_time = []
        self.leave_time = []

    def run_func(self):
        print("you maybe calling wrong run method")

    @staticmethod
    def run(func):
        def wrapper(self, *args, **kwargs):
            return self.run_func(func, *args, **kwargs)
        return wrapper

    def system_table_append(self, entity, activity: str, priority= 0):
        """
        Appends the system output table.
        """
        System_Output.append([
            str(self.env.now),
            str(entity),
            str(self.res_name),
            activity,
            f'priority={str(priority)}'
        ])

    def update_user_time(self, entity):
        """
        Updates the user time.
        """
        self.user_time.append([entity, self.env.now])

    def update_queue_time(self):
        """
        Updates the queue time.
        """
        self.queue_time.append([self.env.now, len(self.res.queue)])

    def update_leave_time(self, entity):
        """
        Updates the leave time.
        """
        self.leave_time.append([entity, self.env.now])

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

    def run_func(self, func=None, *args, entity="entity", **kwargs):

        with self.res.request() as req:
            self.system_table_append(f'{entity["type"]}_{entity["id"]}', "queued")
            #self.user_time.append([str(req.proc), self.env.now])
            self.update_user_time(entity=f'{entity["type"]}_{entity["id"]}')
            #self.queue_time.append([self.env.now, len(self.res.queue)])
            self.update_queue_time()

            yield req
            self.enter_time.append([f'{entity["type"]}_{entity["id"]}', self.env.now])
            self.system_table_append(f'{entity["type"]}_{entity["id"]}', "enter")

            yield self.env.process(func(self, *args, entity=entity, **kwargs))
            
        self.update_leave_time(entity=f'{entity["type"]}_{entity["id"]}')    

        self.system_table_append(f'{entity["type"]}_{entity["id"]}', "leave")

        


class IPiroRes(IResource):
    """
    Represents an interactive p resource in a simulation environment.
    """

    def __init__(self, env: Environment, res: PriorityResource, res_name):
        super().__init__(env, res, res_name)
        self.priority = 0

    def run_func(self, func=None, *args, entity="entity", priority=0,**kwargs):

        with self.res.request(priority=priority) as req:

            self.system_table_append(f'{entity["type"]}_{entity["id"]}', "queued", priority=ttes(entity["priority"]))

            #self.user_time.append([str(req.proc), self.env.now])
            self.update_user_time(entity=f'{entity["type"]}_{entity["id"]}')
            #self.queue_time.append([self.env.now, len(self.res.queue)])
            self.update_queue_time()

            yield req

            self.system_table_append(f'{entity["type"]}_{entity["id"]}', "enter", priority=ttes(entity["priority"]))

            yield self.env.process(func(self, *args, **kwargs))

        self.update_leave_time(entity=f'{entity["type"]}_{entity["id"]}')

        self.system_table_append(f'{entity["type"]}_{entity["id"]}', "leave", priority=ttes(entity["priority"]))



def ttes(item):
    if callable(item):
        return item()
    else:
        return item