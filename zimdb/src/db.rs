use serde::{Deserialize, Serialize};
use std::collections::HashMap;

type DBResult<T> = std::result::Result<T, DBERRO>;

#[derive(Debug)]
pub enum DBERRO {
    NotFound,

}

#[derive(Debug, Serialize, Deserialize)]
pub enum Bignum {
    Int(i64),
    Float(f64),
}

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
    component_info: ComponentInfo,
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
    resources: HashMap<String, CompInfo>,
    containers: HashMap<String, CompInfo>,
    store: HashMap<String, CompInfo>,
    custom: HashMap<String, CompInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompInfo {
    name: String,
    catagory: String,
    notification: HashMap<String, String>,
    data: HashMap<String, String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SimOutData {
    pub time: Bignum,
    pub component_category: CatComp,
    pub component_name: String,
    pub action: String,
    pub entity: Option<String>,
    pub metadata: Option<Vec<(String, String)>>,
}

impl DB {
    pub fn new(dbname: &str, name: &str, conn: &str, tablename: &str) -> DBResult<DB> {
        Ok(DB {
            db_name: dbname.to_string(),
            name: name.to_string(),
            conn: conn.to_string(),
            modifid: false,
            save_time: 0,
            database: tablename.to_string(),
            component_info: ComponentInfo {
                workflow: HashMap::new(),
            },
        })
    }

    pub fn add_workflow(&mut self, name: &str) -> DBResult<()> {
        self.component_info.workflow.insert(
            name.to_string(),
            Comp {
                resources: HashMap::new(),
                containers: HashMap::new(),
                store: HashMap::new(),
                custom: HashMap::new(),
            },
        );

        Ok(())
    }

    pub fn add_resource(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.resources.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
    }

    pub fn add_container(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.containers.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
    }

    pub fn add_store(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.store.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
    }

    pub fn add_custom(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.custom.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
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
        time: Bignum,
        component_category: CatComp,
        component_name: &str,
        action: &str,
        entity: Option<String>,
        metadata: Option<Vec<(String, String)>>,
    ) {
        self.table.push(SimOutData {
            time,
            component_category,
            component_name: component_name.to_string(),
            action: action.to_string(),
            entity,
            metadata,
        });
    }

    pub fn tablelen(&self) -> usize {
        self.table.len()
    }
}
