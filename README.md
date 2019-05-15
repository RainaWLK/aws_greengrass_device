# CA
```shell
aws iot get-registration-code
```

```shell
openssl genrsa -out verificationCert.key 2048
```

```
openssl req -new -key verificationCert.key -out verificationCert.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:TW
State or Province Name (full name) []:Taipei
Locality Name (eg, city) []:
Organization Name (eg, company) []:Moxa
Organizational Unit Name (eg, section) []:
Common Name (eg, fully qualified host name) []: <registration-code>    
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:1234
```

```shell
openssl x509 -req -in verificationCert.csr -CA ../root.crt -CAkey ../root.key -CAcreateserial -out verificationCert.crt -days 500 -sha256
```

# Device

```shell
openssl genrsa -out device1.key 2048
```
```shell
openssl req -new -key device1.key -out device1.csr
```

```
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:TW
State or Province Name (full name) []:Taipei
Locality Name (eg, city) []:Taipei
Organization Name (eg, company) []:Moxa
Organizational Unit Name (eg, section) []:ICS
Common Name (eg, fully qualified host name) []:
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
```

# for AWS
get certificate id

Linux
```shell
openssl x509 -in [file.crt] -outform der | sha256sum
```

Mac OS X
```shell
openssl x509 -in [file.crt] -outform der | shasum -a 256
```

If certification is string format
```shell
echo '${cert}' | openssl x509 -outform der | sha256sum
```