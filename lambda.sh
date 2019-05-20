#!/bin/sh

rm -Rf lambda
mkdir lambda
cp -R iot/* lambda/
cd lambda
mkdir cert
cp ../cert/intermediate.crt cert/
zip ../iot.zip -r .
cd ..