// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBNgoRg6hDCWAXustyhjoeJIHVO-iCi8X0",
    authDomain: "logoquiz-79e61.firebaseapp.com",
    databaseURL: "https://logoquiz-79e61.firebaseio.com",
    projectId: "logoquiz-79e61",
    storageBucket: "logoquiz-79e61.appspot.com",
    messagingSenderId: "411215079824",
    appId: "1:411215079824:web:e8d66a3d93bd72e560ab15"


  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
