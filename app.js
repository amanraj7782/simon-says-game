let userSeq = [];
let gameSeq = [];
let started = false;
let inGameScreen = false;
let level = 0;
let playerName = "Player";
let highScore = Number(localStorage.getItem("simonHighScore")) || 0;

let btns = ["yellow", "red", "purple", "green"];

// DOM Elements
const startScreen = document.querySelector("#start-screen");
const quitScreen = document.querySelector("#quit-screen");
const gameInterface = document.querySelector("#game-interface");

const playerNameInput = document.querySelector("#player-name-input");
const displayNameEl = document.querySelector("#display-name");
const enterGameBtn = document.querySelector("#enter-game-btn");
const quitBtn = document.querySelector("#quit-btn");
const playAgainBtn = document.querySelector("#play-again-btn");
const quitStatsEl = document.querySelector("#quit-stats");

const htwo = document.querySelector("#status-text");
const currentScoreEl = document.querySelector("#current-score");
const highScoreEl = document.querySelector("#high-score");
const startBtn = document.querySelector("#start-btn");

highScoreEl.innerText = `Highest Score: ${highScore}`;

// Web Audio API Synthesizer
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const buttonFrequencies = {
    red: 329.63,    // E4
    green: 261.63,  // C4
    purple: 220.00, // A3
    yellow: 392.00  // G4
};

function playTone(freq, type = "sine", duration = 0.22) {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playLevelSuccessSound() {
    setTimeout(() => playTone(523.25, "triangle", 0.12), 180);
    setTimeout(() => playTone(659.25, "triangle", 0.22), 300);
}

function playWrongSound() {
    playTone(130.81, "sawtooth", 0.45);
}

function updateHighScore(score) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("simonHighScore", highScore);
        highScoreEl.innerText = `Highest Score: ${highScore}`;
    }
}

// 1. Enter Game from Start Screen
function handleEnterGame(e) {
    if (e) e.stopPropagation();
    const rawName = playerNameInput.value.trim();
    playerName = rawName !== "" ? rawName : "Guest";
    displayNameEl.innerText = playerName;

    startScreen.classList.add("hidden");
    quitScreen.classList.add("hidden");
    gameInterface.classList.remove("hidden");

    htwo.innerHTML = `Welcome, <b>${playerName}</b>! Press any key or click any button to start.`;

    // Small delay so the 'Enter' key from the input doesn't immediately trigger keydown
    setTimeout(() => {
        inGameScreen = true;
    }, 100);
}

enterGameBtn.addEventListener("click", handleEnterGame);
playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleEnterGame(e);
});

// 2. Quit Game Handler
quitBtn.addEventListener("click", () => {
    reset();
    inGameScreen = false;
    gameInterface.classList.add("hidden");
    quitScreen.classList.remove("hidden");
    quitStatsEl.innerText = `Well played, ${playerName}! Your Highest Score: ${highScore}`;
});

// 3. Back to Start Screen
playAgainBtn.addEventListener("click", () => {
    quitScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
});

// 4. Start Round inside Game
function startGame() {
    if (inGameScreen && !started) {
        started = true;
        levelup();
    }
}

document.addEventListener("keydown", () => {
    if (inGameScreen && !started) {
        startGame();
    }
});

startBtn.addEventListener("click", startGame);

function gameFlash(btn, color) {
    playTone(buttonFrequencies[color], "sine", 0.25);
    btn.classList.add("flash");
    setTimeout(() => {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn, color) {
    playTone(buttonFrequencies[color], "triangle", 0.2);
    btn.classList.add("userflas");
    setTimeout(() => {
        btn.classList.remove("userflas");
    }, 250);
}

function levelup() {
    userSeq = [];
    level++;
    htwo.innerHTML = `<b>${playerName}</b> — Level ${level}`;
    currentScoreEl.innerText = `Level: ${level}`;
    updateHighScore(level);

    let randomnu = Math.floor(Math.random() * btns.length);
    let randomco = btns[randomnu];
    let randombtn = document.querySelector(`.${randomco}`);

    gameSeq.push(randomco);
    console.log(gameSeq); // Prints the gameSeq array in the console
    gameFlash(randombtn, randomco);
}

function checkans(indx) {
    if (userSeq[indx] === gameSeq[indx]) {
        if (userSeq.length === gameSeq.length) {
            updateHighScore(level);
            playLevelSuccessSound();
            setTimeout(() => {
                if (started) levelup();
            }, 1000);
        }
    } else {
        playWrongSound();
        updateHighScore(level);

        htwo.innerHTML = `Game Over, <b>${playerName}</b>! Score: <b>${level}</b>.<br>Press any key or click any button to play again.`;
        document.body.classList.add("game-over-bg");
        setTimeout(() => {
            document.body.classList.remove("game-over-bg");
        }, 200);

        reset();
    }
}

function btnpress() {
    // If the game hasn't started yet, clicking any colored button will start it
    if (!started) {
        startGame();
        return;
    }

    let btn = this;
    let usercolour = btn.getAttribute("id");
    userFlash(btn, usercolour);

    userSeq.push(usercolour);
    checkans(userSeq.length - 1);
}

let allbtn = document.querySelectorAll(".btn");
for (let btn of allbtn) {
    btn.addEventListener("click", btnpress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    currentScoreEl.innerText = `Level: 0`;
}






/*
let userSeq=[];
let gameSeq=[];
let started=false;
let level=0;
let btns=["yellow","red","purple","green"] ;
let htwo=document.querySelector("h2");
document.addEventListener("keydown",function(){
    if(started==false)
         {
        //    console.log("key is pressed ");
           started=true;
           levelup();
         }
});
    
function gameFlash(btn){
            btn.classList.add("flash");
            setTimeout(() => {
            btn.classList.remove("flash") ;
            }, 250);
}

function userFlash(btn){
            btn.classList.add("userflas");
            setTimeout(() => {
            btn.classList.remove("userflas") ;
            }, 250);
}

function levelup(){
        userSeq=[];
        level++;
        htwo.innerText=`Your Level is ${level} `;
        let randomnu=Math.floor(Math.random()*btns.length);
        let randomco=btns[randomnu];
        let randombtn=document.querySelector(`.${randomco}`) ;
        // console.log(randomco);
        // console.log(randombtn);
        gameSeq.push(randomco);
        console.log(gameSeq);
        gameFlash(randombtn);
    }
  function checkans(indx){
    //   console.log(`check level : ${level}`);
    if(userSeq[indx]===gameSeq[indx])
      {
        // console.log("same value ");
         if(userSeq.length==gameSeq.length)
             {
                setTimeout(levelup,1000);
             }
      }
    else{
           htwo.innerHTML=`Game Over1 , Your Score was <b>${level}</b> ,<br> Press any key to start `;
           document.querySelector("body").style.backgroundColor="red";
           setTimeout(function () {
                document.querySelector("body").style.backgroundColor="white";
           },150)
           reset();
        }
  }


function btnpress(){
    //    console.log(this);  
       let btn=this;
       userFlash(btn);
       let usercolour=btn.getAttribute("id");
    //    console.log(usercolour);
      userSeq.push(usercolour);
      checkans(userSeq.length-1);
}

let allbtn =document.querySelectorAll(".btn") ;
for(let btn of allbtn){
    btn.addEventListener("click",  btnpress)
}

function reset(){
    started=false;
    gameSeq=[];
    userSeq=[];
    level=0;
}

*/