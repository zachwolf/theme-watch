#! /usr/bin/env node

//////////////
// REQUIRES //
//////////////

var prompt = require('prompt')
  , fse    = require('fs-extra')
  , path   = require('path')
  , colors = require('colors')
  , watch  = require('watch')

////////////////////
// LOCAL REQUIRES //
////////////////////

var asciiBorder = require('./asciiBorder')

///////////////
// MESSAGING //
///////////////

var message = {
      greeting: (function () {
        var lines = 'Welcome! theme-watch hopes to help\n'    +
                    'ease your wordpress theme development\n' +
                    '\n'                                      +
                    'What is the directory path you want\n'   +
                    'to watch?'

        return asciiBorder(lines) + '\n' + process.cwd().white + ' >'.green
      }()),
      copied: function (from, to) {
        return 'copied '.green + from + ' -> '.green + to
      },
      removed: function (from, to) {
        return 'removed '.red + from + ' -> '.red + to
      },
      waiting: function () {
        return 'Waiting for changes...'
      }
    }

////////////
// ACTION //
////////////

prompt.message = "";
prompt.delimiter = "";
prompt.start()

var actions = {
  remove: function (event) {
    var pathDiff = event.trigger.replace(event.observing, '').replace(/^[\\\/]/, '')
      , fromRemove = event.trigger
      , toRemove   = path.resolve(event.cwd, pathDiff)

    fse.remove(toRemove, function (err) {
      if (err) return console.error(err)

      console.log(message.removed(fromRemove, toRemove))
    })

  },
  copyBulk: function (event) {
    fse.readdir(event.observing, function (err, files) {
      if (err) return console.error(err)

      files.forEach(function (file) {
        var from = path.resolve(event.observing, file)
          , to   = path.resolve(event.cwd, file)

        fse.copy(from, to, function (err) {
          if (err) {
            return console.error(err)
          }

          console.log(message.copied(from, to))
        })

      })
    })
  },
  copySingle: function (event) {
    var pathDiff = event.trigger.replace(event.observing, '').replace(/^[\\\/]/, '')
      , from = event.trigger
      , to   = path.resolve(event.cwd, pathDiff)

    fse.copy(from, to, function (err) {
      if (err) {
        return console.error(err)
      }

      console.log(message.copied(from, to))
    })
  },
  default: function () {}
}

prompt.get([{
    name: 'path',
    description: message.greeting,
    type: 'string'
  }], function (err, results) {
  if (err) console.log('error', err)

  if (!results.path) return

  var _cwd  = process.cwd()
    , _path = path.resolve(_cwd, results.path)

  watch.watchTree(_path, function (f, curr, prev) {
    var action = 'default'

    if (typeof f == "object" && prev === null && curr === null) { // Finished walking the tree
      action = 'copyBulk'
    } else if (prev === null) { // f is a new file
      action = 'copySingle'
    } else if (curr.nlink === 0) { // f was removed
      action = 'remove'
    } else { // f was changed
      action = 'copySingle'
    }

    actions[action]({
      trigger: f,
      cwd: _cwd,
      observing: _path
    })
  })
      
})