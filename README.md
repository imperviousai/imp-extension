# imp-extension 

> Currently, the extension is in ALPHA. It is not production ready yet. 

---

The extension is designed to be used along side a running Impervious daemon. Which can be found [here](https://github.com/imperviousai/imp-daemon/). If a daemon is not running on the system, the extension will display a "Network Error" message as it cannot detect the daemon listening.

## Installing

#### Install Verified Extension

Download the verified extension from Releases (a .xpi file) and drag and drop the extension into a Firefox window. Otherwise, you can perform the following:

1. Visit [about:addons](about:addons)
2. Click the "gear" icon at the top to open the dropdown
3. Select "Install Add-on From File"
4. Select the .xpi file

#### Temporarily Install from an Unverified Build

Bundle the extension from within the project directory, producing a .zip file called `impervious-extension.zip`. 

```
yarn bundle
```

#### Temporarily Loading the Extension in Firefox

Using Firefox, you can temporarily load the extension:

1. Go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) in URL
2. Click "Load Temporary Add-on..." 
3. Select .zip file
4. Create a new tab to see the extension

## Developing

Install the dependencies

```
yarn
``` 

Launch development server

```
yarn dev
```

Visit [localhost:3001](localhost:3001) to view the application. 

#### Adjusting ports

If you want to change the port number before launching (i.e. to deploy two applications), edit the package.json file to launch the development server on another port. 

```
$ vim package.json
...
  "scripts": {
    "dev": "next dev -p 3001", <-- modify this port
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "bundle": "./bundle.sh"
  },
...
```

If you have changed the HTTP listening address on the daemon, say to connect the second application to the second daemon, modify the `utils/axios-utils.js` file to the appropriate port before launching. 


```
$ vim utils/axios-utils.js
...
export const PORT = 8882; <-- modify this port
...
```

After these are adjusted, you can launch the development server again using `yarn dev`. 


## TODO

- [ ] Configure manifest.json for the extension to work on Chrome instances
