﻿# iotman-logger

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

    .env
    rename .env.sample

#### MQTT Connection parameters
    topic = '#' - subscribe topic
    host = 'mqtt.somehost.org' - MQTT server host
    port = '1883' - MQTT server port
    username = '' - username
    password = '' - password

#### MySQL connection paarameters
    myHost = 'localhost'; - MySQL connection host
    myUser = 'root'; - MySQL connection username
    myPassword = ''; - MySQL connection password
    myDatabase = 'iotman'; - MySQL database
    myTable = 'loggers'; - MySQL log table
