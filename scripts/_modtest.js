// file for testing the owot modules feature
use("./darkchat.js");

function hidden() {
    alert(document.origin);
}

function modtest() {
    console.log([isModule, modPrefixes]);
}

return { modtest };
