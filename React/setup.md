## Setup with React
- npm init
- install webpack and webpack-cli
- to use the latest JS features we need the babel packages `npm i --save-dev babel-loader @babel/polyfill @babel/core`

After the react dir is created with a demo index.jsx entry point file, we create the webpack.config.js
```
const path = require('path'),
webpack = require('webpack')

module.exports = {
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, 'public/react/index.jsx')
  ],
  output: {
    filename: 'javascript/bundle.js',
    path: path.resolve(__dirname, 'public/react')
  },
  mode: 'development',
  devtools: 'sourcemaps',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
```

We can then add the scripts to run webpack in our package.json
```
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch"
  },
```

Next we need to install the deps to get React working:
`npm i --save-dev react react-dom @babel/preset-env @babel/preset-react`

Next we want to add a .babelrc with both of these presets included
```
{
  "presets" : ["@babel/preset-env", "@babel/preset-react"]
}
```

By including `devtool: 'sourcemaps',` to the webpack config, we can view the source of our code and view the uncompiled code with `cntrl p` and then searching for the component we are looking for.

A starter package.json file is included below:
```
 "scripts": {
    "build": "webpack",
    "watch": "webpack --watch"
  },
  "devDependencies": {
    "@babel/core": "^7.18.0",
    "@babel/polyfill": "^7.12.1",
    "@babel/preset-env": "^7.18.0",
    "@babel/preset-react": "^7.17.12",
    "babel-loader": "^8.2.5",
    "react": "^18.1.0",
    "react-dom": "^18.1.0",
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2"
  }
```