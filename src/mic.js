const processAudioStream = (stream, cb) => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);

  javascriptNode.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    const { length } = array;
    for (let i = 0; i < length; i += 1) {
      values += (array[i]);
    }

    const average = values / length;
    if (cb) {
      cb(average);
    }
  };
};

export default async function getMedia(cb = null) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    processAudioStream(stream, cb);
  } catch (err) {
    console.log(err);
  }
}
