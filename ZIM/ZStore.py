#ZStore.py
from simpy import FilterStore, PriorityStore, Store
from  .output_table import System_Output
from typing import Callable, Any, Union
from ZIM.ZDB import ZIMDB

StorePool = {}

class IStore:
    def __init__(self, env, simpy_store: Union[Store, FilterStore, PriorityStore], name):
        self.env = env
        self.store = simpy_store
        self.name = name
        self.capacity = simpy_store.capacity
        
        self.put_output = []    # [put_time, put_amount, level(after), entity]
        self.get_output = []    # [get_time, get_amount, level(after), entity]
        StorePool[name] = self

    def item_show(self):
        '''
        show items in container
        '''
        return self.store.items

    def level(self):
        '''
        returns the current level of the container
        '''
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
            [["item", str(item)]]
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
            [["item", str(item)]]
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

        if not isinstance(simpy_store, Store):
            raise TypeError("simpy_store must be a Store")

        super().__init__(env, simpy_store, name)

    def put(self, item, entity="unknown"):
        entity = entity_name(entity)

        put_item = self.store.put(item)
        self.update_put_output("store" , item, entity)
        #self.system_table_append( entity=entity, activity="put")
        return put_item

    def get(self, entity="unknown"):
        entity = entity_name(entity)

        item = self.store.get()
        self.update_get_output("store", item, entity)
        #self.system_table_append( entity=entity, activity="get")
        return item

class ZFilterStore(IStore):
    def __init__(self, env, simpy_store, name):

        if not isinstance(simpy_store, FilterStore):
            raise TypeError("simpy_store must be a FilterStore")
        
        super().__init__(env, simpy_store, name)

    def get(self, func: Callable, entity="unknown"):
        entity = entity_name(entity)

        item = self.store.get(func)
        self.update_get_output("filterstore", item, entity)
        #self.system_table_append( entity=entity, activity="get<F>")
        
        return item
    
    def put(self, item, entity="unknown"):
        entity = entity_name(entity)

        put_item = self.store.put(item)
        self.update_put_output("filterstore", item, entity)
        #self.system_table_append( entity=entity, activity="put<F>")
        return put_item

class ZPriorityStore(IStore):
    def __init__(self, env, simpy_store, name):

        if not isinstance(simpy_store, PriorityStore):
            raise TypeError("simpy_store must be a PriorityStore")

        super().__init__(env, simpy_store, name)

    def item_append(self, item, entity="unknown"):
        '''
        append item to container 
        '''
        entity = entity_name(entity)
    
        self.store.items.append(item)

        self.update_put_output(item, entity)
        self.system_table_append( entity=entity, activity="put<item>")

    def get(self, entity="unknown"):
        entity = entity_name(entity)

        item = self.store.get()
        self.update_get_output("prioritystore", item, entity)
        #self.system_table_append( entity=entity, activity="get<P>")
        return item

    
        


def entity_name(entity) -> str:
    if entity == "unknown":
        return "unknown"
    elif isinstance(entity, str):
        return entity
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