/* Declares the FM20 Audio Worklet Processor */

class FM20_AWP extends AudioWorkletGlobalScope.WAMProcessor
{
  constructor(options) {
    options = options || {}
    options.mod = AudioWorkletGlobalScope.WAM.FM20;
    super(options);
  }
}

registerProcessor("FM20", FM20_AWP);
