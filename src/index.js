/*
Entry point JS file for Webpack
Calls functions from other JS files
*/

// Variables from CubeFlow.js
import { scramble, timer, current, best, avg5, avg12, hide, viewTimesButton, resetButton, modal, minutes, seconds, milliseconds, time, running, reset, active, moves, table } from './CubeFlow';

// Functions from CubeFlow.js
import { startTimer, stopTimer, generateCurrentTime, generateBestTime, timeToInt, intToTime, resetTimer, updateTimer, generateScramble, addSolve, generateTimes } from './CubeFlow';

// Variables from login.js
import { loginButton } from './login';

// Functions from login.js
import { login, hello } from './login';

// Variables from firebase.js
import { app, db, auth, provider } from './firebase';

// Functions from firebase.js
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, addDoc, query, orderBy, limit, where, serverTimestamp, getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from './firebase';

/*
CubeFlow functions
*/

resetButton.addEventListener('click', resetTimer);

viewTimesButton.addEventListener('click', function() {
  modal.style.display = "block";
  active = false;
});

window.addEventListener('click', function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
    active = true;
  }
});

document.addEventListener('keyup', function(e) {
  if (active) {
    if (e.code === 'Space') {
      e.preventDefault();
      startTimer();
      timer.style.color = 'black';
    }
  }
});

document.addEventListener('keydown', function(e) {
  if (active) {
    e.preventDefault();

    if (running && e.key != 'r') {
      stopTimer();
    }

    if (!running && reset) {
      if (e.code == 'Space') {
        timer.style.color = '#17CD41';

        for (let i = 0; i < hide.length; i++) {
          hide[i].style.visibility = 'hidden';
        }
      }
    }
    
    if (e.key == 'r' && !running) {
      resetTimer();
    }
  }
});

window.addEventListener('load', generateScramble);
window.addEventListener('load', generateCurrentTime);
window.addEventListener('load', generateBestTime);
window.addEventListener('load', generateTimes);

/*
Login functions
*/

