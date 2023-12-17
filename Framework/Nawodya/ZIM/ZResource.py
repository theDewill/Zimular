# ZResource.py
from simpy import Resource, Environment
from .output_table import System_Output
from .charts.charts import stairs_plot
import sys


class IRes:
    """
    Represents an interactive resource in a simulation environment.

    Args:
        env (Environment): The simulation environment.
        res (Resource): The resource object.
        res_name (str): The name of the resource.
        func (callable): The function to be executed by the resource.

    Attributes:
        env (Environment): The simulation environment.
        res (Resource): The resource object.
        res_name (str): The name of the resource.
        func (callable): The function to be executed by the resource.
        cap (int): The capacity of the resource.
        user_time (list): List to store user time data.
        queue_time (list): List to store queue time data.
        enter_time (list): List to store enter time data.
        leave_time (list): List to store leave time data.
    """

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

    def run(self, entity="s"):
        """
        Runs the resource with the specified entity.

        Args:
            entity (str, optional): The entity associated with the resource. Defaults to "s".

        Yields:
            simpy.events.Event: A request event for the resource.
        """
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
            yield self.env.process(self.func())

        System_Output.append([
            str(self.env.now),
            str(entity),
            str(self.res_name),
            "leave",
            str(self.env.active_process)
        ])

    def data(self) -> str:
        """
        Returns the collected data as a string.

        Returns:
            str: The collected data.
        """
        return f"user_time: {self.user_time}\nqueue_time: {self.queue_time}"

    def gen_chart(self):
        """
        Generates a chart based on the collected data.
        """
        # Implement chart generation based on collected data
        pass

    def data_size(self) -> str:
        """
        Returns the size of the data in kilobytes.

        Returns:
            str: The size of the data.
        """
        return f'user:{sys.getsizeof(self.user_time)/1024}kb \nqueue: {sys.getsizeof(self.queue_time)/1024}kb'

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