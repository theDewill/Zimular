import zimdb
import json
from pprint import pprint
DBNAME = "SimulationDB"
SETNAME = "SimulationSet"
TABLENAME = "SimulationTable2"
MONGO_URI = "mongodb://localhost:27017"


test = zimdb.QueryDB(
    MONGO_URI,
    SETNAME,
    DBNAME,
    TABLENAME
)
# t3 = test.getcomp(
#     "Modeling_Machien_0",
#     "enter"
# )
# top = json.loads(t3)
# print(top)

# t01 = test.get_full_data(
#     None,
#     None,
#     "Modeling_Machien_3",
#     "enter",
#     None,
#     None,

# )   
# t011 = json.loads(t01)
# print(t011)
# teee = test.last_element_time()
# tot = test.avg_entity_time("SimulationTable2")
# tts = test.get_component_count("SimulationTable2")
# print(json.loads(tts))
# ttt = test.get_comp_name_cat_workflow("SimulationTable2")
# pprint(json.loads(ttt))

# too = test.get_resource_enter_count("Modeling_Machien_0")
# print("resource enter", too)
# too2 = test.get_resource_leave_count("Modeling_Machien_0")
# print("resource leave", too2)
# too3 = test.get_resource_queued_count("Modeling_Machien_0")
# print("resource queued", too3)
# too4 = test.get_container_put_count("Modeling_Machien_0")
# print("container put", too4)

tii = test.resource_queued_time_chart("Modeling_Machien_0")
print(tii)
# print(tot)
# print(teee)

# def overview(simulation_name):
#     total_time = test.last_element_time()
#     workflow_json = json.loads(test.get_workflow_details(simulation_name))
#     entity_json = json.loads(test.get_entity_info(simulation_name))
#     avg_entity_time = test.avg_entity_time(simulation_name)
#     chart1 = test.get_component_count(simulation_name)
#     overview_table = test.get_comp_name_cat_workflow(simulation_name)

#     final_json = {
#         "details": {
#             "simulation_name": simulation_name,
#             "total_time": total_time,
#             "avg_entity_time": avg_entity_time,
#         },
#         "workflow_table": workflow_json,
#         "entity_table": entity_json,
#         "chart_1": chart1,
#         "chart_2":"none",
#         "overview_table": overview_table
#     }

#     print(final_json)

# overview("SimulationTable2")
