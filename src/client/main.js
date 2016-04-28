var user = 'Klara';

var socket = io('http://localhost:4000');

var $users = $('#users');

socket.on('connect', function () {
	$('.username').text(user);
	$('.user').show();

	socket.emit('username', user)
});

socket.on('list', function (data) {
	console.log('User list: ', data);
/*
	$users.empty();

	$(data.users).each(function (index) {
		if (this.online) {
			$users.append('<li data-room="' + this.room + '"><b>' + this.name + '</b><br>Tittar på: ' + this.watching.title + '</li>');
		}
	});
*/
});

socket.on('chat', function (data) {
	showChatMessage(data);
});

$users.on('click', 'li', function () {
	var room = $(this).data('room');

	switchRoom(room);
});

$('.friends-button').click(function (event) {
	event.preventDefault();

	toggleMenu();
});

$('.user').click(function () {
	var name = prompt('What’s your name?');

	$('.username').text(name);

	socket.emit('username', name);
});

$('.chat-button').click(function () {
	var message = prompt('Chat');

	if (message) {
		socket.emit('write', message);
	}
});

function switchRoom(room) {
	console.log('Trying to join room', room);

	socket.emit('join-room', {
		id: room
	});

	changeView('video');
	toggleMenu();

	playVideo();
}

function changeView(view) {
	$('.page.active').removeClass('active');
	$('#page-' + view).addClass('active');
}

function toggleMenu() {
	$('body').toggleClass('menu-open');
}

function showChatMessage(data) {
	var bubble = $('<div class="chat-message"><b>' + data.from + ':</b><br>' + data.message + '</div>');

	$('.chat').prepend(bubble);

	setTimeout(function () {
		bubble.fadeOut(function () {
			bubble.remove();
		});
	}, 5000);
}

function playVideo() {
	var videoId = '1372168-001A';

	console.log('trying to start video');

	if (window.SVP) {
		console.log('SVP found');

		SVP.config({
			useAltDashUrl: false,
			useAltHlsUrl: false,
			splash: false,
			theme: 'standard'
		});

		var element = document.getElementById('videoplayer'),
			videoElement = element.getElementsByTagName('video')[0];

		videoElement.setAttribute('preload', 'auto'),
		videoElement.setAttribute('autoplay', ''),
		videoElement.setAttribute('data-video-reduced-bandwidth', 'true'),
		videoElement.setAttribute('data-video-controls', '')
		videoElement.setAttribute('data-video-id', videoId);

		// if(poster) {
		// 	videoElement.setAttribute('poster', poster);
		// }

		// var videoLength = document.getElementById('lengthInput').value;
		// if (videoLength !== undefined) {
		// 	videoElement.setAttribute('data-video-length', videoLength);
		// }

		var position = 600;
		if (position) {
			videoElement.setAttribute('data-video-startposition', position);
		}

		if (element.state && element.state()) {
			console.log('Change video to ' + videoId);
			element.load(videoId);
		} else {
			console.log('Init player with video ' + videoId);
			window.SVP(element);
		}
	}
}
