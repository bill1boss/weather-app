// ==========================================================================
// WEATHER APP - JAVASCRIPT LOGIC WITH DETAILED EXPLANATIONS
// ==========================================================================

// 1. ΡΥΘΜΙΣΕΙΣ API (OpenWeatherMap)
// Το apiKey είναι το μοναδικό αναγνωριστικό για να μας επιτρέψει η υπηρεσία να πάρουμε δεδομένα
const apiKey = "8d8b9e4a3b8d1a2c3d4e5f6a7b8c9d0e"; 

// Το βασικό URL της OpenWeatherMap. Παράμετροι:
// units=metric: Επιστρέφει θερμοκρασίες σε Celsius (C)
// lang=el: Επιστρέφει τις περιγραφές καιρού στα Ελληνικά
// q=: Περιμένει το όνομα της πόλης στο τέλος
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=el&q=";

// 2. ΕΠΙΛΟΓΗ ΣΤΟΙΧΕΙΩΝ DOM (Document Object Model)
// Συνδέουμε τις μεταβλητές της JavaScript με τα HTML عناصر μέσω των id τους
const cityInput = document.getElementById("city-input");      // Το πεδίο που πληκτρολογεί ο χρήστης
const searchBtn = document.getElementById("search-btn");      // Το κουμπί αναζήτησης

const weatherInfo = document.getElementById("weather-info");  // Το container των αποτελεσμάτων
const cityName = document.getElementById("city-name");        // Το σημείο για το όνομα της πόλης
const temperature = document.getElementById("temperature");  // Το σημείο για τη θερμοκρασία
const description = document.getElementById("description");  // Το σημείο για την περιγραφή καιρού
const humidity = document.getElementById("humidity");        // Το σημείο για την υγρασία
const wind = document.getElementById("wind");                // Το σημείο για τον άνεμο

const errorMessage = document.getElementById("error-message");// Το σημείο για μηνύματα σφάλματος

// 3. ΑΣΥΓΧΡΟΝΗ ΣΥΝΑΡΤΗΣΗ ΑΝΤΛΗΣΗΣ ΔΕΔΟΜΕΝΩΝ (Async/Await)
// Χρησιμοποιούμε async επειδή η αίτηση στο διαδίκτυο παίρνει κάποιο χρόνο μέχρι να επιστρέψει απάντηση
async function checkWeather(city) {
  
  // Αν ο χρήστης δεν πληκτρολόγησε τίποτα (ή έβαλε μόνο κενά), σταματάμε την εκτέλεση
  if (!city.trim()) return;

  try {
    // Η fetch() στέλνει το αίτημα στο API. Η await περιμένει να ληφθεί η απάντηση πριν συνεχίσει
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    // Αν η πόλη δεν βρεθεί, το API επιστρέφει HTTP Status 404
    if (response.status === 404) {
      showError("Η πόλη δεν βρέθηκε. Παρακαλώ δοκιμάστε ξανά.");
      return;
    }

    // Μετατρέπουμε την ακατέργαστη απάντηση σε αντικείμενο JSON
    const data = await response.json();

    // Ενημερώνουμε τα κείμενα στην HTML σελίδα με τα πραγματικά δεδομένα από το API
    cityName.textContent = data.name + ", " + data.sys.country;  // Π.χ. "Athens, GR"
    temperature.textContent = Math.round(data.main.temp);         // Στρογγυλοποίηση θερμοκρασίας
    description.textContent = data.weather[0].description;       // Π.χ. "καθαρός ουρανός"
    humidity.textContent = data.main.humidity + "%";              // Π.χ. "65%"
    wind.textContent = Math.round(data.wind.speed * 3.6) + " km/h"; // Μετατροπή m/s σε km/h

    // Αφαιρούμε την κλάση "hidden" για να εμφανιστεί η κάρτα αποτελεσμάτων
    weatherInfo.classList.remove("hidden");
    
    // Κρύβουμε τυχόν προηγούμενο μήνυμα σφάλματος
    errorMessage.classList.add("hidden");

  } catch (error) {
    // Αν κοπεί το ίντερνετ ή υπάρξει άλλο τεχνικό πρόβλημα
    showError("Προέκυψε σφάλμα κατά τη σύνδεση. Ελέγξτε τη σύνδεσή σας.");
  }
}

// 4. ΒΟΗΘΗΤΙΚΗ ΣΥΝΑΡΤΗΣΗ ΕΜΦΑΝΙΣΗΣ ΣΦΑΛΜΑΤΩΝ
function showError(msg) {
  errorMessage.textContent = msg;           // Βάζουμε το κείμενο σφάλματος
  errorMessage.classList.remove("hidden");  // Εμφανίζουμε το μήνυμα
  weatherInfo.classList.add("hidden");       // Κρύβουμε τα αποτελέσματα καιρού
}

// 5. EVENT LISTENERS (Ακροατές Συμβάντων)

// Όταν ο χρήστης κάνει κλικ στο κουμπί Search
searchBtn.addEventListener("click", () => {
  checkWeather(cityInput.value); // Καλούμε τη συνάρτηση περνώντας την τιμή του input
});

// Όταν ο χρήστης πατήσει ένα πλήκτρο στο πληκτρολόγιο ενώ βρίσκεται στο input
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {   // Αν το πλήκτρο που πατήθηκε είναι το Enter
    checkWeather(cityInput.value);
  }
});