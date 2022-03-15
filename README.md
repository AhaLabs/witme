# witme

Tools for generating to and from wit format.

```bash
cargo install witme
```

If generating json schemas need [nodejs](https://nodejs.org/en/) installed. One suggestion is to use [nvm](https://github.com/nvm-sh/nvm).

## Features

Currently this repo is geared toward NEAR smart contracts (currently only for Rust), but the goal is to become a general purpose tool for working with [`.wit` format](https://github.com/bytecodealliance/wit-bindgen/blob/main/WIT.md).

- Generate `.wit` from NEAR smart contracts written in Rust
- Generate TS from `.wit` for interacting with contracts
- Generate JSON Schema from TS (in the future will be directly from wit)

## CLI

Currently there is a `near` subcommand for dealing with NEAR related transformations.

- `witme near wit`
  - generates a `index.wit` file in the root of a rust project (note: it can't be a workspace). This builds on [witgen](https://github.com/bnjjj/witgen).
- `witme near ts`
  - generates ts files from a `.wit` file (defaults `index.wit` -> `./ts/*`). This builds on [wit-bindgen](https://github.com/bytecodealliance/wit-bindgen)
- `wit near json`
  - generates a json schema for the inputs to a schema from the typescript (defaults `./ts/index.ts` --> `index.schema.json`), which uses [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator).

## Extensions

The generated json schema can be used to automatically generate a react form which can validate the arguments to a contract call. Since `.wit` has a notion of documentation comments the documentation provided by the Rust source will be available in the generated TS and Json schema. This also allows special annotations which can add more conditions on the types used in the contract.

For example,

```rust
///  @minLength 2
///  @maxLength 64
///  @pattern ^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$
type AccountId = String
```

Generates the following wit:

```wit
///  @minLength 2
///  @maxLength 64
///  @pattern ^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$
type account-id = string
```

which generates the following typescript:

```typescript
/**
* @minLength 2
* @maxLength 64
* @pattern ^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$
*/
export declare type AccountId = string;
```

which generates the following json schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "AccountId": {
      "maxLength": 64,
      "minLength": 2,
      "pattern": "^(([a-z\\d]+[-_])*[a-z\\d]+\\.)*([a-z\\d]+[-_])*[a-z\\d]+$",
      "type": "string"
    },

```

Consider the `rust-status-message` example in this repo:

```rust
/// Retreive a message for a given account id
pub fn get_status(&self, account_id: AccountId) -> Option<String> {
    self.records.get(&account_id)
}
```

generates the following schema for its arguments:

```json
{
  "GetStatus": {
      "additionalProperties": false,
      "contractMethod": "view",
      "description": "Retreive a message for a given account id",
      "properties": {
        "account_id": {
          "$ref": "#/definitions/AccountId"
        }
      },
      "required": [
        "account_id"
      ],
      "type": "object"
    },
}
```

And the following TS method on the generated `Contract` class:

```typescript
    /**
    * Retreive a message for a given account id
    */
    get_status(args: {
        account_id: AccountId;
    }, options?: ViewFunctionOptions): Promise<string | null>;
```

See [close-up](https://ahalabs.dev/close-up/) for an example for generating forms from a schema.

## Note

Currently `.wit` doesn't prescribe how variant types are implemented for a language. `witme` currently supports JSON encoded arguments and return values. Thus variants are currently encoded the same as the defaults provided by serde_json. However, in the future borsh support would remove this restriction and allow variant types to be encoded more efficiently.

## Roadmap

- Provide a generator for Rust to allow both cross contract calls and client/tests implementations.
- Generate json schema directly from `wit`
- Have validation be generated in Rust and compiled to Wasm to simplify the validation and allow transformations like encoding to borsh to be handled behind the scenes.
