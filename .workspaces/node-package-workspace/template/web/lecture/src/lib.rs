use std::collections::HashMap;
use std::hash::Hash;

const DEFAULT_FIRST: u32 = 1;
const MAX_FIRST: u32 = 100;
const OFFSET_PAGINATION_DEPRECATION: &str =
    "offset/limit pagination is deprecated; use after/first cursor pagination";

pub struct DataLoader<B, K, V>
where
    B: Fn(&[K]) -> Vec<(K, V)>,
    K: Eq + Hash + Clone,
    V: Clone,
{
    batch_load: B,
    cache: HashMap<K, V>,
}

impl<B, K, V> DataLoader<B, K, V>
where
    B: Fn(&[K]) -> Vec<(K, V)>,
    K: Eq + Hash + Clone,
    V: Clone,
{
    pub fn new(batch_load: B) -> Self {
        Self {
            batch_load,
            cache: HashMap::new(),
        }
    }

    pub fn load_many(&mut self, keys: &[K]) -> Vec<Option<V>> {
        let mut missed = Vec::new();
        for key in keys {
            if !self.cache.contains_key(key) {
                missed.push(key.clone());
            }
        }

        if !missed.is_empty() {
            for (key, value) in (self.batch_load)(&missed) {
                self.cache.insert(key, value);
            }
        }

        keys.iter().map(|key| self.cache.get(key).cloned()).collect()
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RelayPaginationArgs {
    pub after: Option<String>,
    pub first: Option<u32>,
    pub offset: Option<u32>,
    pub limit: Option<u32>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RelayPagination {
    pub after: Option<String>,
    pub first: u32,
    pub deprecation: Option<&'static str>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PaginationError {
    FirstOutOfRange { value: u32, min: u32, max: u32 },
}

pub fn normalize_relay_pagination(args: RelayPaginationArgs) -> Result<RelayPagination, PaginationError> {
    let mut deprecation = None;
    let mut after = args.after;

    if after.is_none() && args.offset.is_some() {
        let offset = args.offset.unwrap_or(0);
        after = Some(format!("offset:{offset}"));
        deprecation = Some(OFFSET_PAGINATION_DEPRECATION);
    }

    let first = if args.limit.is_some() {
        deprecation = Some(OFFSET_PAGINATION_DEPRECATION);
        args.limit.unwrap_or(DEFAULT_FIRST)
    } else {
        args.first.unwrap_or(DEFAULT_FIRST)
    };

    if first > MAX_FIRST {
        return Err(PaginationError::FirstOutOfRange {
            value: first,
            min: 0,
            max: MAX_FIRST,
        });
    }

    Ok(RelayPagination {
        after,
        first,
        deprecation,
    })
}

#[cfg(test)]
mod tests {
    use super::{
        normalize_relay_pagination, DataLoader, PaginationError, RelayPagination, RelayPaginationArgs,
        OFFSET_PAGINATION_DEPRECATION,
    };
    use std::cell::RefCell;
    use std::collections::HashMap;
    use std::rc::Rc;

    #[test]
    fn loads_in_batch_and_keeps_input_order() {
        let call_count = Rc::new(RefCell::new(0usize));
        let call_count_clone = Rc::clone(&call_count);

        let mut loader = DataLoader::new(move |keys: &[u32]| {
            *call_count_clone.borrow_mut() += 1;

            let mut store = HashMap::new();
            store.insert(1, "one".to_string());
            store.insert(2, "two".to_string());
            store.insert(3, "three".to_string());

            keys.iter()
                .filter_map(|k| store.get(k).map(|v| (*k, v.clone())))
                .collect::<Vec<_>>()
        });

        let first = loader.load_many(&[2, 1, 3]);
        assert_eq!(
            first,
            vec![
                Some("two".to_string()),
                Some("one".to_string()),
                Some("three".to_string())
            ]
        );

        let second = loader.load_many(&[1, 2]);
        assert_eq!(
            second,
            vec![Some("one".to_string()), Some("two".to_string())]
        );
        assert_eq!(*call_count.borrow(), 1);
    }

    #[test]
    fn returns_none_for_missing_keys() {
        let mut loader = DataLoader::new(|keys: &[u32]| {
            keys.iter()
                .filter(|k| **k == 1)
                .map(|k| (*k, "one".to_string()))
                .collect::<Vec<_>>()
        });

        let values = loader.load_many(&[1, 2]);
        assert_eq!(values, vec![Some("one".to_string()), None]);
    }

    #[test]
    fn normalizes_cursor_first_pagination() {
        let pagination = normalize_relay_pagination(RelayPaginationArgs {
            after: Some("cursor-1".to_string()),
            first: Some(25),
            offset: None,
            limit: None,
        })
        .expect("must normalize valid cursor pagination");

        assert_eq!(
            pagination,
            RelayPagination {
                after: Some("cursor-1".to_string()),
                first: 25,
                deprecation: None,
            }
        );
    }

    #[test]
    fn applies_deprecation_for_offset_limit_and_uses_default_first_1() {
        let pagination = normalize_relay_pagination(RelayPaginationArgs {
            after: None,
            first: None,
            offset: Some(0),
            limit: None,
        })
        .expect("must normalize deprecated offset args");

        assert_eq!(
            pagination,
            RelayPagination {
                after: Some("offset:0".to_string()),
                first: 1,
                deprecation: Some(OFFSET_PAGINATION_DEPRECATION),
            }
        );
    }

    #[test]
    fn rejects_first_over_100() {
        let error = normalize_relay_pagination(RelayPaginationArgs {
            after: None,
            first: Some(101),
            offset: None,
            limit: None,
        })
        .expect_err("first over max should fail");

        assert_eq!(
            error,
            PaginationError::FirstOutOfRange {
                value: 101,
                min: 0,
                max: 100,
            }
        );
    }
}
