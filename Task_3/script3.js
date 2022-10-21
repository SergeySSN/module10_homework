/*
1.Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:


2.Добавить в чат механизм отправки гео-локации:
При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат 
вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. 
Сообщение, которое отправит обратно эхо-сервер, не выводить.

*/

//const wsUri = "wss://ws.postman-echo.com"
const wsUri = "wss://ws.ifelse.io"
//const wsUri = "wss://echo-ws-service.herokuapp.com"

const input = document.getElementById ('input')
const btnSend = document.getElementById('btn_send')
const btnGeo = document.getElementById ('btn_geo')
const bodyChat = document.getElementById ('body_chat')

let websocket;


//Функция, выводящая сообщения в чат
function writeToScreen(message, x = "flex-end") {
   let mes = document.createElement("div");
   mes.style.display = "inline-block";
   mes.style.padding = '5px';
   mes.style.border = "2px solid #315efb";
   mes.style.borderRadius = '5px';
   mes.style.margin = '5px';
   mes.style.backgroundColor = '#c3e7f2';
   mes.style.alignSelf = x;
   mes.innerText = message;
   bodyChat.appendChild(mes);
  }

//Обработчик кнопки "Отправить"
btnSend.addEventListener('click', () => {
    messageSend = input.value;
    console.log (messageSend);
    writeToScreen(messageSend, 'flex-start');
    
    websocket = new WebSocket(wsUri);
    
    websocket.onopen = function(evt) {
        console.log ("CONNECTED");
        writeToScreen ("CONNECTED");
    };

    websocket.onmessage = function(evt) {
        console.log ("Waiting responce...");
        writeToScreen('Server response : ' + evt.data);
      };
      websocket.onerror = function(evt) {
        console.log ("Failure!")
        writeToScreen(evt.data);
      };
      websocket.onclose = function(evt) {
        console.log ("DISCONNECTED");
        writeToScreen("DISCONNECTED");
      };

    })
  
  // Функция, срабатывающая при успешном получении геолокации
    const success = (position) => {
    console.log('position', position);
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    mesGeo = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude} `;
    mesText = `Геопозиция : широта: ${latitude} °, долгота: ${longitude} °  `;
    
    writeToScreen(mesText, 'center');
   
    const lastMessage = bodyChat.lastElementChild;
    const a = document.createElement ('a');
    a.setAttribute('href', mesGeo);
    a.innerText = 'Перейти по ссылке в карту';
    lastMessage.insertAdjacentElement ('beforeend', a);

  }

// Функция, выводящая текст об ошибке при получении геолокации
  const error = () => {
  writeToScreen('Невозможно получить ваше местоположение');
}

//Обработчик кнопки "Геолокация"
  btnGeo.addEventListener('click', () => {
  
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        console.log ("CONNECTED");
        writeToScreen ("CONNECTED");
    };
    //Ответ сервера не показываем
    websocket.onmessage = function(evt) {
        console.log ("Waiting responce...");
        writeToScreen('Waiting responce...');
      };

    if (!navigator.geolocation) {
        writeToScreen ('Geolocation не поддерживается вашим браузером');
    } else {
        writeToScreen ('Определение местоположения…');
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });