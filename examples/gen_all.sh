#!/bin/bash
set -e

pushd $(dirname ${BASH_SOURCE[0]})
(cd .. && cargo build --release)

for d in */Cargo.toml ; do
    d=$(dirname "$d");
    echo "Generating $d";
    (cd $d && ../../target/release/witme near wit -t ./ts/ --sdk && ../../target/release/witme near json)
done

popd
