---
label: Configure a project
meta:
    title: Configure a project - Browserslist
---

# Configure a project

> Only setup [Browserslist](https://browsersl.ist/) for projects that are **emitting application bundles**. For example, a library project shouldn't include Browserslist but a web application project should.

## Install the packages

Open a terminal at the root of the project and install the following packages:

```bash
pnpm add -D @workleap/browserslist-config browserslist
```

## Configure Browserslist

First, create a configuration file named `.browserslistrc` at the root of the project:

``` !#5
web-project
├── src
├──── ...
├── package.json
├── .browserslistrc
```

Then, open the newly created file and extend the default configuration with the shared configuration provided by `@workleap/browserslist-config`:

``` .browserslistrc
extends @workleap/browserslist-config
```

## Support custom browsers

If you are encountering a situation that is not currently handled by `@workleap/browserslist-configs`, you can customize your configuration file to extend this library shared configurations with additional browser versions:

``` !#2-3 .browserslistrc
extends @workleap/browserslist-config
IE 11
last 2 OperaMobile 12.1 versions
```

Refer to the [Browserslist documentation](https://github.com/browserslist/browserslist#full-list) for a full list of available queries.

## Try it :rocket:

To test your new Browserslist configuration, open a terminal at the root of the project and execute the following command:

```bash
pnpm browserslist
```

A list of the selected browser versions should be outputted to the terminal:

``` An example of the outputted browser versions (you won't get exactly this)
and_chr 114
and_ff 113 
and_qq 13.1
and_uc 13.4
android 114
android 4.4.3-4.4.4
chrome 114
chrome 113
chrome 112
chrome 111
chrome 110
chrome 109
chrome 108
chrome 103
chrome 79
edge 114
edge 113
edge 112
firefox 113
firefox 112
firefox 102
ios_saf 16.5
ios_saf 16.4
ios_saf 16.3
ios_saf 16.2
ios_saf 16.1
ios_saf 16.0
ios_saf 15.6
ios_saf 15.5
ios_saf 14.5-14.8
ios_saf 14.0-14.4
ios_saf 12.2-12.5
kaios 3.0-3.1
kaios 2.5
op_mini all
op_mob 73
opera 99
opera 98
opera 97
safari 16.5
safari 16.4
safari 16.3
safari 16.2
safari 16.1
safari 15.6
safari 15.5
safari 14.1
samsung 21
samsung 20
```
