from dataclasses import dataclass, field
from typing import Dict, Union, Callable
from ZIM.ZDB import ZIMDB
from simpy import (
    Environment,
    Resource,
    PriorityResource,
    FilterStore,
    PriorityStore,
    Store,
)
from pprint import pprint


@dataclass
class Workflow:
    name: str = ""
    resource: Dict[str, object] = field(default_factory=dict)
    priotityresouce: Dict[str, object] = field(default_factory=dict)
    container: Dict[str, object] = field(default_factory=dict)
    store: Dict[str, object] = field(default_factory=dict)
    filterstore: Dict[str, object] = field(default_factory=dict)
    priotitystore: Dict[str, object] = field(default_factory=dict)
    custom: Dict[str, object] = field(default_factory=dict)


class ComponetHandler:
    def __init__(self) -> None:
        self.workflows = {}

    def add_workflow(self, workflow_name):
        obj = Workflow()
        obj.name = workflow_name
        self.workflows[workflow_name] = obj
        ZIMDB.add_workflow(workflow_name)

    def get_workflow(self, workflow_name):
        return self.workflows[workflow_name]

    def add_resource(self, workflow_name, resource_obj, resource_name):
        if workflow_name not in self.workflows:
            self.add_workflow(workflow_name)

        self.workflows[workflow_name].resource[resource_name] = resource_obj
        ZIMDB.add_com_to_workflow(workflow_name, "resource", resource_name)

    def add_priotityresouce(self, workflow_name: str, resource_obj, resource_name: str):
        if workflow_name not in self.workflows:
            self.add_workflow(workflow_name)

        self.workflows[workflow_name].priotityresouce[resource_name] = resource_obj
        ZIMDB.add_com_to_workflow(workflow_name, "piorityresource", resource_name)

    def add_container(self, workflow_name: str, container_obj, container_name: str):
        if workflow_name not in self.workflows:
            self.add_workflow(workflow_name)

        self.workflows[workflow_name].container[container_name] = container_obj
        ZIMDB.add_com_to_workflow(workflow_name, "container", container_name)

    def add_store(self, workflow_name: str, store_obj, store_name: str):
        if workflow_name not in self.workflows:
            self.add_workflow(workflow_name)

        self.workflows[workflow_name].store[store_name] = store_obj
        ZIMDB.add_com_to_workflow(workflow_name, "store", store_name)

    def add_filterstore(self, workflow_name: str, filterstore_obj, filterstore_name: str):
        if workflow_name not in self.workflows:
            self.add_workflow(workflow_name)

        self.workflows[workflow_name].filterstore[filterstore_name] = filterstore_obj
        ZIMDB.add_com_to_workflow(workflow_name, "filterstore", filterstore_name)

    def add_priotitystore(self, workflow_name: str, priotitystore_obj, priotitystore_name: str):
        if workflow_name not in self.workflows:
            self.add_workflow(workflow_name)

        self.workflows[workflow_name].priotitystore[
            priotitystore_name
        ] = priotitystore_obj
        ZIMDB.add_com_to_workflow(workflow_name, "prioritystore", priotitystore_name)

    def add_custom(self, workflow_name: str, custom_obj, custom_name: str):
        if workflow_name not in self.workflows:
            self.add_workflow(workflow_name)

        self.workflows[workflow_name].custom[custom_name] = custom_obj
        ZIMDB.add_com_to_workflow(workflow_name, "custom", custom_name) 

    def show_data(self):
        pprint(self.workflows)


componet_handler = ComponetHandler()


# ---------------------------------------------------IResource---------------------------------------------------#


class IResource:
    def __init__(self, env: Environment, res: Resource, res_name: str):
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
            [["priority", prio]],
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
            [["priority", prio]],
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
            [["priority", prio]],
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

    def __init__(self, env: Environment, res: Resource, res_name, workflow_name):
        super().__init__(env, res, res_name)
        componet_handler.add_resource(workflow_name, self, res_name)

    def run_func(self, func=None, *args, entity: Union[str, Dict] = "entity", **kwargs):
        with self.res.request() as req:
            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "queued")
            # self.user_time.append([str(req.proc), self.env.now])
            self.update_user_time(
                category="resource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity)),
            )
            # self.queue_time.append([self.env.now, len(self.res.queue)])

            yield req
            # self.enter_time.append([f'{entity["type"]}_{entity["id"]}', self.env.now])
            self.enter_time(
                category="resource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity)),
            )
            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "enter")

            yield self.env.process(func(self, *args, entity=entity, **kwargs))

        self.update_leave_time(
            category="resource",
            entity=f'{entity["type"]}_{entity["id"]}',
            prio=str(ttes(entity)),
        )

        # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "leave")


class IPiroRes(IResource):
    """
    Represents an interactive p resource in a simulation environment.
    """

    def __init__(
        self, env: Environment, res: PriorityResource, res_name, workflow_name="unknown"
    ):
        super().__init__(env, res, res_name)
        self.priority = 0
        componet_handler.add_priotityresouce(workflow_name, self, res_name)

    def run_func(self, func=None, *args, entity="entity", priority=0, **kwargs):
        with self.res.request(priority=priority) as req:
            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "queued", priority=ttes(entity["priority"]))
            # self.user_time.append([str(req.proc), self.env.now])
            self.update_user_time(
                category="piorityresource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity)),
            )
            # self.queue_time.append([self.env.now, len(self.res.queue)])

            yield req
            self.enter_time(
                category="piorityresource",
                entity=f'{entity["type"]}_{entity["id"]}',
                prio=str(ttes(entity)),
            )

            # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "enter", priority=ttes(entity["priority"]))

            yield self.env.process(func(self, *args, entity=entity, **kwargs))

        self.update_leave_time(
            category="piorityresource",
            entity=f'{entity["type"]}_{entity["id"]}',
            prio=str(ttes(entity)),
        )

        # self.system_table_append(f'{entity["type"]}_{entity["id"]}', "leave", priority=ttes(entity["priority"]))


# ---------------------------------------------------IContainer---------------------------------------------------#


class IContainer:
    def __init__(
        self,
        env,
        simpy_container,
        name,
    ):
        self.env = env
        self.container = simpy_container
        self.name = name
        self.capacity = simpy_container.capacity
        componet_handler.add_container(self.name, self, self.name)

    def put(self, amount, entity="unknown"):
        """
        put amount of items into container
        """
        entity = entity_name(entity)

        self.container.put(amount)
        self.update_put_output(amount, entity)
        # self.system_table_append( entity=entity, activity="put")

    def get(self, amount, entity="unknown"):
        """
        get amount of items from container
        """
        entity = entity_name(entity)

        self.container.get(amount)
        self.update_get_output(amount, entity)
        # self.system_table_append( entity=entity, activity="get")

    def level(self):
        """
        returns the current level of the container
        """
        return self.container.level

    def update_put_output(self, amount, entity):
        if entity == "unknown":
            entity = None

        ZIMDB.add_data(
            self.env.now,
            "container",
            self.name,
            "put",
            entity,
            amount,
            [["level", self.container.level]],
        )

    def update_get_output(self, amount, entity):
        if entity == "unknown":
            entity = None

        ZIMDB.add_data(
            self.env.now,
            "container",
            self.name,
            "get",
            entity,
            amount,
            [["level", self.container.level]],
        )


# ----------------------------------------------------Zstore----------------------------------------------------#


class IStore:
    def __init__(
        self, env, simpy_store: Union[Store, FilterStore, PriorityStore], name
    ):
        self.env = env
        self.store: Union[Store, FilterStore, PriorityStore] = simpy_store
        self.name = name
        self.capacity = simpy_store.capacity

    def item_show(self):
        """
        show items in container
        """
        return self.store.items

    def level(self):
        """
        returns the current level of the container
        """
        return len(self.store.items)

    def update_get_output(self, category, item, entity):
        if entity == "unknown":
            entity = None

        ZIMDB.add_data(
            self.env.now,
            category,
            self.name,
            "get",
            entity,
            len(self.store.items),
            [["item", str(item)]],
        )

    def update_put_output(self, category, item, entity):
        if entity == "unknown":
            entity = None

        ZIMDB.add_data(
            self.env.now,
            category,
            self.name,
            "put",
            entity,
            len(self.store.items),
            [["item", str(item)]],
        )


class ZStore(IStore):
    def __init__(self, env, simpy_store, name, workflow_name="unknown"):
        if not isinstance(simpy_store, Store):
            raise TypeError("simpy_store must be a Store")

        super().__init__(env, simpy_store, name)
        componet_handler.add_store(workflow_name, self, name)

    def put(self, item, entity="unknown"):
        entity = entity_name(entity)

        put_item = self.store.put(item)
        self.update_put_output("store", item, entity)
        # self.system_table_append( entity=entity, activity="put")
        return put_item

    def get(self, entity="unknown"):
        entity = entity_name(entity)

        item = self.store.get()
        self.update_get_output("store", item, entity)
        # self.system_table_append( entity=entity, activity="get")
        return item


class ZFilterStore(IStore):
    def __init__(self, env, simpy_store, name, workflow_name="unknown"):
        if not isinstance(simpy_store, FilterStore):
            raise TypeError("simpy_store must be a FilterStore")

        super().__init__(env, simpy_store, name)
        componet_handler.add_filterstore(workflow_name, self, name)

    def get(self, func: Callable, entity="unknown"):
        entity = entity_name(entity)

        item = self.store.get(func)
        self.update_get_output("filterstore", item, entity)
        # self.system_table_append( entity=entity, activity="get<F>")

        return item

    def put(self, item, entity="unknown"):
        entity = entity_name(entity)

        put_item = self.store.put(item)
        self.update_put_output("filterstore", item, entity)
        # self.system_table_append( entity=entity, activity="put<F>")
        return put_item


class ZPriorityStore(IStore):
    def __init__(self, env, simpy_store, name, workflow_name="unknown"):
        if not isinstance(simpy_store, PriorityStore):
            raise TypeError("simpy_store must be a PriorityStore")

        super().__init__(env, simpy_store, name)
        componet_handler.add_priotitystore(workflow_name, self, name)

    def item_append(self, item, entity="unknown"):
        """
        append item to container
        """
        entity = entity_name(entity)

        self.store.items.append(item)

        self.update_put_output("prioritystore", item, entity)
        # self.system_table_append( entity=entity, activity="put<item>")

    def get(self, entity="unknown"):
        entity = entity_name(entity)

        item = self.store.get()
        self.update_get_output("prioritystore", item, entity)
        # self.system_table_append( entity=entity, activity="get<P>")
        return item


def ttes(item):

    priority_value = item.get("priority")

    if priority_value == None:
        return 0

    if callable(priority_value):
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
