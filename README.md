rockrockrock – Audio-Playlist-Player
============

>v.0.2

rockrockrock is a simple jQuery-powered audio-player which converts a list of links to MP3-files into a playlist-enabled HTML-audio-player.

## Features
* Supports MP3 and optionally OGG (files need to have the same basename to work)
* Supports Play/Pause, Next/Prev, Mute/Unmute-Buttons and Time- and Volume-Slider
* Custom Events for Play/Pause, Next/Prev and Mute/Unmute
* Callback function on song loaded
* All control elements are optional
* All CSS-Class-Names follow the BEM methodology

## Settings
* prefix: 'rock', // Prefix for the CSS-classes used for the control elements
* current: 0, // Zero-based item which is selected on load
* ogg: false, // Search for identically named OGG-file and add to sources
* fadeTempo: 500, // Speed in ms for fading out and in on mute/unmute
* keyboard: false // Keboard-support for play/pause (spacebar) and prev/next title (left and right)
* callback: function which gets called after current song is loaded

All possible elements are shown in the index.html with basic CSS-styling. None of the styles are needed for the plugin to work.

## Requirements
* Browser-support for the HTML5-audio-element
* jQuery 2 (1.7+ should work as well, not tested)

## Browser Support
Successfully tested in:
* Latest Chrome
* Latest Firefox
* Latest Safari
* IE 9–11
* Safari for iOS
* Chrome for iOS
* Chrome for Android 4.3

Appearently not fully working in Android browser 4.3.