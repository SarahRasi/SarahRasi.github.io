var favouriteFood = 'pizza'; //erstellt variable die unter favouriteFood abgespeichert ist
var numOfSlices = 8; //gleich mit Zahl als value
console.log(favouriteFood); //zeigt auf, was unter variable abgespeichert ist
console.log(numOfSlices); 

let changeMe = true; //gibt 'changeMe' den boolean 'true'
changeMe = false; // durch let kann Wert verändert werden --> jetzt 'false'
console.log(changeMe); //zeigt Wert an

const entree = 'Enchiladas';
console.log(entree);
//entree = 'Tacos' gibt error, weil man const nicht redefinen kann
//const testing; gibt error, weil kein value zugewiesen wird

let levelUp = 10;
let powerLevel = 9001;
let multiplyMe = 32;
let quarterMe = 1152;

// Use the mathematical assignments in the space below:
levelUp += 5;
powerLevel -= 100;
multiplyMe *= 11
quarterMe /= 4


// These console.log() statements below will help you check the values of the variables.
// You do not need to edit these statements. 
console.log('The value of levelUp:', levelUp); 
console.log('The value of powerLevel:', powerLevel); 
console.log('The value of multiplyMe:', multiplyMe); 
console.log('The value of quarterMe:', quarterMe);

let gainedDollar = 3;
let lostDollar = 50;

gainedDollar++; //increment operator, fügt 1 hinzu
lostDollar--; //decrement operator, nimmt eins weg

var favoriteAnimal = 'dog';
console.log('My favorite animal: ' + favoriteAnimal); //string + variable

var myName = 'Sarah';
var myCity = 'Innsbruck';
console.log(`My name is ${myName}. My favorite city is ${myCity}.`);