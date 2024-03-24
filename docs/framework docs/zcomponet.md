## ZComponet.py Documentation

### Workflow

#### `Workflow` Class

- **Description**: Represents a simulation workflow, responsible for initializing components and orchestrating the simulation process.
- **Attributes**:
  - `name`: Name of the workflow.
  - `resource`: Dictionary of resources used in the workflow.
  - `priorityresource`: Dictionary of priority resources used in the workflow.
  - `container`: Dictionary of containers used in the workflow.
  - `store`: Dictionary of stores used in the workflow.
  - `filterstore`: Dictionary of filter stores used in the workflow.
  - `prioritystore`: Dictionary of priority stores used in the workflow.
  - `custom`: Dictionary of custom components used in the workflow.

#### `ComponetHandler` Class

- **Description**: Manages the addition of components to workflows and provides methods to access and manipulate workflows.
- **Methods**:
  - `add_workflow(workflow_name)`: Adds a new workflow with the given name.
  - `get_workflow(workflow_name)`: Retrieves the workflow object by name.
  - Methods for adding different types of components (`resource`, `priorityresource`, `container`, `store`, `filterstore`, `prioritystore`, `custom`) to workflows.
  - `show_data()`: Prints the current state of workflows.

### Resources

#### `IResource` Class

- **Description**: Abstract base class for interactive resources in the simulation environment.
- **Methods**:
  - `run_func(func)`: Decorator for resource interaction functions.
  - `update_user_time(category, entity, prio)`: Updates user time for the resource.
  - `enter_time(category, entity, prio)`: Updates enter time for the resource.
  - `update_leave_time(category, entity, prio)`: Updates leave time for the resource.

#### `IRes` Class

- **Description**: Represents an interactive resource in the simulation environment.
- **Attributes**:
  - `env`: SimPy Environment object.
  - `res`: SimPy Resource object.
  - `res_name`: Name of the resource.
- **Methods**:
  - `run_func(func)`: Decorator for resource interaction functions.

#### `IPiroRes` Class

- **Description**: Represents an interactive priority resource in the simulation environment.
- **Attributes**:
  - `env`: SimPy Environment object.
  - `res`: SimPy PriorityResource object.
  - `res_name`: Name of the priority resource.
- **Methods**:
  - `run_func(func)`: Decorator for resource interaction functions.

### Containers

#### `IContainer` Class

- **Description**: Represents a container in the simulation environment.
- **Attributes**:
  - `env`: SimPy Environment object.
  - `container`: SimPy container object.
  - `name`: Name of the container.
- **Methods**:
  - `put(amount, entity)`: Puts items into the container.
  - `get(amount, entity)`: Gets items from the container.
  - `level()`: Returns the current level of the container.

### Stores

#### `IStore` Class

- **Description**: Represents a store in the simulation environment.
- **Attributes**:
  - `env`: SimPy Environment object.
  - `store`: SimPy store object.
  - `name`: Name of the store.
- **Methods**:
  - `item_show()`: Shows items in the store.
  - `level()`: Returns the current level of the store.

#### `ZStore` Class

- **Description**: Represents a store in the simulation environment with additional functionalities.
- **Attributes**:
  - Inherits attributes from `IStore` class.
- **Methods**:
  - `put(item, entity)`: Puts an item into the store.
  - `get(entity)`: Gets an item from the store.

#### `ZFilterStore` Class

- **Description**: Represents a filter store in the simulation environment with additional functionalities.
- **Attributes**:
  - Inherits attributes from `IStore` class.
- **Methods**:
  - `put(item, entity)`: Puts an item into the filter store.
  - `get(func, entity)`: Gets an item from the filter store based on a filter function.

#### `ZPriorityStore` Class

- **Description**: Represents a priority store in the simulation environment with additional functionalities.
- **Attributes**:
  - Inherits attributes from `IStore` class.
- **Methods**:
  - `item_append(item, entity)`: Appends an item to the priority store.
  - `get(entity)`: Gets an item from the priority store.

### Utility Functions

- `ttes(item)`: Utility function to determine priority value.
- `entity_name(entity)`: Utility function to format entity names.
