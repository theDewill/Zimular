### Getting Started

#### Installation

To get started with the Zimular framework, follow these installation instructions:

1. Clone the Zimular repository from GitHub:
   ```
   git clone https://github.com/antiloger/Zimular-alpha.git
   ```
or

    ```
    pip install zimular-alpha
    ```


2. Navigate to the cloned directory:
   ```
   cd Zimular
   ```

3. Install the required dependencies using pip:
   ```
   pip install -r requirements.txt
   ```

#### Dependencies

Zimular has the following dependencies:

- Python 3.x
- SimPy
- Rich
- httpx
- websockets

Ensure that you have Python installed on your system and install the required packages using pip.

#### Quickstart Guide

To quickly run a simple simulation using Zimular, follow these steps:

1. Define your simulation components and workflows using Python classes. Place these classes in the appropriate files within the Zimular project structure.

2. Configure your simulation settings, such as database connections, input data, and output folder locations, in the `settings.py` file.

3. Create a generator function to generate entities for the simulation. This function should yield entities to be processed by the simulation components.

4. In your main script (e.g., `main.py`), initialize the simulation environment, configure the settings, and start the simulation process.

5. Run the simulation script using Python:
   ```
   python main.py
   ```

6. Monitor the simulation progress and analyze the results using the output generated by the framework.

With these steps, you can quickly set up and run a basic simulation using the Zimular framework. Explore the documentation for more detailed instructions and advanced features.

### How to run the simulation

1. run

    if you want run locally without UI, run this command in project directory
    ```
        python main.py runlocal
    ```
    run sever to use the UI,
    ```
        python main.py runserver <userID>
    ```
            UserID - your account ID

2. run test

    if you want run locally without UI, run this command in project directory
    ```
        python mainTest.py runlocal
    ```
    run sever to use the UI,
    ```
        python mainTest.py runserver <userID>
    ```
            UserID - your account ID
