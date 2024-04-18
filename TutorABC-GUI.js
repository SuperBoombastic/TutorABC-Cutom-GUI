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

    // Initialize modifications when the document is ready
    $(document).ready(function() {
        initializeModifications();
        observeDOMChanges();
    });

    // Sets up initial modifications
    function initializeModifications() {
        applyDarkModeStyles();
        appendVolumeSliderToSpecificTools();
    }

    // Applies dark mode styles to various elements
    function applyDarkModeStyles() {
        const textColor = "#b9b9b9";
        const backgroundColor = "#4b4d50";

        // Apply text and background color
        $('.btn-item, .tool-item, .tab-title, .tab-item, .material-note-body, .comment').css("color", textColor);
        $('.comment-input').css("color", backgroundColor);
        $('.user-name-text').css("color", "white");
        $('.tool-item-icon').css({"width": "30px", "height": "30px", "user-select": "none"});

        // Apply background colors more extensively
        $('.body, .emoji-section, .header, .media-wrapper, .header-wrapper, .videolist-content, .vjs-poster, .toolbar-wrapper, .wb-tools, .media-wrapper, .col-resize, .board-sider, .whiteboard, .whiteboard-wrapper, .board-header, .tool-item, .app-container, .tab-wrapper, .tm-popover, .material-note-body, .material-note-header-tab, .avoid-reading-only, .chat-group, .comment, .chat-operation').css('background-color', backgroundColor);

        // Clear background images and hide certain elements
        $(".app-side").css("background-image", "url('')");
       //$(".tm-modal-wrap").hide();
       // $(".tm-modal-root").hide();
        $(".teacher-face-focus").hide();
        $(".emoji-section .body, .chat-input-wrapper, .comment, .comment-input").css({
            "background": backgroundColor + " !important"
        });
    }

    // Adds a volume slider to the specified tools area
    function appendVolumeSliderToSpecificTools() {
        if ($('#volumeSliderContainer').length === 0) {
            const sliderHTML = `
                <div id="volumeSliderContainer">
                    <input id="volumeSlider" type="range" min="0" max="100" value="100" style="width: 80px; vertical-align: middle;">
                    <div id="volumePercent">100%</div>
                </div>
            `;
            $('.board-header .tools').eq(0).append(sliderHTML);
            $('#volumeSlider').on('input', updateVolumeDisplay);
        }
    }

    // Updates the volume display and adjusts audio volume
    function updateVolumeDisplay() {
        const volume = $(this).val();
        $('#volumePercent').text(`${volume}%`);
        adjustAudioVolume(volume);
    }

    // Adjusts audio volume for media elements
    function adjustAudioVolume(volume) {
        const music = document.getElementById("materialAudio");
        if (music) {
            music.volume = volume / 100;
        }
    }

    // Observes DOM changes to reapply modifications as needed
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    applyDarkModeStyles();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
