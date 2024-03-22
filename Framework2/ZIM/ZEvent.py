from typing import Any, Optional
from simpy import Event
from .output_table import System_Output

class ZEvent(Event):
    def __init__(self, env, name=None):
        super().__init__(env)
        self.env = env
        self.name = name
        self.succeed_time = []

    def __str__(self):
        return f"ZEvent({self.name})"
    
    def  succeed(self, value: Any | None = None, entity="unknown", info: str=None) -> Event:
        entity = entity_name(entity)
        success = super().succeed(value)
        
        self.succeed_time.append(["succeed", self.env.now, entity])
        self.system_table_append(entity=entity, activity="succeed", info=info)
        return success

    def trigger(self, event: Event, entity="unknown", info: str=None) -> None:
        """Trigger *event*."""

        entity = entity_name(entity)
        super().trigger(event)
        self.succeed_time.append(["trigger", self.env.now, entity])
        self.system_table_append(entity=entity, activity="trigger", info=info)
        
    
    def fail(self, exception: BaseException, entity="unknown", info: str=None) -> Event:
        """Fail the event with *exception*."""
        
        entity = entity_name(entity)
        fail = super().fail(exception)
        self.succeed_time.append(["fail", self.env.now, entity])
        self.system_table_append(entity=entity, activity="fail", info=info)
        return fail
    
    
    def system_table_append(self, entity, activity: str, info: str=None):
        """
        Appends the system output table.
        """

        
        System_Output.append([
            str(self.env.now),
            str(entity),
            str(f'{self.name}<Event>'),
            activity,
            str(info)
        ])


def entity_name(entity) -> str:
    if entity == "unknown":
        return "unknown"
    else:
        return f'{entity["type"]}_{entity["id"]}'