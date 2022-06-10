var config = require('./config.json');
const args = require('args-parser')(process.argv);

console.info(args);

const hcl = require("hcl2-parser");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });

//const rl = readline.createInterface({
//  input: process.stdin,
//  output: process.stdout
//});

var myArray = {}
var variables = [];
var defaultValues = {}
var descriptions = {}
var dataTypes = {}

function checkArguments(args){
if(args.validate !== undefined && args.create === undefined && args.delete === undefined){
	console.log("validate");
} else if(args.create !== undefined && args.validate === undefined && args.delete === undefined){
	console.log("create");
} else if(args.delete !== undefined && args.validate === undefined && args.create === undefined){
	console.log("delete");
} else if(args.help !== undefined && args.delete === undefined && args.validate === undefined && args.create === undefined){
	console.log("delete");
} else {
	console.log("undefinied functions");
}
}

function checkFileArgument(args){
if(args["var-file"] !== undefined){
	if(args["var-file"] !== true){
		console.log(args["var-file"]);
		var parts = args["var-file"].split(".");
		var result = parts[parts.length - 1];
		if(result == "tfvars"){
			if (fs.existsSync(args["var-file"])) {
				console.log("exists:", args["var-file"]);
				return args["var-file"];
			} else {
				throw new Error("DOES NOT exist:", args["var-file"]);
			}
		} else {
			throw new Error("Invalid file type");
		}
	} else {
		throw new Error("Missing value for var-file");
	}
} else {
	console.log("var file missing");
	return false;
}
}


var hclSchema = fs.readFileSync("main.tf");
stringSchema = hcl.parseToString(hclSchema)
console.log(stringSchema);
stringArray = JSON.parse(stringSchema[0]);
console.log(stringArray);

checkSchemeVariables(stringArray);
checkSchemeProviders(stringArray);

const configFileName = checkFileArgument(args)
if(configFileName !== false){
	const configFile = fs.readFileSync(configFileName, "utf-8");
	checkConfig(configFile);
} else {
	userInput(stringArray);
}

function userInput(scheme){
	console.log(defaultValues);
	var config = "";
	for(var attributename in scheme.variable){
		const type = scheme.variable[attributename][0].type;
		var typeParsed = type.substring(
			type.indexOf("${") + 2, 
			type.lastIndexOf("}")
		);
		console.log("var." + attributename + " (Data Type: " + typeParsed + ")");

		if(descriptions[attributename] !== undefined){
			console.log("Description: " + descriptions[attributename]);
		}
		//rl.question('Enter a value: ', function (value) {
		//	config += attributename + "=" + value + "\n";
		//});
		var value = prompt("Enter a value: ");
		
		while(true){
		if(dataTypes[attributename] == "number"){
			value = parseFloat(value);
				if(isNaN(value) && defaultValues[attributename] === undefined){
					value = prompt("Enter a value: ");
				} else {
					break;
				}
			} else if (dataTypes[attributename] == "bool"){
				value = value.match("(true|false)"); // is boolean
				if(!value && defaultValues[attributename] === undefined){
					value = prompt("Enter a value: ");
				} else if(defaultValues[attributename] !== undefined) {
					
				} else {
					value = checkBool[1];
					break;
				}
			} else {
				value = "\"" + value + "\"";
				break;
			}
			console.log("Invalid data type");
		}
		 
		
		if(defaultValues[attributename] !== undefined){
			if(value == ""){
				value = defaultValues[attributename];
				console.log("Using default value: " + defaultValues[attributename]);
			}
		} else {
			while(value == ""){
				value = prompt("Enter a value: ");
			}
		}
		//const value = prompt("Enter a value: ");
		
		
		config += attributename + "=" + value + "\n";
		
		console.log("\n");
	}
	console.log(config);
	   // rl.close();
}

//console.log(parseArgs);


function parseDataType(input){
	// is number?
	const number = parseFloat(input);
	if(!isNaN(number)) {
		
	}
}


function checkConfig(config){
config.split(/\r?\n/).forEach(line =>  { // read config file line by line
	
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
	
});	
	
}
	
	
	
	//console.log(result);
	
    
    //console.log(string);
	//console.log(`Line from file: ${line}`);


console.log(myArray);





//if(stringArray.variable !== undefined){
//	throw new Error("Invalid schema");
//}


// Check if Config file is valid
function checkSchemeVariables(scheme){
	console.log("Call function checkScheme\n----------------");
	for(var attributename in scheme){
	console.log(attributename);
	if(attributename != "variable" && attributename != "provider"){
		throw new Error("Invalid schema");
	}
}

	
	for(var attributename in scheme.variable){
		const type = scheme.variable[attributename][0].type;
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
							variables.push(attributename);
							
							const defaultValue = scheme.variable[attributename][0].default;
							if(defaultValue !== undefined){
								defaultValues[attributename] = defaultValue;
							}
							
							const description = scheme.variable[attributename][0].description;
							if(description !== undefined){
								descriptions[attributename] = description;
							}
							
							dataTypes[attributename] = typeParsed;

		} else {
			throw new Error(`Invalid data type`)	
		}
	
    //console.log(attributename+": "+stringArray[attributename]);
	}
}


// Check if Config file is valid
function matchConfig(config, scheme){
		for(var attributename in scheme.variable){
			if(myArray[attributename] !== undefined){ // check if attriubte exists
				const type = scheme.variable[attributename][0].type;
				var typeParsed = type.substring(
					type.indexOf("${") + 2, 
					type.lastIndexOf("}")
				);
				if(myArray[attributename][0] == typeParsed){
					console.log(`${attributename} is ${typeParsed}: ${myArray[attributename]}`)
				} else {
					throw new Error(`${attributename} wrong data type`);
				}
				console.log("---");
			} else {
				throw new Error(`Missing ${attributename} variable in .tfvars file`);
		}
	
    //console.log(attributename+": "+stringArray[attributename]);
	}
}



	
function checkSchemeProviders(scheme){	
	console.log(variables);
	
	providerJson = Object.keys(scheme.provider)
	providerName = providerJson[0];
	
	console.log(providerName);
	if((config.provider).includes(providerName)){
		var credentials = scheme.provider[providerName][0].credentials;
		var region = scheme.provider[providerName][0].region;
		if(credentials !== undefined){
			if(region !== undefined){
				
				for(var attributename in scheme.provider[providerName][0]){
					
					var value = scheme.provider[providerName][0][attributename];
					
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
}	
	
	
/*
	
// read variables.tf file	
var variablesSchema = fs.readFileSync("variables.tf");
stringVariablesSchema = hcl.parseToString(variablesSchema)
console.log(stringVariablesSchema);
stringVariablesArray = JSON.parse(stringVariablesSchema[0]);
console.log(stringVariablesArray);	
	

// check if only key "variable" exists in file
for(var attributename in stringVariablesArray){
	console.log(attributename);
	if(attributename != "variable"){
		throw new Error("Invalid schema");
	}
}	


for(var attributename in stringArray.variable){
	//if(
	console.log(attributename)
}
	
*/	
	//for(var attributename in stringArray.provider){
	
//var len = stringArray.variable.length;
//console.log(len);
//for (var i = 0; i < len; i++) {
  // console.log(hclSchema.variable[i]);
// }




