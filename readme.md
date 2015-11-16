# Theme Watch

Pretty simple watch-n-copy files from one directory to the next. 

I don't want to structure my repo to meet Wordpress's folder structure, and alias directories don't seem to work (easily) as expected. This seems to be the easiest solution for the time being.

Something like this:

```
# file structure

/wordpress-theme
	/source
		/styles
			app.scss
	/build
		app.css
		index.php

/dev-install
	/wp-content
		/themes
			package.json
```

```bash
$ npm install -g theme-watch
$ cd ~/dev-install/wp-content/themes
$ theme-watch

+--------------------------------------------+
|                                            |
| Welcome! theme-watch hopes to help         |
| ease your wordpress theme development      |
|                                            |
| Where do you want to copy files from?      |
|                                            |
+--------------------------------------------+
> ~/wordpress-theme/build

+--------------------------------------------+
|                                            |
| Great, when any files in that              |
| directory change, they'll be copied here.  |
|                                            |
| Good luck! =^.^=                           |
|                                            |
+--------------------------------------------+

Watching `~/wordpress-theme/build`...
```

