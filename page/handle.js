// Generated by CoffeeScript 1.4.0
var at_sight, delay, log, memory, put, q, random, remember;

log = function() {
  return console.log.apply(console, arguments);
};

put = function(it) {
  return log(it);
};

delay = function(f, t) {
  return setTimeout(t, f);
};

q = function(query) {
  return document.querySelector(query);
};

Node.prototype.q = function(query) {
  return this.querySelector(query);
};

NodeList.prototype.map = function(f) {
  return Array.prototype.map.call(this, f);
};

String.prototype.__defineGetter__("num", function() {
  var match;
  match = this.match(/\d+/);
  if (match != null) {
    return Number(match[0]);
  } else {
    return 0;
  }
});

random = function() {
  return (Math.random() * 600).toFixed();
};

at_sight = void 0;

memory = {};

remember = function() {
  return localStorage.memory = JSON.stringify(memory);
};

if (localStorage.memory != null) {
  try {
    memory = JSON.parse(localStorage.memory);
  } catch (_error) {}
}

window.onload = function() {
  var ctrl, draw, path, point, svg;
  svg = q("svg");
  ctrl = q("#ctrl");
  point = q("#point");
  path = q("#path");
  svg.setAttribute("width", 800);
  svg.setAttribute("height", 600);
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].forEach(function(n) {
    var elem;
    elem = lilyturf.dom(function() {
      return this.div({
        id: "p" + n
      }, this.text(n), this.span({
        "class": "x"
      }, this.text(random())), this.span({
        "class": "y"
      }, this.text(random())));
    });
    return ctrl.appendChild(elem);
  });
  ctrl.onclick = function(click) {
    var elem, id, n, read, sight;
    elem = click.target;
    id = elem.id;
    read = id.match(/p(\d+)/);
    if (!read) {
      elem = elem.parentElement;
      id = elem.id;
      read = id.match(/p(\d+)/);
    }
    if (read) {
      n = read[1];
      sight = q(".sight");
      at_sight = id;
      if (sight != null) {
        sight.className = "";
      }
      return elem.className = "sight";
    }
  };
  svg.onmousemove = function(move) {
    var x, y;
    x = move.offsetX;
    y = move.offsetY;
    point.q(".x").innerText = x;
    point.q(".y").innerText = y;
    return draw(at_sight);
  };
  svg.onclick = function(click) {
    var x, y;
    x = click.offsetX;
    y = click.offsetY;
    log("at_sight when click svg", at_sight);
    if (at_sight != null) {
      q("#" + at_sight).q(".x").innerText = x;
      q("#" + at_sight).q(".y").innerText = y;
      memory[at_sight] = {
        x: x,
        y: y
      };
      remember();
      draw();
      return log(at_sight, click);
    }
  };
  svg.onmouseout = function() {
    return draw();
  };
  Object.keys(memory).map(function(key) {
    var sight;
    sight = q("#" + key);
    if (sight != null) {
      sight.q(".x").innerText = memory[key].x;
      return sight.q(".y").innerText = memory[key].y;
    }
  });
  draw = function(special) {
    var fisrt, line_list, p, second, third;
    line_list = [];
    ctrl.childNodes.map(function(elem) {
      return line_list[elem.id.num] = {
        x: elem.q(".x").innerText.num,
        y: elem.q(".y").innerText.num
      };
    });
    if (special != null) {
      line_list[special.num] = {
        x: point.q(".x").innerText.num,
        y: point.q(".y").innerText.num
      };
    }
    fisrt = line_list.shift();
    second = line_list.shift();
    third = line_list.shift();
    p = "M " + fisrt.x + " " + fisrt.y + " Q " + second.x + " " + second.y + " " + third.x + " " + third.y;
    line_list.forEach(function(axis) {
      return p += " T " + axis.x + " " + axis.y;
    });
    return path.setAttribute("d", p);
  };
  return draw();
};
