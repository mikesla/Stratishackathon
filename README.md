
## Install NodeJS

Download and install the latest Long Term Support (LTS) version of NodeJS at: https://nodejs.org/. 

## Getting Started

Clone this repository locally:

``` bash
git clone https://github.com/mikesla/Stratishackathon.git
```

Navigate to the StratisCore.UI folder in a terminal:
``` bash
cd ./StratisCore-1.3.1.0-hackathon/StratisCore.UI
```

## Install dependencies with npm:

From within the StratisCore.UI directory run:

``` bash
npm install
```

## Run the UI in development mode

#### 
install and  run   Cirrus Core (Hackathon Edition) app. It runs a node what we need to run this  version of app
https://academy.stratisplatform.com/SmartContracts/Tutorial1-LocalSidechain/creating-a-local-chain.html



#### Terminal Window
Use `npm run sidechain` to start the UI in sidechain mode
This will compile the Angular code and spawn the Electron process.

## Build the UI for production

|Command|Description|
|--|--|
|`npm run build:prod`| Compiles the application for production. Output files can be found in the dist folder |
|`npm run package:linux`| Builds your application and creates an app consumable on linux system |
|`npm run package:linuxarm`| Builds your application and creates an app consumable on linux-arm system (i.e., Raspberry Pi) |
|`npm run package:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run package:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

**The application is optimised. Only the files of /dist folder are included in the executable. Distributable packages can be found in the StratisCore.UI/app-builds/ folder**


