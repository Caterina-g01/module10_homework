document.addEventListener("DOMContentLoaded", function () {
	const exerciseLinks = document.querySelectorAll(".nav-link");
	const exercises = document.querySelectorAll(".exercise-block");
	const button = document.querySelector(".exercise-one__btn");
	const icon1 = document.querySelector(".first-icon");
	const icon2 = document.querySelector(".second-icon");
	const button2 = document.querySelector(".exercise-two__btn");
	const wsUrl = "wss://echo-ws-service.herokuapp.com/";
	const sendBtn = document.querySelector(".send-btn");
	const input = document.getElementById("input");
	const locationBtn = document.querySelector(".geo-btn");
	const chatWindow = document.getElementById("chatWindow");
	const blocks = document.querySelectorAll(".exercise-block");

let websocket;

function scrollToBottom(element) {
	element.scrollTop = element.scrollHeight;
}

function writeToChat(message, isUser) {
	let messageContainer = document.createElement("div");
	messageContainer.textContent = message;
	messageContainer.classList.add(isUser ? "user-input" : "server-output");
	messageContainer.style.display = "block";
	chatWindow.appendChild(messageContainer);

	scrollToBottom(chatWindow);
}

sendBtn.addEventListener("click", () => {
const message = input.value;
if (message !== "") {
	websocket = new WebSocket(wsUrl);

	websocket.onopen = function () {
		writeToChat(message, true);
		websocket.send(message);
		input.value = "";
	};

	websocket.onmessage = function (evt) {
		writeToChat(evt.data);
	};

	websocket.onerror = function () {
		writeToChat(error);
		console.log("Упс, ошибка");
	};
}
});

const error = () => {
	let errorMessage = document.createElement("div");
	errorMessage.textContent = "нет возможности получить текущее местоположение";
	errorMessage.classList.add("user-input");
	errorMessage.style.display = "block";
	chatWindow.appendChild(errorMessage);
	scrollToBottom(chatWindow);
}

const success = (position) => {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;

	let locationMessage = document.createElement('div');
	locationMessage.innerHTML = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">ваша геолокация</a>`;
	locationMessage.style.display = 'block';
	locationMessage.classList.add('user-input');
	chatWindow.appendChild(locationMessage);

	scrollToBottom(chatWindow);
}

locationBtn.addEventListener("click", () => {
	if (!navigator.geolocation) {
		let errorMessage = document.createElement("div");
		errorMessage.textContent = "геолокация не поддерживается вашим браузером";
		errorMessage.style.display = "block";
		errorMessage.classList.add("server-output");
		chatWindow.appendChild(errorMessage);

		scrollToBottom(chatWindow);
	} else {
		let locationInfo = document.createElement("div");
		locationInfo.textContent = "секунду...";
		locationInfo.style.display = "block";
		locationInfo.classList.add("user-input");
		chatWindow.appendChild(locationInfo);
		navigator.geolocation.getCurrentPosition(success, error);

		scrollToBottom(chatWindow);
	}
});

	exerciseLinks.forEach((link, index) => {
		link.addEventListener("click", function () {
			exercises[index].scrollIntoView({ behavior: "smooth" });
			exerciseLinks.forEach(link => link.classList.remove("active"));
			link.classList.add("active");
			exercises.forEach(exercise => exercise.classList.remove("active"));
			exercises[index].classList.add("active");
		});
	});

	blocks.forEach((block, index) => {
		block.addEventListener("click", function () {
			exercises.forEach(exercise => exercise.classList.remove("active"));
			exercises[index].classList.add("active");
		});
	});

	button.addEventListener("click", function () {
		if (icon1.style.display === "none") {
			icon1.style.display = "inline-block";
			icon2.style.display = "none";
		} else {
			icon1.style.display = "none";
			icon2.style.display = "inline-block";
		}
	});

	button2.addEventListener("click", function () {
		const width = window.innerWidth;
		const height = window.innerHeight;
		alert(`Размеры окна браузера без учёта полосы прокрутки ${width}px - по ширине, ${height}px - по высоте`);
	});
});
