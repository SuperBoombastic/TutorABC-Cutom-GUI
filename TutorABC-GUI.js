// ==UserScript==
// @name         ITUTOR LESSON
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Implements custom interface modifications for online teaching platforms.
// @author       You
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www2.tutormeetplus.com/*
// @match        https://teach.itutorgroup.com/*
// @match        https://www5.tutormeet.com/*
// @match        https://teach.itutorgroup.com/Portal/*
// ==/UserScript==

(function() {
    'use strict';

    let isDarkMode = true; // Default mode is dark

    $(document).ready(function() {
        initializeModifications();
        observeDOMChanges();
    });

    function initializeModifications() {
        applyDarkModeStyles();
        appendVolumeSliderToSpecificTools();
        appendStyleToggleButton();
        updateToggleButton();
    }

    function appendVolumeSliderToSpecificTools() {
        if ($('#volumeSliderContainer').length === 0) {
            const sliderHTML = `
                <div id="volumeSliderContainer" style="display: inline-block;">
                    <input id="volumeSlider" type="range" min="0" max="100" value="100" style="width: 80px; vertical-align: middle;">
                    <div id="volumePercent">100%</div>
                </div>
            `;
            $('.board-header .tools').eq(0).append(sliderHTML);
            $('#volumeSlider').on('input', updateVolumeDisplay);
        }
    }

    function appendStyleToggleButton() {
        const toggleButtonHTML = `
            <div id="toggleStyleContainer" style="display: inline-block; margin-left: 20px;">
                <button id="styleToggleButton" style="border: 1px solid #ccc; border-radius: 8px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; font-weight: bold;">Light Mode</button>
            </div>
        `;
        $('.board-header .tools').eq(0).append(toggleButtonHTML);
        $('#styleToggleButton').on('click', function() {
            toggleStyles();
            updateToggleButton();
        });
    }

    function updateToggleButton() {
        const button = $('#styleToggleButton');
        button.text(isDarkMode ? 'Light Mode' : 'Dark Mode');
        button.css({'background-color': isDarkMode ? '#333' : '#fff', 'color': isDarkMode ? '#bbcbff' : '#333'});
    }

    function toggleStyles() {
        if (isDarkMode) {
            applyLightModeStyles();
        } else {
            applyDarkModeStyles();
        }
        isDarkMode = !isDarkMode;
    }

    function applyDarkModeStyles() {
        const textColor = "#bbcbff"; // Dark mode text color updated
        const backgroundColor = "#4b4d50";
        applyStyles(textColor, backgroundColor);
    }

    function applyLightModeStyles() {
        const textColor = "#000000";
        const backgroundColor = "#FFFFFF";
        applyStyles(textColor, backgroundColor);
    }

    function applyStyles(textColor, backgroundColor) {
        $('.btn-item, .tool-item, .tab-title, .tab-item, .material-note-body, .comment').css("color", textColor);
        $('.comment-input').css("color", textColor);
        $('.user-name-text').css("color", textColor);
        $('.tool-item-icon').css({"width": "30px", "height": "30px", "user-select": "none"});
        $('.body, .emoji-section, .header, .media-wrapper, .header-wrapper, .videolist-content, .vjs-poster, .toolbar-wrapper, .wb-tools, .media-wrapper, .col-resize, .board-sider, .whiteboard, .whiteboard-wrapper, .board-header, .tool-item, .app-container, .tab-wrapper, .tm-popover, .material-note-body, .material-note-header-tab, .avoid-reading-only, .chat-group, .comment, .chat-operation').css('background-color', backgroundColor);
        $(".teacher-face-focus").hide();
        $(".emoji-section .body, .chat-input-wrapper, .comment, .comment-input").css({
            "background": backgroundColor + " !important"
        });
    }

    function updateVolumeDisplay() {
        const volume = $(this).val();
        $('#volumePercent').text(`${volume}%`);
        adjustAudioVolume(volume);
    }

    function adjustAudioVolume(volume) {
        const music = document.getElementById("materialAudio");
        if (music) {
            music.volume = volume / 100;
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    if (isDarkMode) {
                        applyDarkModeStyles();
                    } else {
                        applyLightModeStyles();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
