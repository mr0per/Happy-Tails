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

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.add('hidden'); });
  var screen = document.getElementById(id);
  screen.classList.remove('hidden');

  // Re-trigger animations when buddy screen is shown
  if (id === 'buddyScreen') {
    var animated = screen.querySelectorAll('.buddy-animate, .bubble-animate');
    animated.forEach(function(el) {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    // Build word spans across fixed lines
    var buddyText = document.getElementById('buddyText');
    var lines = [
      { words: "Hey there Pal! Heard you got".split(' '), indent: 0 },
      { words: "a furry friend who needs some".split(' '), indent: 0 },
      { words: "taking care of.".split(' '), indent: 20 }
    ];
    buddyText.innerHTML = '';
    var allSpans = [];
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

    // Reveal words one by one starting after bubble appears (0.85s)
    allSpans.forEach(function(span, i) {
      setTimeout(function() {
        span.classList.add('visible');
      }, 850 + i * 80);
    });
  }
}

document.getElementById('beginBtn').addEventListener('click', function () {
  showScreen('buddyScreen');
});

document.getElementById('quitBtn').addEventListener('click', function () {
  window.close();
});

