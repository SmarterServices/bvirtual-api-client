# bvirtual-api-client

## Introduction


This lib is used as a wrapper around api calls to bvirtual api client

## Installation

### Requirements

NODE v4.0 or higher

### Install Process
npm install

### Configuration	
	let clientLib = require('bvirtual-api-client');
	let client = new BVirtualClient({url, token: correctToken});
	client.registerStudent({firstName: "name", phoneNo:"0123",...});
	client.getAllProctorsForInstitute();
	...

	//All of the above are promises

## Running Application/Code

### Running Locally

gulp test to run tests.
### Running in Production

N/A
## External Dependencies
All packages pulled in by the package.json file.

## Deployment

N/A

## Cronjobs
N/A

## Credits

**Original Author**

* [Ashik Ahmed](https://github.com/ahmedEnosis)
* [Muntasir Ahmed](https://github.com/muntasir-ahmed)
