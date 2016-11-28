/*
  dom-ready
  ---------

  Loads the callback when the DOM is finish loading

============================================================================ */


function domReady(callback) {
  if (typeof callback !== 'function') {
    throw new Error('callback is not an error');
    return false;
  };

  const checkOne = document.readyState === "complete";
  const checkTwo = (document.readyState !== "loading" && !document.documentElement.doScroll);

  if (checkOne || checkTwo) {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}


export default domReady
