# output_table.py
from rich.console import Console
from rich.table import Table

'''
    This module provides a class that represents a table of data.
    System_Output is responsible for displaying system monitoring information.
'''


class OutputTable:
    def __init__(self, table_name: str, table_columns: list):
        self.table = []
        self.table_name = table_name
        self.table_columns = table_columns

    def append(self, olist: list):
        self.table.append(olist)

    def show_table(self):
        table = Table(title=self.table_name)
        rows = self.table

        columns = self.table_columns

        for column in columns:
            table.add_column(column)

        for row in rows:
            table.add_row(*map(str, row), style='bright_green')

        console = Console()
        console.print(table)
        #print("table printed")

def print_table(titel, header, data):
    table = Table(title=titel)
    for col in header:
        table.add_column(col)

    for row in data:
        table.add_row(*map(str, row))

    console = Console()
    console.print(table)

def print_row_table(titel, data):
    table = Table(title=titel)
    for row in data:
        table.add_row(*map(str, row))

    console = Console()
    console.print(table)


System_table_col = ["Time", "Entity", "Component", "Action", "Additional Info"]


System_Output = OutputTable("System Output", System_table_col)
