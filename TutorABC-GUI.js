// ==UserScript==
// @name         ITUTOR LESSON
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Implements custom interface modifications for online teaching platforms.
// @author       You
// @match        https://www2.tutormeetplus.com/*
// @match        https://teach.itutorgroup.com/*
// @match        https://www5.tutormeet.com/*
// @match        https://teach.itutorgroup.com/Portal/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
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
        // Define colors for text and backgrounds
        const textColor = "#b9b9b9";
        const backgroundColor = "#4b4d50";

        // Apply text color
        $('.btn-item, .tool-item, .tab-title, .tab-item, .material-note-body, .comment').css("color", textColor);
        $('.comment-input').css("color", backgroundColor);

        // Set icon dimensions
        $('.tool-item-icon').css({"width": "30px", "height": "30px"});

        // Apply background colors
        $('.body, .emoji-section, .header, .media-wrapper, .header-wrapper, .videolist-content, .vjs-poster, .toolbar-wrapper, .wb-tools, .media-wrapper, .col-resize, .board-sider, .whiteboard, .whiteboard-wrapper, .board-header, .tool-item, .app-container, .tab-wrapper, .tm-popover, .material-note-body, .material-note-header-tab, .avoid-reading-only, .chat-group, .comment, .chat-operation').css('background-color', backgroundColor);

        // Clear any existing background images
        $(".app-side").css("background-image", "url('')");

        // Hide certain modal elements
        $(".tm-modal-body").hide();
        $(".emoji-section .body, .chat-input-wrapper, .comment, .comment-input").css({
            "background": backgroundColor + " !important"
        });
    }

    // Adds a volume slider to the specified tools area
    function appendVolumeSliderToSpecificTools() {
        // Check if the slider already exists to avoid duplicates
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
                    // Reapply styles to dynamically added elements
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
