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

    // Set the default theme of the UI
    let isDarkMode = true; // Default mode is dark

    // Executes when the document is fully loaded
    $(document).ready(function() {
        initializeModifications(); // Setup initial UI modifications
        observeDOMChanges(); // Setup observer to handle DOM changes dynamically
    });

    // Initialize all modifications when the page loads
    function initializeModifications() {
        applyDarkModeStyles(); // Apply dark mode styles initially
        appendVolumeSliderToSpecificTools(); // Add volume control slider
        appendStyleToggleButton(); // Add a toggle button for switching themes
        updateToggleButton(); // Set the initial text for the toggle button
    }

    // Append a volume slider to specific elements on the page
    function appendVolumeSliderToSpecificTools() {
        // Check if the slider is not already added
        if ($('#volumeSliderContainer').length === 0) {
            // HTML structure for the volume slider
            const sliderHTML = `
                <div id="volumeSliderContainer" style="display: inline-block;">
                    <input id="volumeSlider" type="range" min="0" max="100" value="100" style="width: 80px; vertical-align: middle;">
                    <div id="volumePercent">100%</div>
                </div>
            `;
            // Append the slider HTML to the first tool in the board header
            $('.board-header .tools').eq(0).append(sliderHTML);
            // Attach an event listener to update the display when the slider value changes
            $('#volumeSlider').on('input', updateVolumeDisplay);
        }
    }

    // Adds a toggle button to the interface for changing styles
    function appendStyleToggleButton() {
        // HTML structure for the style toggle button
        const toggleButtonHTML = `
            <div id="toggleStyleContainer" style="display: inline-block; margin-left: 20px;">
                <button id="styleToggleButton" style="border: 1px solid #ccc; border-radius: 8px; padding: 5px 10px; cursor: pointer; transition: background-color 0.3s ease; font-weight: bold;">Light Mode</button>
            </div>
        `;
        // Append the button HTML to the first tool in the board header
        $('.board-header .tools').eq(0).append(toggleButtonHTML);
        // Attach an event listener to toggle the styles when clicked
        $('#styleToggleButton').on('click', function() {
            toggleStyles();
            updateToggleButton();
        });
    }

    // Updates the text on the style toggle button based on the current mode
    function updateToggleButton() {
        const button = $('#styleToggleButton');
        // Update the button text based on whether it is dark mode or not
        button.text(isDarkMode ? 'Light Mode' : 'Dark Mode');
        // Update the button's styling based on the current theme
        button.css({'background-color': isDarkMode ? '#333' : '#fff', 'color': isDarkMode ? '#bbcbff' : '#333'});
    }

    // Toggle between light and dark styles
    function toggleStyles() {
        if (isDarkMode) {
            applyLightModeStyles(); // Apply light mode styles if currently in dark mode
        } else {
            applyDarkModeStyles(); // Apply dark mode styles if currently in light mode
        }
        // Toggle the mode
        isDarkMode = !isDarkMode;
    }

    // Apply styles for dark mode
    function applyDarkModeStyles() {
        const textColor = "#bbcbff"; // Dark mode text color updated
        const backgroundColor = "#4b4d50"; // Dark mode background color
        applyStyles(textColor, backgroundColor);
    }

    // Apply styles for light mode
    function applyLightModeStyles() {
        const textColor = "#000000"; // Light mode text color
        const backgroundColor = "#FFFFFF"; // Light mode background color
        applyStyles(textColor, backgroundColor);
    }

    // Apply the given text and background color styles to various elements
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

    // Updates the volume display based on the slider's position
    function updateVolumeDisplay() {
        const volume = $(this).val();
        $('#volumePercent').text(`${volume}%`);
        adjustAudioVolume(volume);
    }

    // Adjust the volume of the audio elements based on the slider's value
    function adjustAudioVolume(volume) {
        const music = document.getElementById("materialAudio");
        if (music) {
            music.volume = volume / 100;
        }
    }

    // Observes changes to the DOM and applies modifications if necessary
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Check if new nodes were added to the DOM
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Reapply the appropriate styles based on the current theme
                    if (isDarkMode) {
                        applyDarkModeStyles();
                    } else {
                        applyLightModeStyles();
                    }
                }
            });
        });

        // Set up the observer to watch for changes in the child list and subtree of the body element
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
