# Liferay Theme Tasks [![Build Status](https://travis-ci.org/liferay/liferay-theme-tasks.svg?branch=master)](https://travis-ci.org/liferay/liferay-theme-tasks)

> The liferay-theme-tasks module is intended for use with the yeoman generator for [Liferay themes](https://github.com/liferay/generator-liferay-theme).

## Available tasks

-   [build](#build)
-   [deploy](#deploy)
-   [extend](#extend)
-   [kickstart](#kickstart)
-   [status](#status)
-   [watch](#watch)
-   [init](#init)

### Build

```
gulp build
```

The `build` task generates the base theme files, compiles sass into css, and zips all theme files into a .war file, ready to be deployed to a Liferay server.

### Deploy

```
gulp deploy
```

The deploy initially runs the `build` task, and once the .war file has been created it deploys to the specified local appserver.

If you want to deploy to a live site, use the `--live` flag to deploy to a remote server.

```
gulp deploy --live
```

Note that the specified server must have the [server-manager-web](https://github.com/liferay/liferay-plugins/tree/master/webs/server-manager-web) plugin deployed. The `--live` flag will deploy to the remote server specified in the [init](#init) task.

If you want to deploy to a different server without changing the default server specified in [init](#init), you may use the `--url` flag.

```
gulp deploy --live --url http://some-host.com
```

You may also specify your login credentials using the `-u`/`--username` and `-p`/`--password` flags.

```
gulp deploy --live -u test@liferay.com -p test
```

**Note:** the `deploy --live` task is not currently working for Liferay 7.0 as the `server-manager-web` plugin has not been migrated to work with OSGi.

### Extend

```
gulp extend
```

The `extend` task is what allows you to specify what base theme you are extending from. By default, themes created with the [theme generator](https://github.com/natecavanaugh/generator-liferay-theme) will base off the [styled theme](https://www.npmjs.com/package/liferay-frontend-theme-styled).

You first are prompted if you want to extend a Base theme or Themelet, then you will be prompted for where you would like to search for modules. `Globally installed npm modules` will search npm modules that have been installed on your computer with the `-g` flag. Selecting `npm registry` will search for published modules on npm.

Once it gives you the options and you make your selection, it will add any selected modules to your package.json under dependencies and run `npm install`.

### Kickstart

```
gulp kickstart
```

The `kickstart` task allows you to copy the css, images, js, and templates from another theme into the src directory of your own. This allows you to quickly get up and running with a production ready theme.

`kickstart` is similar to `extend`. The difference is that kickstarting from another theme is a one time inheritance, while extending from another theme is a dynamic inheritance that applies your src files on top of the base theme on every build.

### Status

```
gulp status
```

Displays what base theme/themelets your theme is extending.

### Watch

```
gulp watch
```

The watch task allows you to see the changes you make to your theme without a full redeploy.

After invoking the watch task, every time you save any changes to a file in your theme it compiles (if applicable) and copies it directly to your appserver.

### Init

```
gulp init
```

Prompts user for local and remote appserver information used for deployment purposes (see [deploy](#deploy) task).

## API

### registerTasks

To register the liferay-theme-tasks you must call the `registerTasks` method in your theme's gulpfile.js, `gulp` being the only required parameter.

```js
var gulp = require('gulp');
var liferayThemeTasks = require('liferay-theme-tasks');

liferayThemeTasks.registerTasks({
	gulp: gulp,
});
```

#### Options

##### distName

type: `string`<br>
required: `false`

The name that will be given to the generated war file. The `distName` can also be a template which has access to the theme's `package.json` fields.

```js
liferayThemeTasks.registerTasks({
	distName: '${name}-${version}',
	gulp: gulp,
});

// my-theme-1.0.0
```

**Note:** in 7.0 changing the war file name will also affect the context path of the theme when using `gulp deploy` which can result in having multiple versions of your theme deployed at the same time.

##### gulp

type: `gulp instance`<br>
required: `true`

A gulp instance for exposing liferay-theme-tasks.

##### hookFn

type: `function`

Allows theme developers to hook and overwrite tasks/sub tasks.

```js
var gulp = require('gulp');
var liferayThemeTasks = require('liferay-theme-tasks');

liferayThemeTasks.registerTasks({
	gulp: gulp,
	hookFn: function (gulp) {
		gulp.hook('before:build:src', function (done) {
			// Fires before build:src task
		});

		gulp.hook('after:build', function (done) {
			// Fires after build task
		});

		gulp.task('build:base', function (done) {
			// Overwrites build:base task
		});
	},
});
```

Note: `hook` callback function must invoke `done` argument OR return a stream.

##### pathBuild

type: `string`<br>
default: `./build`

Determines the destination of built files.

Must be in POSIX format (i.e: use / instead of \\).

##### pathDist

type: `string`<br>
default: `./dist`

Determines the destination of the generated .war file.

Must be in POSIX format (i.e: use / instead of \\).

##### pathSrc

type: `string`<br>
default: `./src`

Determines where theme source files are located. If set to anything other than default value, you must manually relocate all files in src directory to new location.

Must be in POSIX format (i.e: use / instead of \\).

##### postcss

type: `array`<br>

Specifies a list of [PostCSS](https://postcss.org/) plugins to run on the compiled CSS after the SASS compilation

##### sassOptions

type: `object`

Whatever properties are set in sassOptions get passed to [node-sass](https://github.com/sass/node-sass/tree/99242d756d746c6f3c01f39ff081b08f979d3975#options).

## liferayTheme

The `liferayTheme` object is located in a theme's package.json file and contains various options that relate to the gulp tasks.

```JSON
{
	"name": "my-liferay-theme",
	"version": "1.0.0",
	"main": "package.json",
	"keywords": [
		"liferay-theme"
	],
	"liferayTheme": {
		"baseTheme": "styled",
		"templateLanguage": "ftl",
		"version": "7.0"
	},
	"devDependencies": {
		"gulp": "^3.8.10",
		"liferay-theme-deps-7.1": "*",
		"liferay-theme-tasks": "*"
	}
}
```

### baseTheme

Determines the base theme. This property is set by the `extend` task.

### hookModules

The name or names of npm modules. These modules must expose a function that follows the same pattern as a [hookFn](#hookFn).

If a module is listed in `hookModules`, it must also be added to the `devDependencies` of the theme.

### themelets

Determines the themelets that are implemented by this theme. This property is set by the `extend` task.

### version

Version of Liferay Portal this theme is intended for.

## Disabling Dart Sass

Liferay Theme Tasks 11.x uses Dart Sass by default. Dart Sass has introduced some [breaking changes](https://sass-lang.com/documentation/breaking-changes) that causes builds of older themes (e.g., 7.3) to fail. The workaround to this is to revert back to using Libsass.

Node Version 12+

In `package.json`:

```
{
	"liferayTheme": {
		"sassOptions": {
			"dartSass": false
		}
	},
	"devDependencies": {
		"node-sass": "7.0.1"
	}
}
```

Then in the terminal:

```
npm install
```

## Additional Theme Dependencies

In order for themes to successfully build, they must declare additional dependencies in their `package.json` file such as [liferay-frontend-theme-unstyled](https://www.npmjs.com/package/liferay-frontend-theme-unstyled) and [liferay-frontend-theme-styled](https://www.npmjs.com/package/liferay-frontend-theme-styled).

If you would like to require specific versions of these dependencies, specify them directly in your theme's `package.json` file and `npm install` afterwards.

### Updating Dependencies via CLI

Get the latest `liferay-frontend-theme-unstyled`:

```
npm install --save-dev --save-exact liferay-frontend-theme-unstyled@latest
```

Get the latest `liferay-frontend-theme-styled`:

```
npm install --save-dev --save-exact liferay-frontend-theme-styled@latest
```

### Get the Right Dependency Version for Your Theme

| Liferay | [liferay-frontend-theme-unstyled](https://www.npmjs.com/package/liferay-frontend-theme-unstyled) | [liferay-frontend-theme-styled](https://www.npmjs.com/package/liferay-frontend-theme-styled) |
| ------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 7.4.x   | 6.x.x                                                                                            | 6.x.x                                                                                        |
| 7.3.x   | 5.x.x                                                                                            | 5.x.x                                                                                        |
| 7.2.x   | 4.x.x                                                                                            | 4.x.x                                                                                        |
| 7.1.x   | 3.x.x                                                                                            | 3.x.x                                                                                        |
| 7.0.x   | 2.x.x                                                                                            | 2.x.x                                                                                        |

MIT
