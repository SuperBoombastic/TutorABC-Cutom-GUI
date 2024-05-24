// ==UserScript==
// @name         ITUTOR LESSON
// @namespace    http://tampermonkey.net/
// @version      0.3
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

    // Set the default color theme
    let currentColorTheme = 'Dark'; // Default theme is Dark

    // Executes when the document is fully loaded
    $(document).ready(function() {
        setTimeout(function() {
            initializeModifications(); // Setup initial UI modifications after a delay
            observeDOMChanges(); // Setup observer to handle DOM changes dynamically
        }, 1000); // Delay in milliseconds
    });

    // Initialize all modifications when the page loads
    function initializeModifications() {
        applyColorThemeStyles(currentColorTheme); // Apply the default theme styles initially
        appendVolumeSliderToSpecificTools(); // Add volume control slider
        appendColorThemeDropdown(); // Add a dropdown for changing themes
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

    // Adds a dropdown to the interface for changing color themes
    function appendColorThemeDropdown() {
        // HTML structure for the color theme dropdown
        const dropdownHTML = `
            <div id="colorThemeContainer" style="display: inline-block; margin-left: 20px;">
                <select id="colorThemeDropdown" style="border: 1px solid #ccc; border-radius: 8px; padding: 5px; cursor: pointer;">
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="DarkGrey">Dark Grey</option>
                    <option value="LightGrey">Light Grey</option>
                </select>
            </div>
        `;
        // Append the dropdown HTML to the first tool in the board header
        $('.board-header .tools').eq(0).append(dropdownHTML);
        // Attach an event listener to change the styles when the selected option changes
        $('#colorThemeDropdown').on('change', function() {
            currentColorTheme = $(this).val();
            applyColorThemeStyles(currentColorTheme);
        });
    }

    // Apply styles for the selected color theme
    function applyColorThemeStyles(theme) {
        let textColor, backgroundColor;
        switch (theme) {
            case 'White':
                textColor = "#000000";
                backgroundColor = "#FFFFFF";
                break;
            case 'Black':
                textColor = "#FFFFFF";
                backgroundColor = "#000000";
                break;
            case 'DarkGrey':
                textColor = "#FFFFFF";
                backgroundColor = "#212121";
                break;
            case 'LightGrey':
                textColor = "#000000";
                backgroundColor = "#D3D3D3";
                break;
            default:
                textColor = "#FFFFFF";
                backgroundColor = "#000000";
                break;
        }
        applyStyles(textColor, backgroundColor);
    }

    // Apply the given text and background color styles to various elements
    function applyStyles(textColor, backgroundColor) {
        // Apply color properties
        const colorSelectors = '.btn-item, .tool-item, .tab-title, .tab-item, .material-note-body, .comment, .comment-input, .send-to, .user-name-text';
        $(colorSelectors).css("color", textColor);

        // Apply specific icon styles
        $('.tool-item-icon').css({
            "width": "30px",
            "height": "30px",
            "user-select": "none"
        });

        // Apply width to volume wrapper with important property handled
        $('.volume-wrapper').css("cssText", "width: 100% !important");
        $('.volume-item').css("cssText", "height: 6px !important; width: 100% !important;");

        // Apply background color properties
        const backgroundSelectors = '.body, .emoji-section, .header, .media-wrapper, .header-wrapper, .videolist-content, .vjs-poster, .toolbar-wrapper, .wb-tools, .media-wrapper, .col-resize, .board-sider, .whiteboard, .whiteboard-wrapper, .board-header, .tool-item, .app-container, .tab-wrapper, .tm-popover, .material-note-body, .material-note-header-tab, .avoid-reading-only, .chat-group, .comment, .chat-operation, .emoji-section .body, .chat-input-wrapper, .comment, .comment-input';
        $(backgroundSelectors).css("background-color", backgroundColor);

        // Hide elements
        $(".teacher-face-focus").hide();
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
                    applyColorThemeStyles(currentColorTheme);
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
