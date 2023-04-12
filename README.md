# iotman-logger

### MQTT to MySQL logger Service for **Iotman** project

## Features

* listening MQTT all topics '#'
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

## Install

    nmp i mqtt --save
    nmp i mysql --save