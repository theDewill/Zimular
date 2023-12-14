from simpy import Resource, Environment
from .output_table import System_Output
from .charts.charts import stairs_plot
import sys

'''
    This module provides a ZResource class that can be used to represent a IRes object.    
'''


class IRes:
    def __init__(self, env: Environment, res: Resource, res_name, func):
        self.env = env
        self.res = res
        self.res_name = res_name
        self.func = func
        self.cap = res.capacity
        self.user_time = []
        self.queue_time = []
        self.enter_time = []
        self.leave_time = []

    def run(self, entity):
        with self.res.request() as req:
            System_Output.append([
                str(self.env.now),
                str(entity),
                str(self.res_name),
                "entry",
                str(self.env.active_process)
            ])
            self.user_time.append([str(req.proc), self.env.now])
            self.queue_time.append([self.env.now, len(self.res.queue)])

            yield req
            yield self.env.process(self.func)
            System_Output.append([
                str(self.env.now),
                str(entity),
                str(self.res_name),
                "leave",
                str(self.env.active_process)
            ])

    def data(self) -> str:
        return f"user_time: {self.user_time}\nqueue_time: {self.queue_time}"

    def gen_chart(self):
        # Implement chart generation based on collected data
        pass

    def data_size(self) -> str:
        return f'user:{sys.getsizeof(self.user_time)/1024}kb \nqueue: {sys.getsizeof(self.queue_time)/1024}kb'

    def staits_plot(self):
        stairs_plot(self.queue_time, f'{self.res_name} queue time')