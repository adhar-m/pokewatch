import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as fs from "fs";
import { vibration } from "haptics";

// Load existing log file, if any
function loadFile() {
  try {
    let app_log  = fs.readFileSync("log.txt", "json");
  } catch(err) {
    return;
  }
    let calorieCounter = document.getElementById("calorieCounter");
    let calories = app_log.calories;
    calorieCounter.text = `Calories: ${calories}`;
}

// Write to log file
function writeToFile(value, type){
  if (type == "calories"){
    let data_to_log = {
      "calories": value,
    };
  fs.writeFileSync("log.txt", data_to_log, "json");
  //to debug:
  //let json_object  = fs.readFileSync("log.txt", "json");
  //console.log(JSON.stringify(json_object));
  }
}

function getPokemonStatus(){
 let hpStatus = fs.readFileSync('/mnt/assets/resources/pokemonStatus.json', 'json');
  console.log(JSON.stringify(hpStatus));
}

//Load log file on app opening
loadFile();

// Update the clock every minute
clock.granularity = "minutes";

// Get handles on the <text> elements
const time = document.getElementById("time");
const day = document.getElementById("day");
const hp = document.getElementById("pokemon-hp");
const status = document.getElementById("pokemon-status");


// Calorie counter functionality
let calorieCounter = document.getElementById("calorieCounter");
let pokemonSprite = document.getElementById("pokemon-sprite");
pokemonSprite.onclick = function(e) {
  vibration.start("confirmation");
  let calories = Number(calorieCounter.text.slice(10));
  calories += 100;
  if (calories > 3000){
    calories = 0;
  }
  calorieCounter.text = `Calories: ${calories}`;
  writeToFile(calories, "calories");
  getPokemonStatus();
  }

// Update the <text> elements every tick
clock.ontick = (evt) => {
  let today = evt.date;
  let todayDate = String(Number(today.getMonth()) + 1) + "/" + today.getDate();
  let hours = today.getHours();
 
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = zeroPad(hours);
  }
  
  let mins = zeroPad(today.getMinutes());
  
  //Update calories every new day
  if (hours == 0 && mins == 0){
    resetCalories();
    //TODO: Implement setPokemonHP()
  }

  let todayDay = today.getDay();
  let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  //Actually update time and day
  time.text = `${hours}:${mins}`;
  day.text = `${dayNames[todayDay]}, ${todayDate}`;
  hp.text = `HP: 40`;
  status.text = `Legendary`;
}

function resetCalories(){
  let calorieCounter = document.getElementById("calorieCounter");
  calorieCounter.text = `Calories: 0`;
  writeToFile(0, "calories");
}

// Utility method, add zero in front of numbers < 10
function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}



/*
function updateStreak(caloriesToday, calorieLimit){
  const currentStreak = document.getElementById("currentStreak");
  streakValue = Integer(currentStreak.text)
  
  if (caloriesToday <= calorieLimit){
    streakValue += 1;
  }
  else {
    streakValue = 0;
  }
  
  currentStreak.text = `${streakValue}`;
}
*/