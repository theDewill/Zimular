# ZResource.py Documentation

## EntityGenerator Class

### Description

The `EntityGenerator` class is responsible for generating entities for the simulation. It interacts with the workflow and manages entity creation and saving to the database.

### Attributes

- `env`: The simulation environment.
- `workflow`: The workflow instance to interact with.
- `entity_format`: The format/template for the entities to be generated.
- `entity_count`: The count of generated entities.

### Methods

- `generate_entity()`: Generates a new entity based on the specified format.
- `entity_list_check(entity_list)`: Checks if any value in the entity format is callable and replaces it with its returned value.
- `save_entity()`: Saves the generated entity to the database.
- `enter_format(priority)`: Modifies the entity format to include a priority value and returns it.

## entity_scrape Function

### Description

Placeholder function for scraping entities.
