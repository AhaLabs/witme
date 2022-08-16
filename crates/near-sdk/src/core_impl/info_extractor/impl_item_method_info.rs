use crate::core_impl::info_extractor::AttrSigInfo;
use crate::ItemImplInfo;
use proc_macro2::TokenStream as TokenStream2;
use quote::quote;
use syn::{Attribute, ImplItemMethod, Item, ItemFn, ReturnType, Type, Visibility};

use super::ArgInfo;

/// Information extracted from `ImplItemMethod`.
pub struct ImplItemMethodInfo {
    /// Information on the attributes and the signature of the method.
    pub attr_signature_info: AttrSigInfo,
    /// Whether method has `pub` modifier.
    pub is_public: bool,
    /// The type of the contract struct.
    pub struct_type: Type,
}

impl ImplItemMethodInfo {
    /// Process the method and extract information important for near-sdk.
    pub fn new(original: &mut ImplItemMethod, struct_type: Type) -> syn::Result<Self> {
        let ImplItemMethod { attrs, sig, .. } = original;
        let attr_signature_info = AttrSigInfo::new(attrs, sig)?;
        let is_public = matches!(original.vis, Visibility::Public(_));
        Ok(Self {
            attr_signature_info,
            is_public,
            struct_type,
        })
    }
}

impl TryInto<syn::Item> for ImplItemMethodInfo {
    type Error = anyhow::Error;

    fn try_into(self) -> Result<syn::Item, Self::Error> {
        let AttrSigInfo {
            non_bindgen_attrs,
            ident,
            receiver,
            returns,
            method_type,
            is_private,
            ..
        } = &self.attr_signature_info;

        if *is_private {
            anyhow::bail!("Can't generate private method")
        }

        let non_bindgen_attrs = non_bindgen_attrs
            .iter()
            .fold(TokenStream2::new(), |acc, value| {
                quote! {
                    #acc
                    #value
                }
            });
        let mut args = TokenStream2::new();
        // Todo: don't use string
        for arg in self.attr_signature_info.input_args() {
            let ArgInfo { ident, ty, .. } = &arg;
            let mut arg_str = (quote! {#ty}).to_string();
            arg_str = arg_str.replace("near_sdk :: json_types :: U128", "U128");
            let ty = syn::parse_str::<syn::Type>(&arg_str).unwrap();
            args.extend(quote! {
                #ident: #ty,
            });
        }

        let change_comment = if matches!(method_type, crate::MethodType::View) {
            quote! {}
        } else {
            quote! {
              /// @mutable
            }
        };

        let returns = match returns {
            ReturnType::Default => quote! {#returns},
            // TODO: improve this to not use string checks.
            ReturnType::Type(_, b) => {
                let ty_str = (quote! {#b}).to_string();
                if receiver.is_none() || ty_str.contains("Promise") {
                    quote! {}
                } else if ty_str.contains("U128") {
                    quote! { -> U128}
                } else {
                    quote! {#returns}
                }
            }
        };

        let func = quote! {
          #non_bindgen_attrs
          #change_comment
          #[witgen]
          pub fn #ident(#args) #returns {}
        };

        // TODO: Better error handling
        syn::parse2::<ItemFn>(func).map_or_else(
            |_| {
                anyhow::bail!("failed to parse method");
            },
            |f| Ok(syn::Item::Fn(f)),
        )
    }
}

use syn::visit::Visit;
use syn::ItemImpl;

pub struct ImplVisitor {
    pub functions: Vec<ItemFn>,
}

impl ImplVisitor {
    pub fn to_items(self) -> Vec<syn::Item> {
        self.functions.into_iter().map(syn::Item::Fn).collect()
    }

    pub fn find_items_in_file(ast: &syn::File) -> Vec<syn::Item> {
        let mut visitor = Self {
            functions: Vec::new(),
        };
        visitor.visit_file(ast);
        visitor.to_items()
    }
}

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

impl<'ast> Visit<'ast> for ImplVisitor {
    fn visit_item_impl(&mut self, node: &'ast ItemImpl) {
        if !has_macro(&Some(&node.attrs), "near_bindgen") {
            return;
        }
        let mut input = node.clone();
        let impl_info = ItemImplInfo::new(&mut input).unwrap();
        let impls: Vec<Item> = impl_info
            .methods
            .into_iter()
            .filter(|m| m.is_public || impl_info.is_trait_impl)
            .filter_map(|method| method.try_into().ok())
            .collect();

        for item in impls {
            if let Item::Fn(i) = item {
                self.functions.push(i);
            }
        }
        // visit::visit_item_impl(self, node);
    }
}
