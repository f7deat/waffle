// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
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