# Config.py Documentation

## Config Class

### Description

The `Config` class is used to store the configuration parameters of the simulation. It provides methods to set and get configuration values such as database name, MongoDB URI, database set name, simulation table name, save folder, buffer size, and input structure.

### Attributes

- `db_name`: Name of the database.
- `mongo_uri`: MongoDB URI.
- `db_set_name`: Name of the database set.
- `sim_table_name`: Name of the simulation table.
- `save_folder`: Folder to save simulation data.
- `buffer_size`: Size of the buffer.
- `input_struct`: Structure of input data.
- `api_input`: API input data.

### Methods

- `__str__()`: Returns a string representation of the configuration.
- `set_config(db_name, mongo_uri, db_set_name, sim_table_name, save_folder, buffer_size, input_struct)`: Sets the configuration parameters.
- `set_sim_name(sim_name)`: Generates and sets the name of the simulation.
- `get_db_name() -> str`: Returns the name of the database.
- `get_mongo_uri() -> str`: Returns the MongoDB URI.
- `get_db_set_name() -> str`: Returns the name of the database set.
- `get_sim_table_name() -> str`: Returns the name of the simulation table.
- `get_buffer_size() -> int`: Returns the buffer size.
- `set_api_input(api_input: dict)`: Sets the API input data.
- `getinput(group: str, name: str)`: Gets the input value from the input structure.

## CONFIG Object

An instance of the `Config` class named `CONFIG` is created to be used throughout the simulation.

```python
CONFIG = Config()
