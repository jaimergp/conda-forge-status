function loadVersionJSON (url, callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', url, true)
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      // Required use of an anonymous callback as .open will NOT
      // return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}

function toggleVersionVisibilityHandler (ident) {
  var x = document.getElementById(ident)
  if (x.style.display === 'none') {
    x.style.display = 'block'
  } else {
    x.style.display = 'none'
  }
}

function createToggleVersionVisibilityHandler (ident) {
  return function () {
    var x = document.getElementById(ident)
    if (x.style.display === 'none') {
      x.style.display = 'block'
    } else {
      x.style.display = 'none'
    }
  }
}

function versionListing (jsonData) {
  var versionData = JSON.parse(jsonData)
  var parent = document.getElementById('versionDiv')
  var sections = ['queued', 'errored']

  parent.innerHTML =
    'There are currently ' +
    versionData.queued.length +
    ' queued and ' +
    versionData.errored.length +
    ' errored version updates.</br></br>'

  // show status buttons
  for (var sind = 0; sind < sections.length; sind++) {
    var section = sections[sind]
    var statusListId = parent.id + section + 'List'
    var button = document.createElement('button')
    parent.appendChild(button)
    button.innerHTML = section
    button.onclick = createToggleVersionVisibilityHandler(statusListId)
    var statusList = document.createElement('ul')
    parent.appendChild(statusList)
    statusList.setAttribute('id', statusListId)

    var feedstockNames = []
    for (var j = 0; j < versionData[section].length; j++) {
      feedstockNames.push(versionData[section][j])
    }
    feedstockNames.sort()

    for (var i = 0; i < feedstockNames.length; i++) {
      var statusItem = document.createElement('li')
      var feedstockName = feedstockNames[i]
      var innerHtml = ''
      innerHtml +=
        '<a href="https://github.com/conda-forge/' + feedstockName + '-feedstock/blob/master/recipe/meta.yaml">' +
        '<b>' + feedstockName + '</b>' +
        '</a>'

      if (section === 'errored') {
        var errorID = feedstockName + '-ver-error'

        innerHtml += ': <a onclick="toggleVersionVisibilityHandler(\'' + errorID + '\')">click for details</a>'

        innerHtml +=
          '<pre style="white-space: pre-wrap; border-left:.0rem; display: none;" id="' + errorID + '">' +
          versionData.errors[feedstockName] +
          '</pre>'
      }

      statusItem.innerHTML = innerHtml
      statusList.appendChild(statusItem)
    }
    statusList.style.display = 'none'
  }
};

var url = 'https://raw.githubusercontent.com/regro/cf-graph-countyfair/master/status/version_status.json'
loadVersionJSON(url, versionListing)
