
log = -> console.log arguments...
put = (it) -> log it
delay = (f, t) -> setTimeout t, f
q = (query) -> document.querySelector query
Node.prototype.q = (query) -> @querySelector query
NodeList.prototype.map = (f) ->
  Array.prototype.map.call @, f
String.prototype.__defineGetter__ "num", ->
  match = @.match /\d+/
  if match? then Number match[0] else 0

random = -> (Math.random() * 600).toFixed()

at_sight = undefined

memory = {}
remember = -> localStorage.memory = JSON.stringify memory
if localStorage.memory? then try memory = JSON.parse localStorage.memory

window.onload = ->
  svg = q "svg"
  ctrl = q "#ctrl"
  point = q "#point"
  path = q "#path"

  svg.setAttribute "width", 800
  svg.setAttribute "height", 600

  [0...20].forEach (n) ->
    elem = lilyturf.dom ->
      @div id: "p#{n}",
        @text n
        @span class: "x", (@text random())
        @span class: "y", (@text random())
    ctrl.appendChild elem

  ctrl.onclick = (click) ->
    elem = click.target
    id = elem.id
    read = id.match /p(\d+)/
    unless read
      elem = elem.parentElement
      id = elem.id
      read = id.match /p(\d+)/
    if read
      n = read[1]
      sight = q ".sight"
      at_sight = id
      if sight? then sight.className = ""
      elem.className = "sight"

  svg.onmousemove = (move) ->
    x = move.offsetX
    y = move.offsetY
    point.q(".x").innerText = x
    point.q(".y").innerText = y
    draw at_sight

  svg.onclick = (click) ->
    x = click.offsetX
    y = click.offsetY
    log "at_sight when click svg", at_sight
    if at_sight?
      q("##{at_sight}").q(".x").innerText = x
      q("##{at_sight}").q(".y").innerText = y
      memory[at_sight] = {x, y}
      remember()
      draw()
      log at_sight, click

  svg.onmouseout = -> draw()

  Object.keys(memory).map (key) ->
    sight = q "##{key}"
    if sight?
      sight.q(".x").innerText = memory[key].x
      sight.q(".y").innerText = memory[key].y

  draw = (special) ->
    line_list = []
    ctrl.childNodes.map (elem) ->
      line_list[elem.id.num] =
        x: elem.q(".x").innerText.num
        y: elem.q(".y").innerText.num
    # log line_list
    if special?
      line_list[special.num] =
        x: point.q(".x").innerText.num
        y: point.q(".y").innerText.num
    fisrt = line_list.shift()
    second = line_list.shift()
    third = line_list.shift()
    p = "M #{fisrt.x} #{fisrt.y} Q #{second.x} #{second.y} #{third.x} #{third.y}"
    line_list.forEach (axis) ->
      p += " T #{axis.x} #{axis.y}"
    path.setAttribute "d", p

  draw()