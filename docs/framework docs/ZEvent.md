# ZEvent.py Documentation

## ZEvent Class

### Description

The `ZEvent` class extends the SimPy Event class to provide additional functionality for managing simulation events. It includes methods for success, failure, and triggering events, along with logging functionality.

### Attributes

- `env`: The simulation environment.
- `name`: Optional name for the event.
- `succeed_time`: A list to store the times when the event succeeds.

### Methods

- `__str__()`: Returns a string representation of the event.
- `succeed(value: Any | None = None, entity="unknown", info: str=None) -> Event`: Marks the event as successful, with an optional value. Logs the success event and appends it to the system output table.
- `trigger(event: Event, entity="unknown", info: str=None) -> None`: Triggers another event. Logs the trigger event and appends it to the system output table.
- `fail(exception: BaseException, entity="unknown", info: str=None) -> Event`:
