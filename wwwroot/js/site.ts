import Collapse from "./collapse/index.js";

Collapse.init();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register("/serviceWorker.js", {
                scope: '.'
            })
            .then(res => console.log("🍀 Service Worker registered!"))
            .catch(err => console.log("🔥 Service Worker not registered", err))
    })
}