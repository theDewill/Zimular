import sys,os
import simpy as sp

import pandas as pd
from prettytable import PrettyTable

# Existing DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['New York', 'San Francisco', 'Los Angeles']
}

df = pd.DataFrame(data)

# Initialize PrettyTable with column names
table = PrettyTable(df.columns)

# # Add rows to PrettyTable
# for row in df.itertuples(index=False):
#     table.add_row(row)

# Display the table
print(table)
