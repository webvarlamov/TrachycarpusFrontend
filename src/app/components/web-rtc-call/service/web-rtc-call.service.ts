// import {Injectable} from '@angular/core';
// import {HasSubscriptions} from "../../../model/common/has-subscriptions";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class WebRtcCallService extends HasSubscriptions {
//   public offerOptions = {
//     offerToReceiveAudio: 1,
//     offerToReceiveVideo: 1
//   };
//
//   private startTime: number;
//
//   private localVideo: HTMLVideoElement;
//   private remoteVideo: HTMLVideoElement;
//
//   private pc1: RTCPeerConnection;
//   private pc2: RTCPeerConnection;
//
//   private localStream: MediaStream;
//
//   constructor() {
//     super();
//   }
//
//   private init(): void {
//     this.localVideo = document.getElementById('local-video') as HTMLVideoElement;
//     this.localVideo.addEventListener('loadedmetadata', function () {
//       console.log(`Local video init`);
//     });
//
//     this.remoteVideo = document.getElementById('remote-video') as HTMLVideoElement;
//     this.remoteVideo.addEventListener('loadedmetadata', function () {
//       console.log(`Remote video init`);
//     });
//
//   }
//
//   public async start(): Promise<void> {
//     this.init()
//
//     console.log('Requesting local stream');
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
//       console.log('Received local stream');
//       this.localVideo.srcObject = stream;
//       this.localStream = stream;
//     } catch (err) {
//       alert(`getUserMedia() error: ${err.name}`);
//     }
//   }
//
//   public async call(): Promise<void> {
//     console.log('Starting call');
//     this.startTime = window.performance.now();
//
//     const configuration = {};
//
//     console.log('Created local peer connection object pc1');
//     console.log('RTCPeerConnection configuration:', configuration);
//     this.pc1 = new RTCPeerConnection(configuration);
//     this.pc1.addEventListener('icecandidate', e => this.onIceCandidate(this.pc1, e));
//     this.pc1.addEventListener('iceconnectionstatechange', e => this.onIceStateChange(this.pc1, e));
//
//     console.log('Created remote peer connection object pc2');
//     this.pc2 = new RTCPeerConnection(configuration);
//     this.pc2.addEventListener('icecandidate', e => this.onIceCandidate(this.pc2, e));
//     this.pc2.addEventListener('iceconnectionstatechange', e => this.onIceStateChange(this.pc2, e));
//     this.pc2.addEventListener('track', this.gotRemoteStream);
//
//     this.localStream.getTracks().forEach(track => this.pc1.addTrack(track, this.localStream));
//     console.log('Added local stream to pc1');
//
//     try {
//       console.log('pc1 createOffer start');
//       // @ts-ignore
//       const offer = await this.pc1.createOffer(this.offerOptions);
//       await this.onCreateOfferSuccess(offer);
//     } catch (e) {
//       this.onCreateSessionDescriptionError(e);
//     }
//   }
//
//   public onCreateSessionDescriptionError(error: any) {
//     console.log(`Failed to create session description: ${error.toString()}`);
//   }
//
//   public async onCreateOfferSuccess(desc: any) {
//     console.log(`Offer from pc1\n${desc.sdp}`);
//     console.log('pc1 setLocalDescription start');
//     try {
//       await this.pc1.setLocalDescription(desc);
//       this.onSetLocalSuccess(this.pc1);
//     } catch (e) {
//       this.onSetSessionDescriptionError(e);
//     }
//
//     console.log('pc2 setRemoteDescription start');
//     try {
//       await this.pc2.setRemoteDescription(desc);
//       this.onSetRemoteSuccess(this.pc2);
//     } catch (e) {
//       this.onSetSessionDescriptionError(e);
//     }
//
//     console.log('pc2 createAnswer start');
//
//     try {
//       const answer = await this.pc2.createAnswer();
//       await this.onCreateAnswerSuccess(answer);
//     } catch (e) {
//       this.onCreateSessionDescriptionError(e);
//     }
//   }
//
//   public onSetLocalSuccess(pc: any) {
//     console.log(`${this.getName(pc)} setLocalDescription complete`);
//   }
//
//   public onSetRemoteSuccess(pc: any) {
//     console.log(`${this.getName(pc)} setRemoteDescription complete`);
//   }
//
//   public onSetSessionDescriptionError(error: any) {
//     console.log(`Failed to set session description: ${error.toString()}`);
//   }
//
//   public gotRemoteStream = (e: any) => {
//     if (this.remoteVideo.srcObject !== e.streams[0]) {
//       this.remoteVideo.srcObject = e.streams[0];
//       console.log('pc2 received remote stream');
//     }
//   }
//
//   public async onCreateAnswerSuccess(desc: any) {
//     console.log(`Answer from pc2:\n${desc.sdp}`);
//     console.log('pc2 setLocalDescription start');
//     try {
//       await this.pc2.setLocalDescription(desc);
//       this.onSetLocalSuccess(this.pc2);
//     } catch (e) {
//       this.onSetSessionDescriptionError(e);
//     }
//     console.log('pc1 setRemoteDescription start');
//     try {
//       await this.pc1.setRemoteDescription(desc);
//       this.onSetRemoteSuccess(this.pc1);
//     } catch (e) {
//       this.onSetSessionDescriptionError(e);
//     }
//   }
//
//   public async onIceCandidate(pc: any, event: any) {
//     try {
//       await (this.getOtherPc(pc).addIceCandidate(event.candidate));
//       this.onAddIceCandidateSuccess(pc);
//     } catch (e) {
//       this.onAddIceCandidateError(pc, e);
//     }
//     console.log(`${this.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
//   }
//
//   public onAddIceCandidateSuccess(pc: any) {
//     console.log(`${this.getName(pc)} addIceCandidate success`);
//   }
//
//   public onAddIceCandidateError(pc: any, error: any) {
//     console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
//   }
//
//   public onIceStateChange(pc: any, event: any) {
//     if (pc) {
//       console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
//       console.log('ICE state change event: ', event);
//     }
//   }
//
//   public hangup() {
//     console.log('Ending call');
//     this.pc1.close();
//     this.pc2.close();
//     this.pc1 = null;
//     this.pc2 = null;
//   }
//
//   public getName(pc: any) {
//     return (pc === this.pc1) ? 'pc1' : 'pc2';
//   }
//
//   public getOtherPc(pc: any) {
//     return (pc === this.pc1) ? this.pc2 : this.pc1;
//   }
// }
