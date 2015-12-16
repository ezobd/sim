/*
TODO: create a dictionary of reqeust:response
0100:4100b8aa4444
remove spaces and /r from incomming requests  ATZ and AT Z
red car.cfg







*/

var net = require('net');
var fs = require('fs');
var callCount = 0;


function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ':'+str.charCodeAt(i).toString(16);
    }
    return hex;
}

function socketwrite(socket,txt) {
	console.log('-----------------------------------1')
	//var rtxt = txt.replace('\r','r');
	var rtxt = convertToHex(txt);
	console.log('socket_write',rtxt);
	console.log('-----------------------------------2')
	socket.write(txt);

}


if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

replaceAt=function(instring,index, character) {
    return instring.substr(0, index) + character + instring.substr(index+character.length);
}

var carcfg = JSON.parse(fs.readFileSync('./car.cfg', 'utf8'));

var headerOn = false;
var ecu = 0;

var protocol = -1;
var baselineTimeStamp = new Date();

console.log('year',carcfg.year);
console.log('make',carcfg.make);
console.log('model',carcfg.model);
console.log('protocol',carcfg.protocol);
console.log('ecu',carcfg.ecu);



net.createServer(function(socket){




	socket.on("error", function (er) {
		console.log('er',er);
	});

    socket.on('data', function(data){
		console.log(data.toString());

		var inString = data.toString();
		inString = inString.toUpperCase();
		inString = inString.replace(" ","");
		var dataLen = data.length;
		var hexString = "";

		var runningTimeStamp = new Date();
		var timeInSecondsSinceStart = (runningTimeStamp - baselineTimeStamp)/1000; 
		var sinz = Math.sin(timeInSecondsSinceStart);
		var sinzm = Math.sin(timeInSecondsSinceStart - (Math.PI/2));   // late, shift fword
		var sinzp = Math.sin(timeInSecondsSinceStart + (Math.PI/2));  // early, shift back?

		var noRstring2 = inString.replace('\r','')


		var zOutString = noRstring2.replaceAt(0,'4') + '1234\r\r>';


		for(i=0;i<dataLen;i++) {
			hexString += data[i].toString(16);
			hexString += ":";
		}

		var noRstring = inString.replace('\r','\\r')

		var hexEcu = ecu.toString(16);
		//console.log('incomming: hex(',hexString,') char',noRstring,')','ecu',hexEcu,'callCount',callCount , 'timeInSecondsSinceStart',timeInSecondsSinceStart/Math.PI,'sinz',sinz);
		//console.log('incomming: hex(',hexString,') char(',noRstring,')');
		callCount++;

		switch (inString) {

/////////////////////////////////////////////////////
////////////////  AT CMDS ///////////////////////////
/////////////////////////////////////////////////////

			case 'ATZ\r':

			setTimeout(function () {

				socketwrite(socket,"\r\rELM327 v1.5\r\r>");
				//socket.write("\r\rELM327 v1.5\r\r>");


			},100);

			break;

			case 'ATI\r':

			setTimeout(function () {

				socketwrite(socket,"ELM327 v1.5\r\r>");
				//socket.write("\r\rELM327 v1.5\r\r>");


			},100);

			break;


 
			case 'ATD\r':
			console.log('retting atdrrokrr');
			socket.write("ATD\r\rOK\r\r>");
			break;


			case 'AT@1\r':
			socket.write("OBDIItoRS232Interpreter\r\r>");
			break;


			case 'ATSPC\r':			protocol = 12;			socket.write("OK\r\r>");			break;
			case 'ATSPB\r':			protocol = 11;			socket.write("OK\r\r>");			break;
			case 'ATSPA\r':			protocol = 10;			socket.write("OK\r\r>");			break;
			case 'ATSP9\r':			protocol = 9;			socket.write("OK\r\r>");			break;
			case 'ATSP8\r':			protocol = 8;			socket.write("OK\r\r>");			break;
			case 'ATSP7\r':			protocol = 7;			socket.write("OK\r\r>");			break;
			case 'ATSP6\r':			protocol = 6;			socket.write("OK\r\r>");			break;
			case 'ATSP5\r':			protocol = 5;			socket.write("OK\r\r>");			break;
			case 'ATSP4\r':			protocol = 4;			socket.write("OK\r\r>");			break;
			case 'ATSP3\r':			protocol = 3;			socket.write("OK\r\r>");			break;
			case 'ATSP2\r':			protocol = 2;			socket.write("OK\r\r>");			break;
			case 'ATSP1\r':			protocol = 1;			socket.write("OK\r\r>");			break;
			case 'ATSP0\r':			protocol = 0;			socket.write("OK\r\r>");			break;




			case 'ATH0\r':
			headerOn = false;		
			socket.write("OK\r\r>");			
			break;

			case 'ATH1\r':			
			headerOn = true;			
			socket.write("OK\r\r>");			
			break;



			case 'ATR1\r':			
			socket.write("OK\r\r>");			
			break;


			case 'ATDP\r':			
			socket.write("AUTO\r\r>");			
			break;

			case 'ATDPN\r':
			socket.write("A0\r\r>");
			break;


			//case 'STI\r':  // obdlink 
			//case 'STMFR\r':  // obdlink


			case 'ATE0\r':
			case 'ATS0\r':
			case 'ATL0\r':
			// dont show unknown in output
			socket.write("OK\r\r>");
			break;




			case 'ATSH7E0\r':    ecu = 0x7e8;    socket.write("OK\r\r>"); break;
			case 'ATSH7E1\r':    ecu = 0x7e9;    socket.write("OK\r\r>"); break;
			case 'ATSH7E2\r':    ecu = 0x7ea;    socket.write("OK\r\r>"); break;
			case 'ATSH7E3\r':    ecu = 0x7eb;    socket.write("OK\r\r>"); break;
			case 'ATSH7E4\r':    ecu = 0x7ec;    socket.write("OK\r\r>"); break;
			case 'ATSH7E5\r':    ecu = 0x7ed;    socket.write("OK\r\r>"); break;
			case 'ATSH7DF\r':    ecu = 0;        socket.write("OK\r\r>"); break;





/////////////////////////////////////////////////////
////////////////  OBD CMDS //////////////////////////
/////////////////////////////////////////////////////

			case '0101\r':   // Monitor status since DTCs cleared.
			//socket.write("410112345678\r\r>");   // test 12345678
			//socket.write("410100076500\r\r>");   // from taho
			socket.write("410181076500\r\r>");   // from vibe
			break;


			case '0103\r':    // fuel system status
			socket.write("41030101\r\r>");  // from taho
			break;

			case '0104\r':    // engine load from taho
			socket.write("410408\r\r>");
			break;


			case '0105\r':   // engine coolant tmep
			socket.write("410557\r\r>");   // vibe

			/*	
			setTimeout(function () {
				socket.write("410557\r\r>");   // vibe

			},1000);
			*/

			break;


			case '0106\r':   // fuel trim short 1
			socket.write("410680\r\r>");   // taho
			break;



			case '0107\r':   // fuel trim long 1
			socket.write("41077E\r\r>");   // taho
			break;

			case '0108\r':   // fuel trim short 2
			socket.write("410882\r\r>");   // taho
			break;

			case '0109\r':   // fuel trim long 2
			socket.write("41097E\r\r>");   // taho
			break;


			case '010A\r':   // fuel pressure
			socket.write("410A0A\r\r>");   //  made up
			break;


			case '010B\r':   // Intake manifold absolute pressure
			socket.write("410B0A\r\r>");   //  made up
			break;



			case '010C\r':  // rpm using sin wave

			setTimeout(function () {
				//sinz = 0;  // kill sin		

				var rpm = 4000 + (sinz * 4000);  // 0 to 8K
				

				rpm *=4;
				var iRpm = Math.round(rpm);

				var hexRpm = iRpm.toString(16);

				var hexRpm2 = "0000" +  hexRpm;

				var hexRpm3 = hexRpm2.substr(-4);

				var hexRpm4 = hexRpm3.toUpperCase();


				//console.log('hexRpm',hexRpm,'hexRpm2',hexRpm2,'hexRpm3',hexRpm3,'hexRpm4',hexRpm4);

				
				var h = ("0000" + iRpm.toString(16)).substr(-4).toUpperCase();

				//console.log('h',h);

				var rpmString = "410C" + h + "\r\r>";

				var rpmString2 = "410C" + h + "rr>";
				//var rpmString = "410C" + h + "\r"+  "410C" + h  + "\r\r>";

				//console.log('iRpm',iRpm,'hexRpm',hexRpm,"rpmString2",rpmString2);

				//socket.write("410c1234\r\r>");	
				socket.write(rpmString);	


			},100);

			break;

			case '010D\r':  // speed
			socket.write("410D61\r\r>");	

			/*
			setTimeout(function () {
				socket.write("410D80\r\r>");

			},1000);
			*/


			break;


			case '010E\r':  // timing advance
			console.log('timeing advance');
			socket.write("410E89\r\r>");	
			break;


			case '010F\r':   // intake air tmep
			socket.write("410F4A\r\r>");   // vibe
			break;


			case '0110\r':   // MAF air flow
			socket.write("411013C9\r\r>");   // vibe
			break;

			case '0111\r':   // Throttle position
			//socket.write("NO DATA\r\r>");

			
			setTimeout(function () {
				var throttlePos = 128 + (sinzp * 127);
				var ithrottlePos = Math.round(throttlePos);
				var h = ("00" + ithrottlePos.toString(16)).substr(-2).toUpperCase();
				var throttlePosString = "4111" + h + "\r\r>";
				//socket.write("410c183B\r\r>");	
				socket.write(throttlePosString);	

			},100);
			

			//socket.write("41111C\r\r>");   // vibe
			break;

			case '0112\r':   // Commanded secondary air status
			socket.write("411202\r\r>");   // made up
			break;



			case '0113\r':   // Oxygen sensors present
			socket.write("411333\r\r>");   // taho
			break;


			case '0114\r':   // Oxygen sensors 
				socket.write("41141A82\r\r>");   // taho
				break;
			case '0115\r':   // Oxygen sensors 
				socket.write("411521FF\r\r>");   // taho
				break;
			case '0116\r':   // Oxygen sensors 
				socket.write("41141A82\r\r>");   // taho
				break;
			case '0117\r':   // Oxygen sensors 
				socket.write("41141A82\r\r>");   // taho
				break;
			case '0118\r':   // Oxygen sensors 
				socket.write("41182383\r\r>");   // taho
				break;
			case '0119\r':   // Oxygen sensors 
				socket.write("41192EFF\r\r>");   // taho
				break;
			case '011A\r':   // Oxygen sensors 
				socket.write("41141A82\r\r>");   // taho
				break;
			case '011B\r':   // Oxygen sensors 
				socket.write("41141A82\r\r>");   // taho
				break;



			case '011C\r':   // OBD standards this vehicle conforms to
				socket.write("411C01\r\r>");   // taho
				break;

			case '011D\r':   // o2 sensors present
				socket.write("411D55\r\r>");   // made up
				break;

			case '011E\r':   // Auxiliary input status
				socket.write("411E12\r\r>");   // made up
				break;


			case '011F\r':   // run time in seconds since start
				socket.write("411F0038\r\r>");   // made up
				break;



			////////////////  all of the supported pid calls /////////////////////////
			case '0100\r':
			console.log('protocol is ', protocol,'headerOn is ',headerOn);	
			if(  (protocol == 6) || (protocol == 0) ) {
				if (headerOn) {
					if(ecu == 0) {
						socket.write("7E8064100BE3EA813\r7E906410098188013\r\r>");
					}
					if(ecu == 0x7e8) {
						socket.write("7E8064100BE3EA813\\r\r>");

					}

					if(ecu == 0x7e9) {
						socket.write("7E906410098188013\r\r>");
						
					}

				} else {
					if(ecu==0) {
						socket.write("4100BE3EA813\r410098188013\r\r>");
					}


					if(ecu == 0x7e8) {
						//socket.write("4100BE3EA813\r\r>");   // original
						socket.write("4100FFFFFFFF\r\r>");     // original + ff on row 0

					}

					if(ecu == 0x7e9) {
						//socket.write("410098188013\r\r>");   // original
						socket.write("410098188013\r\r>");   // original + ff on row 0
					}
				}
			} else {
				socket.write("CAN ERROR\r\r>");
			}
			break;





			case '0120\r':
			/////////////////////////////////////////////////////////////////////////////////
			console.log('protocol is ', protocol,'header is ',headerOn);	
			if(  (protocol == 6) || (protocol == 0) ) {
				if (headerOn) {
					if(ecu == 0) {
						socket.write("7E8064120BE3EA813\r7E906412098188013\r\r>");
					}
					if(ecu == 0x7e8) {
						socket.write("7E8064120BE3EA813\\r\r>");

					}

					if(ecu == 0x7e9) {
						socket.write("7E906412098188013\r\r>");
						
					}

				} else {
					if(ecu==0) {
						socket.write("4120BE3EA813\r412098188013\r\r>");
					}


					if(ecu == 0x7e8) {
						//socket.write("4120BE3EA813\r\r>");

						socket.write("412000000000\r\r>");


					}

					if(ecu == 0x7e9) {
						socket.write("412098188013\r\r>");
					}
				}
			} else {
				socket.write("CAN ERROR\r\r>");
			}
			/////////////////////////////////////////////////////////////////////////////////
			break;



			case '0140\r':
				socket.write("CAN ERROR\r\r>");
			break;
			case '0160\r':
			case '0180\r':
			case '01A0\r':
			case '01C0\r':
			case '01E0\r':
				socket.write("CAN ERROR\r\r>");
			break;



			case '03\r':
				//socket.write("NO DATA\r\r>");

				//socket.write("43042000000000\r\r>");	

				socket.write("43000000000000\r\r>");	
				//socket.write("43011206830030\r43068306070000\r\r>");	
				//socket.write("43011206830030\r43068306070000\r\r>");	
				//socket.write("43011206830030\r43011206830030\r43068306070000\r\r>");	

				//socket.write("43042003221555\r\r>");	
			break;


			case '07\r':
				socket.write("NO DATA\r\r>");

				//socket.write("43042000000000\r\r>");	

				//socket.write("43000000000000\r\r>");	
				//socket.write("43011206830030\r43068306070000\r\r>");	
				//socket.write("43011206830030\r43068306070000\r\r>");	
				//socket.write("43011206830030\r43011206830030\r43068306070000\r\r>");	

				//socket.write("43042003221555\r\r>");	
			break;





			case '0900\r':
				socket.write("490054000000\r\r>");	
			break;


			case '0902\r':
				//socket.write("014\r0:490201314654\r1:53573231503237\r2:45413338343036\r\r>");	  // can style

				socket.write("49020100000031\r49020244344750\r49020330305235\r49020435423132\r49020533343536\r\r>");	//old j1850 style





			break;






			default:
				console.log("unknown:",noRstring);
				if(inString.startsWith('AT')) {
        			socket.write("OK\r\r>");

				} else {
					console.log('retting',noRstring2);	
        			socket.write(zOutString);
				}
        		break;

		}

    });
}).listen(35000);

