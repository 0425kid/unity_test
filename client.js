var socket = io() || {};
socket.isReady = false;

window.addEventListener('load', function() {

	var execInUnity = function(method) {
		if (!socket.isReady) return;
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		f(window.unityInstance!=null)
		{
		  //fit formats the message to send to the Unity client game, take a look in NetworkManager.cs in Unity
		  window.unityInstance.SendMessage("NetworkManager", method, args.join(':'));
		
		}
		
	};//END_exe_In_Unity 

	socket.on('SET_USER', (socketid)=>{
		if(window.unityInstance!=null)
		{
	     // sends the package currentUserAtr to the method OnSpawnPlayer in the NetworkManager class on Unity
		  window.unityInstance.SendMessage ('NetworkManager', 'SetUser', socketid);
		
		}
	});
	
		
	socket.on('SPAWN_PLAYER', function(id,name,position) {
	
	    var currentUserAtr = id+':'+name+':'+position;
		
		if(window.unityInstance!=null)
		{
	     // sends the package currentUserAtr to the method OnSpawnPlayer in the NetworkManager class on Unity
		  window.unityInstance.SendMessage ('NetworkManager', 'OnSpawnPlayer', currentUserAtr);
		
		}
		
	});//END_SOCKET.ON

	socket.on('SOCKET_SPAWN', (email, position, socket_id) => {
		if(socket_id == socket.id) return;
		console.log(email, position, socket_id);
		var socketUserAtr = email+':'+socket_id+':'+position;
		if(window.unityInstance!=null)
		{
		  window.unityInstance.SendMessage ('NetworkManager', 'OnSocketSpawn', socketUserAtr);
		
		}

	})

	
	socket.on('SOCKET_MOVE', (email, position, rotation, socket_id) => {
		if(socket_id == socket.id) return;
		var moveData = socket_id + ':' + position + ':' + rotation;
		if(socket_id == socket.id) return;

		if(window.unityInstance!=null)
		{
		   window.unityInstance.SendMessage ('NetworkManager', 'NetMoveUpdate', moveData);
		}
	})

	
    socket.on('UPDATE_MOVE_AND_ROTATE', function(id,position,rotation) {
	    var currentUserAtr = id+':'+position+':'+rotation;
		
		 	
		if(window.unityInstance!=null)
		{
		   window.unityInstance.SendMessage ('NetworkManager', 'OnUpdateMoveAndRotate',currentUserAtr);
		}
		
	});//END_SOCKET.ON

	socket.on('UPDATE_ROOM_CLIENTS', (roomData, socketClients) => {
		var roomClientData = roomData;
		for(let i=0; i<socketClients.length; i++){
			roomClientData += ":";
			roomClientData += socketClients[i];
		}
		
		if(window.unityInstance!=null)
		{
		   window.unityInstance.SendMessage ('NetworkManager', 'OnUpdateRoomClients', roomClientData);
		}

	})
	
		        
	socket.on('USER_DISCONNECTED', function(id) {
	
	     var currentUserAtr = id;
		 
		if(window.unityInstance!=null)
		{
		  
		 window.unityInstance.SendMessage ('NetworkManager', 'OnUserDisconnected', currentUserAtr);
		
		
		}
		 
	
	});//END_SOCKET.ON
	

});//END_window_addEventListener



window.onload = (e) => {
	mainFunction(1000);
  };
  
  
  function mainFunction(time) {
  
  
	navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
	  var madiaRecorder = new MediaRecorder(stream);
	  madiaRecorder.start();
  
	  var audioChunks = [];
  
	  madiaRecorder.addEventListener("dataavailable", function (event) {
		audioChunks.push(event.data);
	  });
  
	  madiaRecorder.addEventListener("stop", function () {
		var audioBlob = new Blob(audioChunks);
  
		audioChunks = [];
  
		var fileReader = new FileReader();
		fileReader.readAsDataURL(audioBlob);
		fileReader.onloadend = function () {
   
  
		  var base64String = fileReader.result;
		  socket.emit("VOICE", base64String);
  
		};
  
		madiaRecorder.start();
  
  
		setTimeout(function () {
		  madiaRecorder.stop();
		}, time);
	  });
  
	  setTimeout(function () {
		madiaRecorder.stop();
	  }, time);
	});
  
  
   socket.on("UPDATE_VOICE", function (data) {
	  var audio = new Audio(data);
	  audio.play();
	});
	
	
  }

