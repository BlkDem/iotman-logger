# iotman-logger

MQTT to MySQL logger Service for **Iotman** project

## Features

* listening MQTT topic '#'
* Transform incomming Data to the specific format '/$idx/$path' => $value
* Write the transformed data to MySQL Database 
* Running as a Linux Service (Daemon)

## Table Structure

	1	log_level	    int(11)
	2	log_category	varchar(255)
    3	log_instance	varchar(255)	    	
	4	log_data	    varchar(1024)	    	
	5	created_at	    timestamp				
	6	updated_at	    timestamp

## MQTT Server

    Default: mosquitto

## Configure parameters

    config.js
    rename config.js.example

#### MQTT Connection parameters
    const topic = '#' - subscribe topic
    const host = 'mqtt.somehost.org' - MQTT server host
    const port = '1883' - MQTT server port
    const username = '' - username
    const password = '' - password

#### MySQL connection paarameters
    const myHost = 'localhost'; - MySQL connection host
    const myUser = 'root'; - MySQL connection username
    const myPassword = ''; - MySQL connection password
    const myDatabase = 'iotman'; - MySQL database
    const myTable = 'loggers'; - MySQL log table

## Install

    nmp i mqtt --save
    nmp i mysql --save