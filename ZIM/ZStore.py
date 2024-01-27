from typing import List

StorePool = {}


class ZStore:
    def __init__(self, env, name, store_obj):
        self.env = env
        self.name = name
        self.store_obj = store_obj
        self.capacity = store_obj.capacity
        self.data = []

    def item_init(self, item: [List]):
        if item > self.capacity:
            raise ValueError("Item cannot be larger than the store capacity.")
        self.store_obj.items = item

    def get(self, item, entity="unknown"):
        store_item = self.store_obj.get(item)
        self.monitor(item, entity)
        return store_item

    def put(self, item, entity="unknown"):
        store_item = self.store_obj.put(item)
        self.monitor(item, entity)
        return store_item

    def monitor(self, value, entity):
        self.data.append([self.env.now, len(self.store_obj.items), value, entity])