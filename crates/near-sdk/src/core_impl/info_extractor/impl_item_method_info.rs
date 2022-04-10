use crate::core_impl::info_extractor::AttrSigInfo;
use proc_macro2::{TokenStream as TokenStream2};
use syn::{ImplItemMethod, Type, Visibility, ReturnType, ItemFn};
use quote::quote;

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
        Ok(Self { attr_signature_info, is_public, struct_type })
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
          result_serializer,
          method_type,
          is_payable,
          is_private,
          ..
      } = &self.attr_signature_info;

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
                  /// change
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
            anyhow::bail!("failed to parse method");},
          |f| Ok(syn::Item::Fn(f)),
      )
  }
}

