# ZResource.py
from simpy import Resource, Environment, PriorityResource
from .output_table import System_Output
from .charts.charts import stairs_plot
import sys
from .ZDB import ZIMDB
from typing import Union, Dict

ResourcePool = {}


class IResource:
    def __init__(self, env: Environment, res: Resource, res_name):
        ResourcePool[res_name] = self

        self.env = env
        self.res = res
        self.res_name = res_name
        self.cap = res.capacity

    def run_func(self):
        print("you maybe calling wrong run method")

    @staticmethod
    def run(func):
        def wrapper(self, *args, **kwargs):
            return self.run_func(func, *args, **kwargs)

        return wrapper

    def system_table_append(self, entity, activity: str, priority=0):
        """
        Appends the system output table.
        """
        System_Output.append(
            [
                str(self.env.now),
                str(entity),
                str(self.res_name),
                activity,
                f"priority={str(priority)}",
            ]
        )

    def update_user_time(self, category, entity, prio):
        """
        Updates the user time.
        """
        # self.user_time.append([entity, self.env.now])
        ZIMDB.add_data(
            self.env.now,
            category,
            self.res_name,
            "queued",
            entity,
            len(self.res.queue),
            ["priority", prio]
            # prio
        )

    def enter_time(self, category, entity, prio):
        """
        Updates the enter time.
        """
        ZIMDB.add_data(
            self.env.now,
            category,
            self.res_name,
            "enter",
            entity,
            len(self.res.queue),
            ["priority", prio]
            # prio
        )

    def update_leave_time(self, category, entity, prio):
        """
        Updates the leave time.
        """
        ZIMDB.add_data(
            self.env.now,
            category,
            self.res_name,
            "leave",
            entity,
            len(self.res.queue),
            ["priority", prio],
            # prio
        )

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

    def run_func(self, func=None, *args, entity: Union[str, Dict] = "entity", **kwargs):
        with self.res.request() as req:
            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "queued")
            # self.user_time.append([str(req.proc), self.env.now])
            self.update_user_time(
                category="resource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity["priority"])),
            )
            # self.queue_time.append([self.env.now, len(self.res.queue)])

            yield req
            # self.enter_time.append([f'{entity["type"]}_{entity["id"]}', self.env.now])
            self.enter_time(
                category="resource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity["priority"])),
            )
            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "enter")

            yield self.env.process(func(self, *args, entity=entity, **kwargs))

        self.update_leave_time(
            category="resource",
            entity=f'{entity["type"]}_{entity["id"]}',
            prio=str(ttes(entity["priority"])),
        )

        # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "leave")


class IPiroRes(IResource):
    """
    Represents an interactive p resource in a simulation environment.
    """

    def __init__(self, env: Environment, res: PriorityResource, res_name):
        super().__init__(env, res, res_name)
        self.priority = 0

    def run_func(self, func=None, *args, entity="entity", priority=0, **kwargs):
        with self.res.request(priority=priority) as req:
            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "queued", priority=ttes(entity["priority"]))
            # self.user_time.append([str(req.proc), self.env.now])
            self.update_user_time(
                category="piorityresource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity["priority"])),
            )
            # self.queue_time.append([self.env.now, len(self.res.queue)])

            yield req
            self.enter_time(
                category="piorityresource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity["priority"])),
            )

            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "enter", priority=ttes(entity["priority"]))

            yield self.env.process(func(self, *args, entity=entity, **kwargs))

        self.update_leave_time(
            category="piorityresource",
            entity=f'{entity["type"]}_{entity["id"]}',
            prio=str(ttes(entity["priority"])),
        )

        # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "leave", priority=ttes(entity["priority"]))


def ttes(item):
    if callable(item):
        return item()
    else:
        return item


def entity_name(entity) -> str:
    if entity == "unknown":
        return "unknown"
    elif isinstance(entity, str):
        return entity
    else:
        return f'{entity["type"]}_{entity["id"]}'
