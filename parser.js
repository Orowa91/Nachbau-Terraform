var config = require('./config.json');

const hcl = require("hcl2-parser")
const fs = require("fs")

var myArray = {}


const configFile = fs.readFileSync("config.tfvars", "utf-8");
configFile.split(/\r?\n/).forEach(line =>  { // read config file line by line
	
	var newLine = line.split(/\s/).join(''); // remove white spaces
	//var newLine = newLine.replaceAll('"', '');
	
	var splitted = newLine.split("=");
	
	
	
	var checkString = splitted[1].match("^\"(.*)\"$"); // is string
	
	if(checkString){
		console.log(splitted[1] + " is a string");
		myArray[splitted[0]] = ["string", checkString[1]];
	} else {
		
		var checkNumber = splitted[1].match("[+-]?([0-9]*[.])?[0-9]+"); // is number
		if(checkNumber){
			console.log(splitted[1] + " is a number");
			myArray[splitted[0]] = ["number", checkNumber[0]];
		} else {
			
			var checkBool = splitted[1].match("(true|false)"); // is boolean
			if(checkBool){
				console.log(splitted[1] + " is a boolean");
				myArray[splitted[0]] = ["bool", checkBool[1]];
			} else {
				throw new Error(splitted[1] + ": Invalid data type");
			}
		}
	}
	
	
	
	
	
	
	
	//console.log(result);
	
    
    //console.log(string);
	//console.log(`Line from file: ${line}`);
});

console.log(myArray);



var hclSchema = fs.readFileSync("main.tf");
stringSchema = hcl.parseToString(hclSchema)
console.log(stringSchema);
stringArray = JSON.parse(stringSchema[0]);
console.log(stringArray);

//if(stringArray.variable !== undefined){
//	throw new Error("Invalid schema");
//}


for(var attributename in stringArray){
	console.log(attributename);
	if(attributename != "variable" && attributename != "provider"){
		throw new Error("Invalid schema");
	}
}

	var variables = [];
	for(var attributename in stringArray.variable){
		if(myArray[attributename] !== undefined){ // check if attriubte exists
		
	
		const type = stringArray.variable[attributename][0].type;
		if(type === undefined){
			throw new Error("Invalid schema. Only type is allowed");
		}
		var typeParsed = type.substring(
			type.indexOf("${") + 2, 
			type.lastIndexOf("}")
		);
		
		console.log("---");
		console.log(typeParsed);
		
		if(typeParsed == "string" || 
			typeParsed == "number" || 
			typeParsed == "bool" 
			//typeParsed == "map" || 
			//typeParsed == "list" || 
			//typeParsed == "tupel" || 
			//typeParsed == "object" || 
			//typeParsed == "null"
			){
			
			
			
			if(myArray[attributename][0] == typeParsed){
				console.log(`${attributename} is ${typeParsed}: ${myArray[attributename]}`)
				variables.push(attributename);
			} else {
				throw new Error(`${attributename} wrong data type`);
			}
			console.log("---");
		
		} else {
			throw new Error(`Invalid data type`)	
		}
	
	} else {
		throw new Error(`Missing ${attributename} variable in .tfvars file`);
	}
	
    //console.log(attributename+": "+stringArray[attributename]);
	}
	
	console.log(variables);
	
	providerJson = Object.keys(stringArray.provider)
	providerName = providerJson[0];
	
	console.log(providerName);
	if((config.provider).includes(providerName)){
		var credentials = stringArray.provider[providerName][0].credentials;
		var region = stringArray.provider[providerName][0].region;
		if(credentials !== undefined){
			if(region !== undefined){
				
				for(var attributename in stringArray.provider[providerName][0]){
					
					var value = stringArray.provider[providerName][0][attributename];
					
					console.log("value:" + value);
					
					var checkVariable = String(value).match("[$]{(.*)}$"); // is variable
				//console.log(checkVariable);
				if(checkVariable){
					var checkVariableName = checkVariable[1].match("^var.(.*)"); // is variable starting var.
					if(checkVariableName){
						if(variables.includes(checkVariableName[1])){ // check if variable exists
							console.log(checkVariableName[1])
						} else {
							throw new Error("Undefined variable for " + attributename);
						}
					} else {
						throw new Error("Invalid value for " + attributename);
					}
				} else {
					if(typeof value === 'string'){
						console.log("is string");
					} else {
						throw new Error("Invalid data type for " + attributename);
					}
				}
					
				}
	

				
				
			} else {
			console.log("Missing region parameter in provider");
			}
			
		} else {
			console.log("Missing credentials parameter in provider");
		}
		
		
	} else {
		throw new Error("Unsupported provider");
	}
	
	//for(var attributename in stringArray.provider){
	
//var len = stringArray.variable.length;
//console.log(len);
//for (var i = 0; i < len; i++) {
  // console.log(hclSchema.variable[i]);
// }




