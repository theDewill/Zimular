## ZDB.py Documentation

### DataManager Class

#### Description

This class manages the data and sends it to the database using the `zimdb` library, which is implemented in Rust using PyO3.

#### Attributes

- `dbname`: Name of the database.
- `setname`: Name of the set within the database.
- `table`: Name of the table within the set.
- `uri`: URI for connecting to the MongoDB database.
- `buffer_size`: Size of the buffer used for storing data before sending it to the database.
- `data`: Instance of `zimdb.ZimDB` for interacting with the database.

#### Methods

- `add_data(time, componet_cat, componet_name, action, entity, info, metadata)`: Adds data to the buffer.
- `add_workflow(workflow)`: Adds a workflow to the buffer.
- `add_com_to_workflow(workflow, com_cat, componet)`: Adds a component to a workflow.
- `send_db()`: Sends the data to the database.
- `send_table()`: Sends the table to the database.
- `uptable()`: Updates the table.
- `get_comp_data(component) -> ComponetInfo`: Retrieves data for a specific component.
- `save_entity(entity, count)`: Saves entity data to the database.
- `save_input_data(data)`: Placeholder method for saving input data.
- `testroute()`: Test method to retrieve data for a specific component.
- `test1()`: Test method to add random data to the buffer for testing purposes.

### QueryManger Class

#### Description

This class manages queries to the database.

#### Attributes

- `dbname`: Name of the database.
- `setname`: Name of the set within the database.
- `table`: Name of the table within the set.
- `uri`: URI for connecting to the MongoDB database.

### APIQueryManager Class

#### Description

This class provides API endpoints for querying the database.

#### Attributes

- `dbname`: Name of the database.
- `setname`: Name of the set within the database.
- `tablecoll`: Name of the table collection within the set.
- `uri`: URI for connecting to the MongoDB database.
- `data`: Instance of `zimdb.QueryDB` for querying the database.

#### Methods

- `overview_json(simulation_name) -> dict`: Generates a JSON overview of the simulation data.
- `resource_overview(resource_name) -> dict`: Provides an overview of resource usage.
- `container_overview(container_name) -> dict`: Provides an overview of container usage.
- `store_overview(store_name) -> dict`: Provides an overview of store usage.
- `get_all_component(sim_name) -> dict`: Retrieves data for all components in a simulation.
- `table_filter(simulation_name, component_name, action, entity, info) -> dict`: Filters data from the simulation table.

### ComponetInfo Class

#### Description

This class stores information about the data associated with a component.

#### Attributes

- `get_data`: List of data associated with "get" actions.
- `put_data`: List of data associated with "put" actions.
- `post_data`: List of data associated with "post" actions.

#### Methods

- `show_table()`: Prints the stored data for each action type.

