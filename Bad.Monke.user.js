// ==UserScript==
// @name         Bad Monke
// @namespace    https://github.com/datagram-og/bad-monke
// @version      0.1
// @description  Hides chat messages from specified users on JungleTV.live
// @author       datagram

// @match        https://jungletv.live
// @icon         https://raw.githubusercontent.com/datagram-og/bad-monke/master/badmonke.png
// @grant         GM_getValue
// @grant         GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // day is used to store the day when a temporary blocklist was created
    var day = new Date().getDay();
    var blocklistTDay = window.localStorage.getItem("blocklistTDay");

    if (!blocklistTDay){
        window.localStorage.setItem("blocklistTDay", day);
    }

    var blocklistP = JSON.parse(window.localStorage.getItem("blocklistP"));
    var blocklistT = JSON.parse(window.localStorage.getItem("blocklistT"));

    // if the stored day is different from the current day value, purge the temporary blocklist and store the new day
    if (blocklistTDay != day){
        blocklistT = [];
        window.localStorage.setItem("blocklistT", JSON.stringify(blocklistT));
        window.localStorage.setItem("blocklistTDay", day);
    }

    // run the blocklist functions on an interval if the user already has blocklists
    if (blocklistP){
        var blocklistPinterval = setInterval(blockUsersP, 100);
    }
    if (blocklistT){
        var blocklistTinterval = setInterval(blockUsersT, 110);
    }


    function setBlockButton(){
        let flex = document.querySelector(".flex-1");
        let blockButton = document.createElement("button");
        blockButton.id = "blockuser";
        //blockButton.style = "margin-right:0.5rem";
        blockButton.innerHTML = "<img src=\"https://raw.githubusercontent.com/datagram-og/bad-monke/master/badmonke.png\" style=\"border-radius: 50%\" />";

        blockButton.onclick =
            function(){
                // these throw an error if the cancel button is clicked, but it doesn't matter, and we're lazy
                let nickname = prompt("Enter user to ignore:").toLowerCase();
                let duration = prompt("Enter [P]ermanent or [T]emporary:").toLowerCase();

                if(duration === "p" || duration === "permanent"){
                    if (!blocklistP){
                        blocklistP = [];
                    }
                    blocklistP.push(nickname);
                    window.localStorage.setItem("blocklistP", JSON.stringify(blocklistP));
                    clearInterval(blocklistPinterval);
                    blocklistPinterval = setInterval(blockUsersP, 100);
                }

                if (duration === "t" || duration === "temporary"){
                    if (!blocklistT){
                        blocklistT = [];
                    }
                    blocklistT.push(nickname);
                    window.localStorage.setItem("blocklistT", JSON.stringify(blocklistT));
                    clearInterval(blocklistTinterval);
                    blocklistTinterval = setInterval(blockUsersT, 110);
                }
            }
        // locate the dark mode toggle button that changes names every time the page is refreshed and then attach the button a few elements in front of it
        document.querySelector('[id^="toggle0"]').parentElement.parentElement.parentElement.prepend(blockButton);
    }

    function blockUsersP(){
        Object.values(blocklistP).forEach(
            function(nickname){
                [...document.querySelectorAll(".chat-user-nickname")].filter(a => a.innerText.trim().toLowerCase() === nickname).forEach(a => a.parentElement.parentElement.style.display = "none");
            });
    }

    function blockUsersT(){
        Object.values(blocklistT).forEach(
            function(nickname){
                [...document.querySelectorAll(".chat-user-nickname")].filter(a => a.innerText.trim().toLowerCase() === nickname).forEach(a => a.parentElement.parentElement.style.display = "none");
            });
    }

    setBlockButton();
})();