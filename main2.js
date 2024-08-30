let peerConnection;
let localStream;
let remoteStream;

let servers = {
  iceServers: [
    {
      urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302'],
    },
  ],
};

const videoError = (error) => {
  console.log('error', error);
};
const handleVideo = (stream) => {
  document.getElementById('user-1').srcObject = stream;
  localStream = stream;
};
let init = async () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { video: true, Audio: true },
      handleVideo,
      videoError
    );
  }
};

let createOffer = async () => {
  peerConnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();
  document.getElementById('user-2').srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById('offer-sdp').value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  document.getElementById('offer-sdp').value = JSON.stringify(offer);
};

let createAnswers = async () => {
  peerConnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();
  document.getElementById('user-2').srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById('answer-sdp').value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };
  let offer = document.getElementById('offer-sdp').value;
  if (!offer) return alert('Retrieve offer from peer first ');

  console.log(offer);
  offer = JSON.parse(offer);
  console.log(offer);
  await peerConnection.setRemoteDescription(offer);
  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  document.getElementById('answer-sdp').value = JSON.stringify(answer);
};


let addAnswer = async ()=>{
    let answer = document.getElementById('answer-sdp').value
    if(!answer) return alert ('Retrieve offer peer first.....')

    answer =JSON.parse(answer)
    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }
}
init();

document.getElementById('create-offer').addEventListener('click', createOffer);
document.getElementById('create-answer').addEventListener('click', createAnswers);
document.getElementById('add-answer').addEventListener('click',addAnswer)