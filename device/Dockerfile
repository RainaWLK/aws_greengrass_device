FROM python:3.6-alpine

RUN apk update && \
    apk add gcc python3-dev git

WORKDIR /app
ADD . device/

RUN git clone https://github.com/aws/aws-iot-device-sdk-python.git
RUN cd aws-iot-device-sdk-python && python setup.py install
