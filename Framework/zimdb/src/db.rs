use serde::{Deserialize, Serialize};
use std::collections::HashMap;

type DBResult<T> = std::result::Result<T, DBERRO>;

#[derive(Debug)]
pub enum DBERRO {
    NotFound,
}

//#[derive(Debug, Serialize, Deserialize)]
//pub enum Bignum {
//    Int(i64),
//    Float(f64),
//}

#[derive(Debug, Serialize, Deserialize)]
pub enum CatComp {
    Resource,
    PriorityResource,
    PreemptiveResource,
    Store,
    FilterStore,
    PriorityStore,
    Container,
    Custom,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DB {
    db_name: String,
    name: String,
    conn: String,
    modifid: bool,
    save_time: u64,
    database: String,
    dblen: usize,
    inputtable: Vec<InputDataGroup>,
    component_info: ComponentInfo,
    entity: HashMap<String, f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InputDataGroup {
    name: String,
    data: HashMap<String, String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SimuTable {
    name: String,
    pub table: Box<Vec<SimOutData>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ComponentInfo {
    workflow: HashMap<String, Comp>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Comp {
    resources: Vec<String>,
    piority_resources: Vec<String>,
    preemptive_resources: Vec<String>,
    containers: Vec<String>,
    store: Vec<String>,
    filter_store: Vec<String>,
    priority_store: Vec<String>,
    custom: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SimOutData {
    pub time: f64,
    pub component_category: CatComp,
    pub component_name: String,
    pub action: String,
    pub entity: Option<String>,
    pub info: Option<f64>,
    pub metadata: Option<Vec<(String, String)>>,
}

impl DB {
    pub fn new(dbname: &str, name: &str, conn: &str, tablename: &str, len: usize) -> DBResult<DB> {
        Ok(DB {
            db_name: dbname.to_string(),
            name: name.to_string(),
            conn: conn.to_string(),
            modifid: false,
            save_time: 0,
            database: tablename.to_string(),
            dblen: len,
            inputtable: Vec::new(),
            component_info: ComponentInfo {
                workflow: HashMap::new(),
            },
            entity: HashMap::new(),
        })
    }

    pub fn add_workflow(&mut self, name: &str) -> DBResult<()> {
        self.component_info.workflow.insert(
            name.to_string(),
            Comp {
                resources: Vec::new(),
                piority_resources: Vec::new(),
                preemptive_resources: Vec::new(),
                containers: Vec::new(),
                store: Vec::new(),
                filter_store: Vec::new(),
                priority_store: Vec::new(),
                custom: Vec::new(),
            },
        );

        Ok(())
    }

    pub fn add_inputdata(&mut self, groupname: &str, key: &str, value: &str) -> DBResult<()> {
        if let Some(group) = self.inputtable.iter_mut().find(|x| x.name == groupname) {
            group.data.insert(key.to_string(), value.to_string());
        } else {
            let mut gp = InputDataGroup::new(groupname);
            gp.data.insert(key.to_string(), value.to_string());
            self.inputtable.push(gp);
        }

        Ok(())
    }

    pub fn add_com_to_workflow(
        &mut self,
        work_name: &str,
        component_category: CatComp,
        name: &str,
    ) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(work_name)
            .ok_or(DBERRO::NotFound)?;
        match component_category {
            CatComp::Resource => comp.resources.push(name.to_string()),
            CatComp::PriorityResource => comp.piority_resources.push(name.to_string()),
            CatComp::PreemptiveResource => comp.preemptive_resources.push(name.to_string()),
            CatComp::Store => comp.store.push(name.to_string()),
            CatComp::FilterStore => comp.filter_store.push(name.to_string()),
            CatComp::PriorityStore => comp.priority_store.push(name.to_string()),
            CatComp::Container => comp.containers.push(name.to_string()),
            CatComp::Custom => comp.custom.push(name.to_string()),
        }
        Ok(())
    }

    pub fn add_entity(&mut self, name: &str, value: f64) -> DBResult<()> {
        self.entity.insert(name.to_string(), value);
        Ok(())
    }

    pub fn change_modifid(&mut self, modifid: bool) {
        self.modifid = modifid;
    }

    pub fn change_savetime(&mut self) {
        self.save_time += 1;
    }

    pub fn get_conn(&self) -> &str {
        &self.conn
    }

    pub fn get_dbname(&self) -> &str {
        &self.db_name
    }

    pub fn get_name(&self) -> &str {
        &self.name
    }

    pub fn get_table(&self) -> &str {
        &self.database
    }

    pub fn get_dblen(&self) -> usize {
        self.dblen
    }
}

impl SimuTable {
    pub fn new(name: &str) -> SimuTable {
        SimuTable {
            name: name.to_string(),
            table: Box::new(Vec::new()),
        }
    }

    pub fn add_data(
        &mut self,
        time: f64,
        component_category: CatComp,
        component_name: &str,
        action: &str,
        entity: Option<String>,
        info: Option<f64>,
        metadata: Option<Vec<(String, String)>>,
    ) {
        self.table.push(SimOutData {
            time,
            component_category,
            component_name: component_name.to_string(),
            action: action.to_string(),
            entity,
            info,
            metadata,
        });
    }

    pub fn tablelen(&self) -> usize {
        self.table.len()
    }

    pub fn clear_table(&mut self) {
        self.table.clear();
    }
}

impl InputDataGroup {
    pub fn new(name: &str) -> InputDataGroup {
        InputDataGroup {
            name: name.to_string(),
            data: HashMap::new(),
        }
    }
}
