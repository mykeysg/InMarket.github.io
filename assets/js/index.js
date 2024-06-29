/* Registro de Service Worker */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log("Service Worker registrado con éxito:", registration);
      })
      .catch((error) => {
        console.error("Fallo al registrar el Service Worker:", error);
      });
  });
}

/* Implemetacion de Api -------------------------------------------- */

/* Cotizacion de Criptos */
const form = document.querySelector("#form-search");
const moneda = document.querySelector("#moneda");
const criptomoneda = document.querySelector("#criptomonedas");
const formContainer = document.querySelector(".form-side");
const containerAnswer = document.querySelector(".container-answer");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptos();

  form.addEventListener("submit", submitForm);
  moneda.addEventListener("change", getValue);
  criptomoneda.addEventListener("change", getValue);
});

function submitForm(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = objBusqueda;
  if (moneda === "" || criptomoneda === "") {
    showError("Seleccione ambas monedas...");
    return;
  }
  consultarAPI(moneda, criptomoneda);
  //console.log(moneda);
  //console.log(criptomoneda);
}

function consultarAPI(moneda, criptomoneda) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  fetch(url)
    .then((resultado) => resultado.json())
    .then((resultadoJson) => {
      mostrarCotizacion(resultadoJson.DISPLAY[criptomoneda][moneda]);
      //console.log(resultadoJson.DISPLAY[criptomoneda][moneda]);
    })
    .catch((error) => console.log(error));
}

function mostrarCotizacion(data) {
  clearHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = data;
  const answer = document.createElement("div");
  answer.classList.add("display-info");
  answer.innerHTML = `
        <p class="main-price">Precio: <span>${PRICE}</span></p>
        <p>Precio más alto del día:: <span>${HIGHDAY}</span></p>
        <p>Precio más bajo del día: <span>${LOWDAY}</span></p>
        <p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
        <p>Última Actualización: <span>${LASTUPDATE}</span></p>
    `;
  containerAnswer.appendChild(answer);
}

function showError(mensage) {
  const error = document.createElement("p");
  error.classList.add("error");
  error.textContent = mensage;
  formContainer.appendChild(error);
  setTimeout(() => error.remove(), 3000);
}

function getValue(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function consultarCriptos() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((respuestaJson) => {
      selectCriptos(respuestaJson.Data);
      //console.log(respuestaJson.Data);
    })
    .catch((error) => console.log(error));
}

function selectCriptos(criptos) {
  criptos.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomoneda.appendChild(option);
  });
}

function clearHTML() {
  containerAnswer.innerHTML = "";
}

/* Implementacion de Todas Las criptos */

let cryptoData = [];
let ordenActual = "predeterminado";

fetch("https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD")
  .then((response) => {
    if (!response.ok) {
      throw new Error("La respuesta de la red no fue exitosa");
    }
    return response.json();
  })
  .then((data) => {
    cryptoData = data.Data;
    mostrarCriptomonedas();
  })
  .catch((error) => {
    console.error("Hubo un problema con la solicitud:", error);
  });

/* Implementacion en el Index */
fetch("https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD")
  .then((response) => {
    if (!response.ok) {
      throw new Error("La respuesta de la red no fue exitosa");
    }
    return response.json();
  })
  .then((data) => {
    cryptoData = data.Data;
    mostrarCriptomonedasi();
  })
  .catch((error) => {
    console.error("Hubo un problema con la solicitud:", error);
  });

/* Mostrar Todas las Criptos */
function mostrarCriptomonedas() {
  const cryptoContainer = document.getElementById("cryptoContainer");
  cryptoContainer.innerHTML = "";

  cryptoData.forEach((coin) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
        <div class="card h-100 bg-oscuro p-3 text-light">
          <div class="card-body">
            <img src="./assets/img/c-5.png" class="card-img mb-5 w-25" alt="icon" />
            <h5 class="card-title">${coin.CoinInfo.FullName} (${coin.CoinInfo.Name})</h5>
            <p class="card-text">Precio: ${coin.RAW.USD.PRICE}</p>
            <p class="card-text">Capitalización de mercado: ${coin.RAW.USD.MKTCAP}</p>
            <p class="card-text">Volumen (24h): ${coin.RAW.USD.VOLUME24HOUR}</p>
          </div>
        </div>
      `;
    cryptoContainer.appendChild(card);
  });
}

/* Mostrar solo 4 Criptos */
function mostrarCriptomonedasi() {
  const cryptoContaineri = document.getElementById("cryptoContaineri");
  cryptoContaineri.innerHTML = "";

  cryptoData.slice(0, 4).forEach((coin) => {
    const card = document.createElement("div");
    card.className = "col-md-6 mb-3";
    card.innerHTML = `
      <div class="card w-100 bg-oscuro p-3 text-light">
        <a href="./criptomonedas.html#criptos" class="text-decoration-none text-light">
          <div class="card-body">
            <img src="./assets/img/c-5.png" class="card-img mb-2 w-25" alt="icon" />
            <h5 class="card-title">${coin.CoinInfo.FullName} (${coin.CoinInfo.Name})</h5>
            <p class="card-text">Precio: ${coin.RAW.USD.PRICE}</p>
            <p class="card-text">Capitalización de mercado: ${coin.RAW.USD.MKTCAP}</p>
          </div>
        </a>
      </div>
    `;
    cryptoContaineri.appendChild(card);
  });
}

/* Funcion para ordenar por Mayor Valor y Nombre */
function ordenar(tipo) {
  if (tipo === "valor") {
    if (ordenActual === "valor") {
      cryptoData.reverse();
    } else {
      cryptoData.sort((a, b) => b.RAW.USD.PRICE - a.RAW.USD.PRICE);
      ordenActual = "valor";
    }
  } else if (tipo === "nombre") {
    if (ordenActual === "nombre") {
      cryptoData.reverse();
    } else {
      cryptoData.sort((a, b) =>
        a.CoinInfo.FullName.localeCompare(b.CoinInfo.FullName)
      );
      ordenActual = "nombre";
    }
  }

  mostrarCriptomonedas();
}

/* notificacion offline------ */
// Solicitar permiso para enviar notificaciones
function askNotificationPermission() {
  if (!("Notification" in window)) {
      console.log("Este navegador no soporta notificaciones de escritorio.");
  } else if (Notification.permission === "granted") {
      // Si ya se ha otorgado permiso, podemos enviar una notificación
      showExampleNotification();
  } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
          if (permission === "granted") {
              showExampleNotification();
          }
      });
  }
}

// Mostrar una notificación de ejemplo
function showExampleNotification() {
  const options = {
      body: "Gracias por permitir notificaciones!",
      icon: "./assets/img/icons/icon-192x192.png"
  };
  new Notification("Notificación de InMarket", options);
}

// Función para mostrar la notificación
function showNotification(message, status) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  notificationMessage.textContent = message;
  
  // Establecer el color de fondo según el estado
  if (status === 'online') {
      notification.classList.remove('offline');
      notification.classList.add('online');
  } else if (status === 'offline') {
      notification.classList.remove('online');
      notification.classList.add('offline');
  }

  notification.classList.remove('hide');
  notification.classList.add('show');
  
  // Ocultar la notificación después de 5 segundos
  setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hide');
  }, 5000);
}

// Función para cerrar la notificación manualmente
function closeNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('show');
  notification.classList.add('hide');
}

// Función para mostrar una notificación del sistema
function showSystemNotification(title, options) {
  if (Notification.permission === "granted") {
      new Notification(title, options);
  }
}

// Escuchar eventos de cambio de conexión
window.addEventListener('online', () => {
  showNotification('Estás en línea', 'online');
  showSystemNotification("Conexión Establecida", {
      body: "Has vuelto a estar en línea.",
      icon: "./assets/img/icons/icon-192x192.png"
  });
});

window.addEventListener('offline', () => {
  showNotification('Estás sin conexión', 'offline');
  showSystemNotification("Conexión Perdida", {
      body: "Estás sin conexión a internet.",
      icon: "./assets/img/icons/icon-192x192.png"
  });
});

// Verificar el estado de conexión inicialmente al cargar la página
window.addEventListener('load', () => {
  if (navigator.onLine) {
      showNotification('Estás en línea', 'online');
  } else {
      showNotification('Estás sin conexión', 'offline');
  }
  askNotificationPermission();
});

/* Compartir pagina------------- */

// Función para compartir contenido
document.addEventListener('DOMContentLoaded', function() {
  const shareButton = document.getElementById('shareButton');
  const siteName = 'CriptoNews'; // Nombre ficticio del sitio

  shareButton.addEventListener('click', async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'Título del Contenido',
                  text: `Publicitando este sitio de criptomonedas: ${siteName}. Este es el contenido que queremos compartir.`,
                  url: window.location.href
              });
              console.log('Contenido compartido con éxito');
          } catch (error) {
              console.error('Error al compartir:', error);
          }
      } else {
          alert('La API de Web Share no es compatible con este navegador');
      }
  });
});
