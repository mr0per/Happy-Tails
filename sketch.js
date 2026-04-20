var pointScore = 0;

function animateTabScreen(screenId) {
  var screen = document.getElementById(screenId);
  if (!screen) return;

  // Animate animal image
  var animal = screen.querySelector('.layer[src*="fooddog"], .layer[src*="watercat"], .layer[src*="playcat"], .layer[src*="walkdog"]');
  if (animal) {
    animal.classList.remove('animal-enter');
    void animal.offsetWidth;
    animal.classList.add('animal-enter');
  }

  // Animate paw buttons with stagger
  var paws = screen.querySelectorAll('[id$="Paw1"],[id$="Paw2"],[id$="Paw3"]');
  paws.forEach(function(paw, i) {
    paw.classList.remove('paw-enter');
    void paw.offsetWidth;
    paw.classList.add('paw-enter');
    paw.style.animationDelay = (0.1 + i * 0.1) + 's';
  });
}

function playDing() {
  var sfx = document.getElementById('dingSfx');
  if (sfx) { sfx.currentTime = 0; sfx.play(); }
}

function showPointsFloat(anchorEl) {
  var rect = anchorEl.getBoundingClientRect();
  var screen = anchorEl.closest('.screen');
  var screenRect = screen.getBoundingClientRect();

  // +5 label — in brown card panel, left of the light box (card=32px, box=86px)
  var el = document.createElement('div');
  el.className = 'points-float';
  el.textContent = '+5';
  el.style.left = '42px';
  el.style.top  = (rect.top  - screenRect.top  + 4) + 'px';
  screen.appendChild(el);
  var textDing = document.getElementById('textDingSfx');
  if (textDing) { textDing.currentTime = 0; textDing.play(); }
  setTimeout(function() { if (el.parentNode) el.remove(); }, 1700);

  // Sparkles radiating outward from same spot
  var sparks = ['✦','✦','✦','✦','✦'];
  var angles = [315, 270, 225, 180, 135];
  sparks.forEach(function(char, i) {
    var s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = char;
    var cx = 52;
    var cy = rect.top - screenRect.top + 10;
    s.style.left = cx + 'px';
    s.style.top  = cy + 'px';
    var rad = angles[i] * Math.PI / 180;
    var dist = 22 + Math.random() * 10;
    s.style.setProperty('--sx', Math.round(Math.cos(rad) * dist) + 'px');
    s.style.setProperty('--sy', Math.round(Math.sin(rad) * dist) + 'px');
    s.style.animationDelay = (i * 0.05) + 's';
    screen.appendChild(s);
    setTimeout(function() { if (s.parentNode) s.remove(); }, 900);
  });
}

function updateScoreDisplays() {
  var displays = document.querySelectorAll('#homeScoreDisplay, #foodScoreDisplay, #waterScoreDisplay, #playScoreDisplay, #walkScoreDisplay, #rewardScoreDisplay');
  displays.forEach(function(el) { el.textContent = pointScore; });
}

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

function animateBuddyScreen(screenEl, textElId, lines, slide) {
  var buddyEls = screenEl.querySelectorAll('.buddy-animate');
  buddyEls.forEach(function(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    if (slide) {
      el.style.animation = '';
    }
    // else static — leave animation cleared
  });
  var nonBuddy = screenEl.querySelectorAll('.bubble-animate, .checkmark-animate');
  nonBuddy.forEach(function(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    if (slide || el.classList.contains('checkmark-animate')) {
      el.style.animation = '';
      el.style.opacity = '';
    } else {
      // No animation but keep visible
      el.style.opacity = '1';
    }
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
      var snd = new Audio('images/words.mp3');
      snd.play();
    }, (slide ? 850 : 100) + i * 80);
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
    ], true);
  } else if (id === 'buddy2Screen') {
    animateBuddyScreen(screen, 'buddyText2', [
      { words: "My name is Buddy, and I'm".split(' '), indent: 0 },
      { words: "here to help ya manage your".split(' '), indent: 0 },
      { words: "pet care duties.".split(' '), indent: 20 }
    ], false);
  } else if (id === 'buddy3Screen') {
    animateBuddyScreen(screen, 'buddyText3', [
      { words: "This is your home screen, you'll".split(' '), indent: 0 },
      { words: "be able to access your task".split(' '), indent: 0 },
      { words: "lists through here".split(' '), indent: 20 }
    ], false);
  } else if (id === 'tutorialHomeScreen') {
    animateBuddyScreen(screen, 'homeText', [
      { words: "try clicking on the collar icon".split(' '), indent: 0 },
      { words: "to start".split(' '), indent: 20 }
    ], false);
  } else if (id === 'homeScreen') {
    // main home screen — no buddy
  } else if (id === 'homeBuddy2Screen') {
    animateBuddyScreen(screen, 'homeBuddyText2', [
      { words: "In the top left corner is the".split(' '), indent: 0 },
      { words: "food bowl. It'll take ya to the".split(' '), indent: 0 },
      { words: "food tab!".split(' '), indent: 0 }
    ], false);
  } else if (id === 'homeBuddy3Screen') {
    animateBuddyScreen(screen, 'homeBuddyText3', [
      { words: "The food tab is where you put".split(' '), indent: 0 },
      { words: "in the times you're feeding".split(' '), indent: 0 },
      { words: "your pet.".split(' '), indent: 50 }
    ], false);
  } else if (id === 'homeBuddyWaterScreen') {
    animateBuddyScreen(screen, 'homeBuddyTextWater', [
      { words: "In the top right is the water".split(' '), indent: 0 },
      { words: "bowl. It'll take ya to the".split(' '), indent: 0 },
      { words: "water tab!".split(' '), indent: 0 }
    ], false);
  } else if (id === 'homeBuddyWater2Screen') {
    animateBuddyScreen(screen, 'homeBuddyTextWater2', [
      { words: "where you put in the times".split(' '), indent: 0 },
      { words: "you give your pet water".split(' '), indent: 0 }
    ], false);
  } else if (id === 'homeBuddy4Screen') {
    animateBuddyScreen(screen, 'homeBuddyText4', [
      { words: "bottom left is the play icon.".split(' '), indent: 0 },
      { words: "It'll take ya to the play tab".split(' '), indent: 0 },
      { words: "where you input your pet's".split(' '), indent: 0 },
      { words: "play times".split(' '), indent: 60 }
    ], false);
  } else if (id === 'homeBuddy5Screen') {
    animateBuddyScreen(screen, 'homeBuddyText5', [
      { words: "and finally bottom right is the".split(' '), indent: 0 },
      { words: "walk icon. It'll take ya to the".split(' '), indent: 0 },
      { words: "walk tab, and there you put in".split(' '), indent: 0 },
      { words: "your walk times".split(' '), indent: 60 }
    ], false);
  } else if (id === 'collarTaskScreen') {
    animateBuddyScreen(screen, 'collarTaskText', [
      { words: "clicking on icons will take you".split(' '), indent: 0 },
      { words: "to the tab for that icon.".split(' '), indent: 0 }
    ], true);
  } else if (id === 'walkTabScreen') {
    animateBuddyScreen(screen, 'walkTabText', [
      { words: "In this case you were taken to".split(' '), indent: 0 },
      { words: "the walk tab.".split(' '), indent: 20 }
    ], false);
  } else if (id === 'walkPracticeScreen') {
    animateBuddyScreen(screen, 'walkPracticeText', [
      { words: "try entering a time for practice.".split(' '), indent: 0 }
    ], false);
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
    ], false);
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
    ], false);
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
    ], false);
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
    ], false);
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
    ], false);
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
    ], false);
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
    ], false);
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
    ], false);
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
    ], false);
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
      { words: 'remember pets need a lot of'.split(' '), indent: 0 },
      { words: ['love'], indent: 30 }
    ], false);
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
    ], false);
  } else if (id === 'rewardsBuddyScreen') {
    animateBuddyScreen(screen, 'rewardsBuddyText', [
      { words: "this is your rewards screen.".split(' '), indent: 0 },
      { words: "you and your parent can input".split(' '), indent: 0 },
      { words: "rewards up above!".split(' '), indent: 20 }
    ], true);
  } else if (id === 'rewardsBuddyScreen2') {
    animateBuddyScreen(screen, 'rewardsBuddyText2', [
      { words: "Once you get the points".split(' '), indent: 0 },
      { words: "required tap the paw to claim".split(' '), indent: 0 },
      { words: "it!".split(' '), indent: 40 }
    ], false);
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
    } else if (e.target.closest('#homeBuddyText')) {
      showScreen('homeBuddy2Screen');
    } else if (e.target.closest('#homeBuddyText2')) {
      showScreen('homeBuddy3Screen');
    } else if (e.target.closest('#homeBuddyText3')) {
      showScreen('homeBuddyWaterScreen');
    } else if (e.target.closest('#homeBuddyTextWater')) {
      showScreen('homeBuddyWater2Screen');
    } else if (e.target.closest('#homeBuddyTextWater2')) {
      showScreen('homeBuddy4Screen');
    } else if (e.target.closest('#homeBuddyText4')) {
      showScreen('homeBuddy5Screen');
    } else if (e.target.closest('#homeBuddyText5')) {
      ['homeBuddy', 'homeBubble', 'homeBuddyText'].forEach(function(elId) {
        var el = document.getElementById(elId);
        if (el) el.style.display = 'none';
      });
      var btn = document.getElementById('homeBuddyIconBtn');
      if (btn) btn.style.display = '';
      showScreen('homeScreen');
    } else if (e.target.closest('#rewardsBuddyText')) {
      showScreen('rewardsBuddyScreen2');
    } else if (e.target.closest('#rewardsBuddyText2')) {
      showScreen('rewardsScreen');
    }
});

document.getElementById('skipBtn').addEventListener('click', function () {
  showScreen('homeScreen');
});

document.getElementById('homeBuddyIconBtn').addEventListener('click', function () {
  var screen = document.getElementById('homeScreen');
  ['homeBuddy', 'homeBubble', 'homeBuddyText'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = '';
  });
  this.style.display = 'none';
  animateBuddyScreen(screen, 'homeBuddyText', [
    { words: "Hey there pal! still a little".split(' '), indent: 0 },
    { words: "confused? I'll tell ya about the".split(' '), indent: 0 },
    { words: "icons.".split(' '), indent: 0 }
  ], true);
});

document.getElementById('foodIcon').addEventListener('click', function () {
  showScreen('foodTaskScreen');
  animateTabScreen('foodTaskScreen');
});

document.getElementById('waterIcon').addEventListener('click', function () {
  showScreen('waterTaskScreen');
  animateTabScreen('waterTaskScreen');
});

document.getElementById('ballIcon').addEventListener('click', function () {
  showScreen('playTaskScreen');
  animateTabScreen('playTaskScreen');
});

document.getElementById('homeCollarIcon').addEventListener('click', function () {
  showScreen('walkTaskScreen');
  animateTabScreen('walkTaskScreen');
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

// ===== DYNAMIC TAB ENTRIES =====
var tabEntryCounts = { food: 0, water: 0, play: 0, walk: 0 };
var tabEntryClicked = {};

var tabLabels = {
  food:  { title: 'Food Time! 🥩',  body: 'Time to feed your pet!' },
  water: { title: 'Drink Time! 💧', body: "Fill up your pet's water bowl!" },
  play:  { title: 'Play Time! 🎾',  body: 'Your pet wants to play!' },
  walk:  { title: 'Walk Time! 🐾',  body: 'Time to take your pet for a walk!' }
};

function setupEntryPaw(tab, n) {
  var pawEl   = document.getElementById(tab + 'Paw'   + n);
  var checkEl = document.getElementById(tab + 'Check' + n);
  if (!pawEl || !checkEl) return;
  pawEl.addEventListener('click', function () {
    var key = tab + '-' + n;
    if (tabEntryClicked[key]) return;
    var timeInput = document.getElementById(tab + 'Time' + n);
    if (!timeInput || !timeInput.value) { if (timeInput) timeInput.focus(); return; }
    tabEntryClicked[key] = true;
    pawEl.style.display = 'none';
    checkEl.style.display = '';
    checkEl.classList.add('checkmark-animate');
    setTimeout(playDing, 300);
    setTimeout(function () { showPointsFloat(checkEl); }, 650);
    pointScore += 5;
    updateScoreDisplays();
  });
}

function addEntry(tab) {
  var n = ++tabEntryCounts[tab];
  var container = document.getElementById(tab + 'Entries');
  if (!container) return;

  var row = document.createElement('div');
  row.style.cssText = 'position:relative;height:57px;margin-bottom:9px;background-image:url(images/box.png);background-size:393px 852px;background-position:-81px -87px;border-radius:10px;flex-shrink:0';

  row.innerHTML =
    '<div id="' + tab + 'Paw' + n + '" style="position:absolute;left:9px;top:9px;width:29px;height:34px;filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.25));cursor:pointer"><div style="position:absolute;inset:0;overflow:hidden"><img src="images/paw.png" alt="" style="position:absolute;width:207px;height:449px;left:-19px;top:-228px" /></div></div>' +
    '<div id="' + tab + 'Check' + n + '" style="display:none;position:absolute;left:4px;top:12px;width:46px;height:27px;filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"><div style="position:absolute;inset:0;overflow:hidden"><img src="images/checkmark.png" alt="" style="position:absolute;width:393px;height:852px;left:-37px;top:-370px" /></div></div>' +
    '<input id="' + tab + 'Time' + n + '" type="time" style="position:absolute;left:50px;top:9px;width:155px;height:34px;" />' +
    '<div onclick="this.parentNode.remove()" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:22px;height:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(75,32,12,0.15);font-size:14px;color:#4b200c;font-family:sans-serif;line-height:1;user-select:none">&#x2715;</div>';

  container.appendChild(row);
  setupEntryPaw(tab, n);

  var lbl = tabLabels[tab];
  _taskNotifications.push({ id: tab + 'Time' + n, title: lbl.title, body: lbl.body });

  container.scrollTop = container.scrollHeight;
}

function initAllTabs() {
  ['food', 'water', 'play', 'walk'].forEach(function (tab) {
    addEntry(tab); addEntry(tab); addEntry(tab);
  });
}

// ===== REWARDS =====
var rewardCount = 0;
var rewardsTutorialSeen = false;

function goToRewards() {
  if (!rewardsTutorialSeen) {
    rewardsTutorialSeen = true;
    showScreen('rewardsBuddyScreen');
  } else {
    showScreen('rewardsScreen');
  }
}

function addReward() {
  var n = ++rewardCount;
  var container = document.getElementById('rewardEntries');
  if (!container) return;

  var row = document.createElement('div');
  row.style.cssText = 'position:relative;height:57px;margin-bottom:9px;background-image:url(images/box.png);background-size:393px 852px;background-position:-81px -87px;border-radius:10px;flex-shrink:0';

  row.innerHTML =
    '<input id="rewardName' + n + '" type="text" placeholder="enter reward" maxlength="16"' +
    ' style="position:absolute;left:9px;top:10px;width:120px;height:32px;background:transparent;border:none;outline:none;' +
    'font-family:Comfortaa,sans-serif;font-size:14px;color:#4b200c;" />' +
    '<input id="rewardPts' + n + '" type="number" min="0" placeholder="pts" ' +
    ' style="position:absolute;left:137px;top:10px;width:55px;height:32px;background:transparent;border:none;outline:none;' +
    'font-family:Comfortaa,sans-serif;font-size:14px;color:#4b200c;text-align:right;" />' +
    '<div onclick="claimReward(' + n + ')" style="position:absolute;right:6px;top:10px;width:29px;height:34px;' +
    'filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.25));cursor:pointer" title="Claim reward">' +
    '<div style="position:absolute;inset:0;overflow:hidden"><img src="images/paw.png" alt="" style="position:absolute;width:207px;height:449px;left:-19px;top:-228px" /></div></div>';

  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function claimReward(n) {
  var nameEl = document.getElementById('rewardName' + n);
  var ptsEl  = document.getElementById('rewardPts' + n);
  if (!ptsEl) return;
  var cost = parseInt(ptsEl.value, 10);
  if (isNaN(cost) || cost <= 0) { alert('Enter the points needed for this reward!'); return; }
  if (pointScore < cost) {
    var activeScreen = document.querySelector('.screen:not(.hidden)');
    var notBanner = document.createElement('div');
    notBanner.textContent = 'Not enough points';
    notBanner.style.cssText = [
      'position:absolute',
      'top:320px',
      'left:50%',
      'transform:translateX(-50%)',
      'background:#fdc2a4',
      'color:#5e2910',
      'font-family:Comfortaa,sans-serif',
      'font-size:22px',
      'font-weight:700',
      'padding:18px 36px',
      'border-radius:24px',
      'box-shadow:0 6px 24px rgba(0,0,0,0.25)',
      'text-align:center',
      'pointer-events:none',
      'opacity:1',
      'transition:opacity 0.5s ease',
      'white-space:nowrap',
      'z-index:9999'
    ].join(';');
    if (activeScreen) activeScreen.appendChild(notBanner);
    setTimeout(function() { notBanner.style.opacity = '0'; }, 2500);
    setTimeout(function() { if (notBanner.parentNode) notBanner.remove(); }, 3100);
    return;
  }
  var name = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : 'reward';
  pointScore -= cost;
  updateScoreDisplays();
  showClaimedBanner(name);
}

function showClaimedBanner(name) {
  var overlay = document.getElementById('toastOverlay');
  var activeScreen = document.querySelector('.screen:not(.hidden)');
  var confettiTarget = activeScreen || overlay;

  // Confetti
  var colors = ['#fdc2a4','#f9b234','#c0522a','#5e2910','#fff','#ffde9e'];
  for (var i = 0; i < 60; i++) {
    (function(i) {
      var piece = document.createElement('div');
      var size = 8 + Math.random() * 8;
      var startX = Math.random() * 393;
      var delay = Math.random() * 600;
      var duration = 1200 + Math.random() * 1000;
      var color = colors[Math.floor(Math.random() * colors.length)];
      var rotate = Math.random() * 360;
      piece.style.cssText = [
        'position:absolute',
        'left:' + startX + 'px',
        'top:-20px',
        'width:' + size + 'px',
        'height:' + (size * (Math.random() > 0.5 ? 1 : 0.4)) + 'px',
        'background:' + color,
        'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
        'opacity:1',
        'pointer-events:none',
        'z-index:9999',
        'transform:rotate(' + rotate + 'deg)',
        'transition:none'
      ].join(';');
      confettiTarget.appendChild(piece);
      setTimeout(function() {
        piece.style.transition = 'top ' + duration + 'ms ease-in, opacity 300ms ease ' + (duration - 300) + 'ms';
        piece.style.top = (700 + Math.random() * 200) + 'px';
        piece.style.opacity = '0';
      }, delay);
      setTimeout(function() { if (piece.parentNode) piece.remove(); }, delay + duration + 400);
    })(i);
  }

  // Banner
  var banner = document.createElement('div');
  banner.textContent = name + ' claimed!';
  banner.style.cssText = [
    'position:absolute',
    'top:320px',
    'left:50%',
    'transform:translateX(-50%)',
    'background:#fdc2a4',
    'color:#5e2910',
    'font-family:Comfortaa,sans-serif',
    'font-size:22px',
    'font-weight:700',
    'padding:18px 36px',
    'border-radius:24px',
    'box-shadow:0 6px 24px rgba(0,0,0,0.25)',
    'text-align:center',
    'pointer-events:none',
    'opacity:1',
    'transition:opacity 0.5s ease',
    'white-space:nowrap',
    'z-index:9999'
  ].join(';');
  confettiTarget.appendChild(banner);
  setTimeout(function() { banner.style.opacity = '0'; }, 2500);
  setTimeout(function() { if (banner.parentNode) banner.remove(); }, 3100);
}

function initRewards() {
  addReward(); addReward(); addReward();
}

// ===== NOTIFICATIONS =====
var _notifiedTimes = {};

var _taskNotifications = [];

initAllTabs();
initRewards();

function checkTaskNotifications() {
  var now = new Date();
  var hh = String(now.getHours()).padStart(2, '0');
  var mm = String(now.getMinutes()).padStart(2, '0');
  var currentTime = hh + ':' + mm;

  _taskNotifications.forEach(function(task) {
    var input = document.getElementById(task.id);
    if (!input || !input.value) return;
    var key = task.id + '_' + input.value;
    if (input.value === currentTime && !_notifiedTimes[key]) {
      _notifiedTimes[key] = true;
      showToast(task.title, task.body);
      if (Notification.permission === 'granted') {
        new Notification(task.title, { body: task.body, icon: 'images/buddyicon.png' });
      }
    }
    if (input.value !== currentTime && _notifiedTimes[key]) {
      delete _notifiedTimes[key];
    }
  });
}

function showToast(title, body) {
  var overlay = document.getElementById('toastOverlay');
  var toast = document.createElement('div');
  toast.innerHTML = '<strong>' + title + '</strong><br>' + body;
  toast.style.cssText = [
    'position:absolute',
    'top:' + (24 + overlay.childElementCount * 80) + 'px',
    'background:#5c3d2a',
    'color:#fdc2a4',
    'font-family:Comfortaa,sans-serif',
    'font-size:15px',
    'padding:14px 22px',
    'border-radius:16px',
    'box-shadow:0 4px 16px rgba(0,0,0,0.35)',
    'text-align:center',
    'pointer-events:none',
    'opacity:1',
    'transition:opacity 0.5s ease',
    'white-space:nowrap'
  ].join(';');
  overlay.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; }, 4000);
  setTimeout(function() {
    if (toast.parentNode) toast.remove();
    // Restack remaining toasts
    Array.from(overlay.children).forEach(function(t, i) {
      t.style.top = (24 + i * 80) + 'px';
    });
  }, 4600);
}

if ('Notification' in window) {
  Notification.requestPermission();
}
setInterval(checkTaskNotifications, 1000);
