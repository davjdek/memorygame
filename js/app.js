/*
 * Create a list that holds all of your cards
 */
 
// global variables declarations
const symbols = ["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-leaf","fa-bicycle","fa-bomb"];
const colors =["Yellow","Turquoise","Crimson","Lime","OrangeRed","MediumBlue","Magenta","FireBrick"];
const audios =["audio1","audio2","audio3","audio4","audio5","audio6","audio7","audio8"];
let deck  =[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
let active;
let matchedCards;
let freeze;
let counter;
let stars;
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
let timer;

//building card objects with properties and methods
deck.forEach(function(item,index){
		deck[index].id=index;
		deck[index].position=index;
		deck[index].symbol=symbols[Math.floor(index/2)];
		deck[index].color=colors[Math.floor(index/2)];
		deck[index].audio=audios[Math.floor(index/2)];
		
		deck[index].turnUp=function(){
			let position=this.position;
			let element=document.getElementById(position);
			element.classList.add("open");
			if (!($('#hasSymbols').is(":checked"))) {
				element.style.fontSize = 0;
			} else {
				element.style.fontSize = "33px";
				}
			if ($('#hasColors').is(":checked")) {
				element.style.background = this.color;
			}
			if ($('#hasSounds').is(":checked")) {
				freeze=true;
				playSound(this.audio);
				freeze=false;
			}
			
			
		};
		deck[index].turnDown=function(){
			let position=this.position;
			let element=document.getElementById(position);
			element.classList.remove("open", "match");
			element.style.background = "";
			element.style.fontSize = 0;
		};
		deck[index].match=function(){
			matchedCards.push(this);
			let position=this.position;
			let element=document.getElementById(position);
			element.classList.add("match");
		};
});

//game initialization
function init(){
	stars=3;
	$(".stars li").css("color", "#000");
	active="";
	matchedCards=[];
	freeze=false;
	counter=0;
	$(".moves").text(0);
	const elements=$(".card i");
	$(elements).each(function(index){
		this.classList.remove(deck[index].symbol);
	});
	$(".card").each(function(index){
		deck[index].turnDown();
	});
	
	$(".message").text("Match the cards with the same symbol. Click on a card to open it.");
	shuffle(deck);
	
	$(".deck").one("click", function(e){
		$("#hasColors").prop( "disabled", true );
		$("#hasSymbols").prop( "disabled", true );
		$("#hasSounds").prop( "disabled", true );
	});
	totalSeconds = 0;
	clearInterval(timer);
	timer=setInterval(setTime, 1000);
	enableOptions();
 }

//selecting a card, comparing it with the active card (if any), setting matches 
function select (selectedId){
	
	let selectedCard=deck[parseInt(selectedId)];
	selectedCard.turnUp();
	if (!active){
		active=selectedCard;
	}
	else if (selectedCard.symbol==active.symbol) {
		if (selectedId==active.position){return;}
		counter+=1;
		$(".moves").text(counter);
		selectedCard.match();
		active.match();
		active="";
		if (counter>=15){$("#star3").css("color", "#eee"); stars=2};
		if (counter>=30){$("#star2").css("color", "#eee"); stars=1};
		if (counter>=45){$("#star1").css("color", "#eee"); stars=0};
		if (matchedCards.length==16){
			$(".message").text(`Congratulations! You matched all cards in just ${counter} moves!`);
			clearInterval(timer);
			setTimeout(function(){
				alert(`Congratulations! You matched all cards in just ${counter} moves in ${minutesLabel.innerHTML}.${secondsLabel.innerHTML}! You got ${stars} stars. Click restart button to play again`);
			},500);
			
			enableOptions();
		}
	}
	else {
		freeze=true;
		setTimeout(function(){
			counter+=1;
			$(".moves").text(counter);
			selectedCard.turnDown();
			active.turnDown();
			active="";
			if (counter>=15){$("#star3").css("color", "#eee"); stars=2};
			if (counter>=30){$("#star2").css("color", "#eee"); stars=1};
			if (counter>=45){$("#star1").css("color", "#eee"); stars=0};
			freeze=false;
		},500);
		
	}
}
 //starting game
init();

//enabling setting options
function enableOptions() {
	$("#hasColors").prop( "disabled", false);
	$("#hasSymbols").prop( "disabled", false);
	$("#hasSounds").prop( "disabled", false);
}

//event handler when clicking on a card
$(".deck").on("click",".card:not(.match)", function(e){
	if (freeze==false){		
		select(this.id);
	}
});

//restarting the game
$(".restart").on("click",function(e){
	init();
});

//preventing no selected option
$(".option").on("change",function(e){
	if (!($("#hasColors").is(':checked') || $("#hasSymbols").is(':checked') || $("#hasSounds").is(':checked'))) {
		alert("You must select at least one option!");
		$('#hasSymbols').prop('checked', true);
		$('#hasSounds').prop('checked', true);
		$('#hasColors').prop('checked', true);
	}
});

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
		temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
		array[currentIndex].position=currentIndex;
		element=document.getElementById(currentIndex);
		element.firstElementChild.classList.add(array[currentIndex].symbol);
    }

    return array;}

// playing sound
function playSound(audioEl) {
          var sound = document.getElementById(audioEl);
          sound.play();
      }

// timer settings	  

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60)); 
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
