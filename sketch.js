function scaleScreen() {
  var screens = document.querySelectorAll('.screen');
  var scale = Math.min(window.innerWidth / 393, window.innerHeight / 852);
  screens.forEach(function(el) {
    el.style.position = 'fixed';
    el.style.transformOrigin = 'top left';
    el.style.transform = 'scale(' + scale + ')';
    el.style.left = ((window.innerWidth - 393 * scale) / 2) + 'px';
    el.style.top = ((window.innerHeight - 852 * scale) / 2) + 'px';
  });
}

scaleScreen();
window.addEventListener('resize', scaleScreen);

function animateBuddyScreen(screenEl, textElId, lines) {
  var animated = screenEl.querySelectorAll('.buddy-animate, .bubble-animate, .checkmark-animate');
  animated.forEach(function(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });

  var buddyText = document.getElementById(textElId);
  var allSpans = [];
  buddyText.innerHTML = '';
  lines.forEach(function(line) {
    var div = document.createElement('div');
    div.style.marginLeft = line.indent + 'px';
    line.words.forEach(function(word) {
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = word + '\u00a0';
      div.appendChild(span);
      allSpans.push(span);
    });
    buddyText.appendChild(div);
  });

  allSpans.forEach(function(span, i) {
    setTimeout(function() {
      span.classList.add('visible');
    }, 850 + i * 80);
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.add('hidden'); });
  var screen = document.getElementById(id);
  screen.classList.remove('hidden');

  if (id === 'buddyScreen') {
    animateBuddyScreen(screen, 'buddyText', [
      { words: "Hey there Pal! Heard you got".split(' '), indent: 0 },
      { words: "a furry friend who needs some".split(' '), indent: 0 },
      { words: "taking care of.".split(' '), indent: 20 }
    ]);
  } else if (id === 'buddy2Screen') {
    animateBuddyScreen(screen, 'buddyText2', [
      { words: "My name is Buddy, and I'm".split(' '), indent: 0 },
      { words: "here to help ya manage your".split(' '), indent: 0 },
      { words: "pet care duties.".split(' '), indent: 20 }
    ]);
  } else if (id === 'buddy3Screen') {
    animateBuddyScreen(screen, 'buddyText3', [
      { words: "This is your home screen, you'll".split(' '), indent: 0 },
      { words: "be able to access your task".split(' '), indent: 0 },
      { words: "lists through here".split(' '), indent: 20 }
    ]);
  } else if (id === 'tutorialHomeScreen') {
    animateBuddyScreen(screen, 'homeText', [
      { words: "try clicking on the collar icon".split(' '), indent: 0 },
      { words: "to start".split(' '), indent: 20 }
    ]);
  } else if (id === 'homeScreen') {
    // main home screen — no buddy
  } else if (id === 'collarTaskScreen') {
    animateBuddyScreen(screen, 'collarTaskText', [
      { words: "clicking on icons will take you".split(' '), indent: 0 },
      { words: "to the tab for that icon.".split(' '), indent: 0 }
    ]);
  } else if (id === 'walkTabScreen') {
    animateBuddyScreen(screen, 'walkTabText', [
      { words: "In this case you were taken to".split(' '), indent: 0 },
      { words: "the walk tab.".split(' '), indent: 20 }
    ]);
  } else if (id === 'walkPracticeScreen') {
    animateBuddyScreen(screen, 'walkPracticeText', [
      { words: "try entering a time for practice.".split(' '), indent: 0 }
    ]);
    // Enable inputs only after Buddy finishes speaking (~1.5s)
    setTimeout(function() {
      screen.querySelectorAll('input[type="time"]').forEach(function(inp) {
        inp.disabled = false;
      });
      screen.querySelectorAll('input[type="time"]').forEach(function(input) {
        input.addEventListener('change', function() {
          if (this.value) {
            // Copy all entered times to wayToGoScreen before navigating
            var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
            var wayToGoInputs = document.querySelectorAll('#wayToGoScreen input[type="time"]');
            practiceInputs.forEach(function(inp, i) {
              if (wayToGoInputs[i]) wayToGoInputs[i].value = inp.value;
            });
            showScreen('wayToGoScreen');
          }
        });
      });
    }, 1500);
  } else if (id === 'wayToGoScreen') {
    animateBuddyScreen(screen, 'wayToGoText', [
      { words: "Way to go Pal! Happy Tails will".split(' '), indent: 0 },
      { words: "send you notifications at".split(' '), indent: 0 },
      { words: "the times you enter here".split(' '), indent: 20 }
    ]);
  } else if (id === 'pawPracticeScreen') {
    // Copy times from walkPracticeScreen
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['pawTime1','pawTime2','pawTime3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    // Reset paw states
    document.querySelectorAll('#pawPracticeScreen .paw-btn').forEach(function(btn) {
      btn.classList.remove('paw-done');
      btn.style.opacity = '1';
    });
    document.querySelectorAll('#pawPracticeScreen input[type="time"]').forEach(function(inp) {
      inp.style.textDecoration = '';
    });
    animateBuddyScreen(screen, 'pawPracticeText', [
      { words: "click on the paw prints next to".split(' '), indent: 0 },
      { words: "the text to mark a task as".split(' '), indent: 0 },
      { words: "complete. Go on and try it".split(' '), indent: 0 },
      { words: "out for yourself".split(' '), indent: 40 }
    ]);
  } else if (id === 'paw1ClickedScreen') {
    // Copy times from walkPracticeScreen
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['paw1Time1','paw1Time2','paw1Time3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    animateBuddyScreen(screen, 'paw1ClickedText', [
      { words: 'complete tasks to earn points!'.split(' '), indent: 0 },
      { words: 'You can use these points for'.split(' '), indent: 0 },
      { words: 'rewards set by your parents.'.split(' '), indent: 0 }
    ]);
  } else if (id === 'paw2ClickedScreen') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['paw2Time1','paw2Time2','paw2Time3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    animateBuddyScreen(screen, 'paw2ClickedText', [
      { words: 'complete tasks to earn points!'.split(' '), indent: 0 },
      { words: 'You can use these points for'.split(' '), indent: 0 },
      { words: 'rewards set by your parents.'.split(' '), indent: 0 }
    ]);
  } else if (id === 'paw3ClickedScreen') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['paw3Time1','paw3Time2','paw3Time3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    animateBuddyScreen(screen, 'paw3ClickedText', [
      { words: 'complete tasks to earn points!'.split(' '), indent: 0 },
      { words: 'You can use these points for'.split(' '), indent: 0 },
      { words: 'rewards set by your parents.'.split(' '), indent: 0 }
    ]);
  } else if (id === 'pawHelpScreen') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['pawHelpTime1','pawHelpTime2','pawHelpTime3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    // Restore paw/checkmark state from whichever branch led here
    [1,2,3].forEach(function(n) {
      var paw = document.getElementById('helpPaw' + n);
      var chk = document.getElementById('helpCheck' + n);
      if (n === lastPawClicked) {
        if (paw) paw.style.display = 'none';
        if (chk) { chk.style.display = ''; chk.style.animation = 'none'; }
      } else {
        if (paw) paw.style.display = '';
        if (chk) chk.style.display = 'none';
      }
    });
    animateBuddyScreen(screen, 'pawHelpText', [
      { words: 'one more thing! if you need'.split(' '), indent: 0 },
      { words: 'help navigating the app or'.split(' '), indent: 0 },
      { words: 'some helpful tips'.split(' '), indent: 0 }
    ]);
  } else if (id === 'pawHelpScreen2') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['pawHelp2Time1','pawHelp2Time2','pawHelp2Time3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    [1,2,3].forEach(function(n) {
      var paw = document.getElementById('helpPaw' + n + 'b');
      var chk = document.getElementById('helpCheck' + n + 'b');
      if (n === lastPawClicked) {
        if (paw) paw.style.display = 'none';
        if (chk) { chk.style.display = ''; chk.style.animation = 'none'; }
      } else {
        if (paw) paw.style.display = '';
        if (chk) chk.style.display = 'none';
      }
    });
    animateBuddyScreen(screen, 'pawHelpText2', [
      { words: 'click the white circle'.split(' '), indent: 0 },
      { words: 'with a paw print on it!'.split(' '), indent: 0 }
    ]);
  } else if (id === 'pawHelpScreen3') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['pawHelp3Time1','pawHelp3Time2','pawHelp3Time3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    [1,2,3].forEach(function(n) {
      var paw = document.getElementById('helpPaw' + n + 'c');
      var chk = document.getElementById('helpCheck' + n + 'c');
      if (n === lastPawClicked) {
        if (paw) paw.style.display = 'none';
        if (chk) { chk.style.display = ''; chk.style.animation = 'none'; }
      } else {
        if (paw) paw.style.display = '';
        if (chk) chk.style.display = 'none';
      }
    });
    animateBuddyScreen(screen, 'pawHelpText3', [
      { words: "it'll be right where I am currently".split(' '), indent: 0 }
    ]);
  } else if (id === 'pawHelpScreen4') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['pawHelp4Time1','pawHelp4Time2','pawHelp4Time3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    [1,2,3].forEach(function(n) {
      var paw = document.getElementById('helpPaw' + n + 'd');
      var chk = document.getElementById('helpCheck' + n + 'd');
      if (n === lastPawClicked) {
        if (paw) paw.style.display = 'none';
        if (chk) { chk.style.display = ''; chk.style.animation = 'none'; }
      } else {
        if (paw) paw.style.display = '';
        if (chk) chk.style.display = 'none';
      }
    });
    animateBuddyScreen(screen, 'pawHelpText4', [
      { words: 'and clicking on it will let me'.split(' '), indent: 0 },
      { words: 'pop right up and help!'.split(' '), indent: 0 }
    ]);
  } else if (id === 'pawFarewellScreen') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['farewellTime1','farewellTime2','farewellTime3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    [1,2,3].forEach(function(n) {
      var paw = document.getElementById('farewellPaw' + n);
      var chk = document.getElementById('farewellCheck' + n);
      if (n === lastPawClicked) {
        if (paw) paw.style.display = 'none';
        if (chk) { chk.style.display = ''; chk.style.animation = 'none'; }
      } else {
        if (paw) paw.style.display = '';
        if (chk) chk.style.display = 'none';
      }
    });
    animateBuddyScreen(screen, 'pawFarewellText', [
      { words: 'Good luck buddy, and'.split(' '), indent: 0 },
      { words: 'remember pets need a lot of love'.split(' '), indent: 0 }
    ]);
  } else if (id === 'pawFarewellScreen2') {
    var practiceInputs = document.querySelectorAll('#walkPracticeScreen input[type="time"]');
    ['farewell2Time1','farewell2Time2','farewell2Time3'].forEach(function(tid, i) {
      var el = document.getElementById(tid);
      if (el && practiceInputs[i]) el.value = practiceInputs[i].value;
    });
    [1,2,3].forEach(function(n) {
      var paw = document.getElementById('farewell2Paw' + n);
      var chk = document.getElementById('farewell2Check' + n);
      if (n === lastPawClicked) {
        if (paw) paw.style.display = 'none';
        if (chk) { chk.style.display = ''; chk.style.animation = 'none'; }
      } else {
        if (paw) paw.style.display = '';
        if (chk) chk.style.display = 'none';
      }
    });
    animateBuddyScreen(screen, 'pawFarewellText2', [
      { words: 'but have a lot of love to give!'.split(' '), indent: 0 }
    ]);
  }
}

document.getElementById('beginBtn').addEventListener('click', function () {
  showScreen('buddyScreen');
});

document.getElementById('buddyText3').addEventListener('click', function () {
  showScreen('tutorialHomeScreen');
});

document.getElementById('collarIcon').addEventListener('click', function () {
  var inner = this.querySelector('.pulse');
  if (inner) inner.classList.remove('pulse');
  var glow = this.querySelector('.collar-glow');
  if (glow) glow.style.display = 'none';
  showScreen('collarTaskScreen');
});

document.getElementById('quitBtn').addEventListener('click', function () {
  window.close();
});

document.addEventListener('click', function(e) {
  if (e.target.closest('#buddyText')) {
    showScreen('buddy2Screen');
  } else if (e.target.closest('#buddyText2')) {
    showScreen('buddy3Screen');
  } else if (e.target.closest('#collarTaskText')) {
    showScreen('walkTabScreen');
  } else if (e.target.closest('#walkTabText')) {
    showScreen('walkPracticeScreen');
  } else if (e.target.closest('#wayToGoText')) {
    showScreen('pawPracticeScreen');
  } else if (e.target.closest('#paw1ClickedText') || e.target.closest('#paw2ClickedText') || e.target.closest('#paw3ClickedText')) {
    showScreen('pawHelpScreen');
  } else if (e.target.closest('#pawHelpText')) {
    showScreen('pawHelpScreen2');
  } else if (e.target.closest('#pawHelpText2')) {
    showScreen('pawHelpScreen3');
  } else if (e.target.closest('#pawHelpText3')) {
    showScreen('pawHelpScreen4');
  } else if (e.target.closest('#pawHelpText4')) {
    showScreen('pawFarewellScreen');
  } else if (e.target.closest('#pawFarewellText')) {
    showScreen('pawFarewellScreen2');
  } else if (e.target.closest('#pawFarewellText2')) {
    showScreen('homeScreen');
  }
});

document.getElementById('skipBtn').addEventListener('click', function () {
  showScreen('homeScreen');
});

// Paw 1 click navigates to paw1ClickedScreen
var lastPawClicked = 0;

document.getElementById('pawBtn1').addEventListener('click', function() {
  lastPawClicked = 1;
  showScreen('paw1ClickedScreen');
});

document.getElementById('pawBtn2').addEventListener('click', function() {
  lastPawClicked = 2;
  showScreen('paw2ClickedScreen');
});

document.getElementById('pawBtn3').addEventListener('click', function() {
  lastPawClicked = 3;
  showScreen('paw3ClickedScreen');
});



