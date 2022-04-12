use syn::{Attribute, File, Item};

pub fn has_macro(attrs: &Option<&[Attribute]>, macro_name: &str) -> bool {
    attrs.map_or(false, |attrs| {
        for attr in attrs.iter() {
            if format!("{:#?}", attr.path).contains(macro_name) {
                return true;
            }
        }
        false
    })
}

pub trait Transformer {
    fn transform(&self, i: Item) -> Vec<Item>;
}

pub fn transform_pass(file: File, transformer: &dyn Transformer) -> File {
    let mut file = file;
    file.items = transform_vec(file.items, transformer);
    file
}

pub fn transform_vec(ts: Vec<Item>, transformer: &dyn Transformer) -> Vec<Item> {
    let mut result = vec![];
    for t in ts {
        result.extend(transform(t, transformer).into_iter())
    }
    result
}

pub fn transform(item: Item, transformer: &dyn Transformer) -> Vec<Item> {
    match item {
        Item::Mod(mut m) => {
            m.content = m
                .content
                .map(|(b, items)| (b, transform_vec(items, transformer)));
            vec![Item::Mod(m)]
        }
        _ => (transformer.transform(item)).to_vec(),
    }
}
