from dataclasses import dataclass
from simpy import Resource, Environment


res_data = []


@dataclass
class ResDetails:
    cap: int


class IRes:
    def __init__(self, env: Environment, res: Resource, func):
        self.env = env
        self.res = res
        self.func = func
        self.cap = res.capacity
        self.user_time = []
        self.queue_time = []
        self.leave_time = []

    def run(self):
        with self.res.request() as req:
            print(f"hello -. {self.res.users}")
            self.user_time.append([str(req.proc), self.env.now])
            self.queue_time.append([len(self.res.queue), self.env.now])
            yield req
            yield self.env.process(self.func())

    def add_details(self):
        pass

    def data(self) -> str:
        return f"user_time: {self.user_time}\n queue_time: {self.queue_time}"

    def gen_chart(self):
        pass
