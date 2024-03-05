import zimdb
from random import randint
import sys

test = zimdb.ZimDB("test", "test.zim")

for i in range(10):
    test.add_data(
        i,
        randint(0, 100),
        randint(0, 100),
        randint(0, 100),
        f"user{i}",
        {"test": "test", "test2": "test2"},
    )

test.printdb()
