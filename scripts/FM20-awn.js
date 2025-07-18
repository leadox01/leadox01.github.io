/* Declares the FM20 Audio Worklet Node */

class FM20Controller extends WAMController
{
  constructor (actx, options) {
    options = options || {};
    if (options.numberOfInputs === undefined)       options.numberOfInputs = 0;
    if (options.numberOfOutputs === undefined)      options.numberOfOutputs = 1;
    if (options.outputChannelCount === undefined)   options.outputChannelCount = [2];
    if (options.processorOptions.inputChannelCount === undefined) options.processorOptions = {inputChannelCount:[]};

    options.buflenSPN = 1024;
    super(actx, "FM20", options);
  }

  static importScripts (actx) {
    var origin = "https://leadox01.github.io/";

    return new Promise( (resolve) => {
      actx.audioWorklet.addModule(origin + "scripts/FM20-wam.js").then(() => {
      actx.audioWorklet.addModule(origin + "scripts/wam-processor.js").then(() => {
      actx.audioWorklet.addModule(origin + "scripts/FM20-awp.js").then(() => {
        resolve();
      }) }) });
    })
  }

  onmessage(msg) {
    //Received the WAM descriptor from the processor - could create an HTML UI here, based on descriptor
    if(msg.type == "descriptor") {
      console.log("got WAM descriptor...");
    }

    //Send Parameter Value From Delegate
    if(msg.verb == "SPVFD") {
      Module.SPVFD(parseInt(msg.prop), parseFloat(msg.data));
    }
    //Set Control Value From Delegate
    else if(msg.verb == "SCVFD") {
      Module.SCVFD(parseInt(msg.prop), parseFloat(msg.data));
    }
    //Send Control Message From Delegate
    else if(msg.verb == "SCMFD") {
      var res = msg.prop.split(":");
      var data = new Uint8Array(msg.data);
      const buffer = Module._malloc(data.length);
      Module.HEAPU8.set(data, buffer);
      Module.SCMFD(parseInt(res[0]), parseInt(res[1]), data.length, buffer);
      Module._free(buffer);
    }
    //Send Arbitrary Message From Delegate
    else if(msg.verb == "SAMFD") {
      var data = new Uint8Array(msg.data);
      const buffer = Module._malloc(data.length);
      Module.HEAPU8.set(data, buffer);
      Module.SAMFD(parseInt(msg.prop), data.length, buffer);
      Module._free(buffer);
    }
    //Send MIDI Message From Delegate
    else if(msg.verb == "SMMFD") {
      var res = msg.prop.split(":");
      Module.SMMFD(parseInt(res[0]), parseInt(res[1]), parseInt(res[2]));
    }
    //Send Sysex Message From Delegate
    else if(msg.verb == "SSMFD") {
      var data = new Uint8Array(msg.data);
      const buffer = Module._malloc(data.length);
      Module.HEAPU8.set(data, buffer);
      Module.SSMFD(parseInt(msg.prop), data.length, buffer);
      Module._free(buffer);
    }
    else if(msg.verb == "StartIdleTimer") {
      Module.StartIdleTimer();
    }

  }
}
