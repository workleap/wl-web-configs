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
and_chr 154
and_ff 157
android 154
chrome 154
chrome 153
chrome 152
chrome 151
chrome 150
chrome 149
chrome 148
chrome 145
chrome 144
chrome 142
chrome 120
chrome 119
chrome 118
chrome 109
edge 154
edge 153
edge 152
edge 151
edge 150
edge 120
edge 119
firefox 157
firefox 156
firefox 154
firefox 153
firefox 121
firefox 120
ios_saf 27.0
ios_saf 26.6
ios_saf 26.5
ios_saf 26.4
ios_saf 26.3
ios_saf 26.2
ios_saf 18.5-18.7
ios_saf 16.6-16.7
ios_saf 15.6-15.8
op_mob 80
opera 135
opera 134
opera 133
safari 27
safari 26.6
safari 26.5
safari 18.5-18.7
samsung 30
samsung 29
```
