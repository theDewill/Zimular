#ZStore.py
import simpy
from  .output_table import System_Output

StorePool = {}

class IStore:
    def __init__(self, env, simpy_store, name):
        self.env = env
        self.store = simpy_store
        self.name = name
        self.capacity = simpy_store.capacity
        self.items = []
        self.put_output = []    # [put_time, put_amount, level(after), entity]
        self.get_output = []    # [get_time, get_amount, level(after), entity]

    def put(self, item, entity="unknown"):
        '''
        put amount of items into container
        '''
        entity = entity_name(entity)

        self.store.put(item)
        self.update_put_output(item, entity)
        self.system_table_append( entity=entity, activity="put")

    def get(self, item, entity="unknown"):
        '''
        get amount of items from container
        '''
        entity = entity_name(entity)

        self.store.get(item)
        self.update_get_output(item, entity)
        self.system_table_append( entity=entity, activity="get")

    def level(self):
        '''
        returns the current level of the container
        '''
        return len(self.store.items)

    def update_get_output(self, item, entity):
        if entity == "unknown":
            self.get_output.append(
                [self.env.now, item, len(self.store.items)]
            )
        else:
            self.get_output.append(
                [self.env.now, item, len(self.store.items), entity]
            )

    def update_put_output(self, item, entity):
        if entity == "unknown":
            self.put_output.append(
                [self.env.now, item, len(self.store.items)]
            )
        else:
            self.put_output.append(
                [self.env.now, item, len(self.store.items), entity]
            )

    def system_table_append(self, entity, activity: str):

        """
        Appends the system output table.
        """
        System_Output.append([
            str(self.env.now),
            str(entity),
            str(self.name),
            activity,
            f'Store_Items={str(len(self.store.items))}'
        ])

class ZStore(IStore):
    def __init__(self, env, simpy_store, name):
        super().__init__(env, simpy_store, name)

class ZFilterStore(IStore):
    def __init__(self, env, simpy_store, name):
        super().__init__(env, simpy_store, name)
        self.filter = simpy_store.filter

class ZPriorityStore(IStore):
    def __init__(self, env, simpy_store, name):
        super().__init__(env, simpy_store, name)

    


def entity_name(entity) -> str:
    if entity == "unknown":
        return "unknown"
    else:
        return f'{entity["type"]}_{entity["id"]}'

# class ZStore:
#     def __init__(self, env, name, store_obj):
#         self.env = env
#         self.name = name
#         self.store_obj = store_obj
#         self.capacity = store_obj.capacity
#         self.data = []

#     def item_init(self, item: [List]):
#         if item > self.capacity:
#             raise ValueError("Item cannot be larger than the store capacity.")
#         self.store_obj.items = item

#     def get(self, item, entity="unknown"):
#         store_item = self.store_obj.get(item)
#         self.monitor(item, entity)
#         return store_item

#     def put(self, item, entity="unknown"):
#         store_item = self.store_obj.put(item)
#         self.monitor(item, entity)
#         return store_item

#     def monitor(self, value, entity):
#         self.data.append([self.env.now, len(self.store_obj.items), value, entity])