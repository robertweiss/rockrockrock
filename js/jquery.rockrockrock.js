/*global console:true */

/*
 * RockRockRock
 * https://github.com/robertweiss/rockrockrock
 *
 * Copyright (c) 2014 Robert Weiss
 * Licensed under the MIT license.
 */

(function ($){

$.fn.rockrockrock = function(options) {

    // Settings
    var settings = $.extend({
        prefix: 'rock',
        current: 0,
        ogg: false,
        fadeTempo: 500
    }, options);

    // Audio-Element erzeugen
    var player = document.createElement('audio'),
        source = document.createElement('source');
    document.body.appendChild(player);
    player.appendChild(source);
    if (settings.ogg) {
        var source2 = document.createElement('source');
        player.appendChild(source2);
    }

    var setlist = this,
        activeSong = setlist.children(':eq('+settings.current+')'),
        infobox = $('.'+settings.prefix+'--playing'),
        btnPlay = $('.'+settings.prefix+'--play'),
        btnPause = $('.'+settings.prefix+'--pause'),
        btnNext = $('.'+settings.prefix+'--next'),
        btnPrev = $('.'+settings.prefix+'--prev'),
        btnMute = $('.'+settings.prefix+'--mute'),
        btnUnmute = $('.'+settings.prefix+'--unmute'),
        timeRange = $('.'+settings.prefix+'--timerange'),
        timePos = $('.'+settings.prefix+'--timeposition'),
        log = $('#log');

    var playSong = function() {
            player.play();
            $(btnPlay).hide();
            $(btnPause).show();
    },
        pauseSong = function() {
            player.pause();
            $(btnPause).hide();
            $(btnPlay).show();
    },
        nextSong = function() {
            var nextSong = $('.is-active').next();
            if (!nextSong.length) {
                nextSong = $('.is-active').siblings().first();
            }
            setSong(nextSong);
        },
        prevSong = function() {
            var prevSong = $('.is-active').prev();
            if (!prevSong.length) {
                prevSong = $('.is-active').siblings().last();
            }
            setSong(prevSong);
        },
        muteSong = function() {
            btnMute.hide();
            btnUnmute.show();
            $(player).animate({volume: 0}, settings.fadeTempo, function(){
                player.muted=true;
            });
    },
        unmuteSong = function() {
            btnUnmute.hide();
            btnMute.show();
            player.muted=false;
            $(player).animate({volume: 1}, settings.fadeTempo);
    };


// Checkt den aktuellen Status des Players
    var playerStatus = function() {
        if (player.paused) {
            if (player.currentTime === 0) {
                return 'stopped';

            } else {
                return 'paused';
            }
        } else {
            return 'playing';
        }
    };

// Togglet Play/Pause, wenn gleicher Song nochmal angeklickt wird
    var playOrPause = function(newSong, oldSong, status) {
        if ((newSong === oldSong) && (status === 'playing')){
            pauseSong();
        } else {
            playSong();
        }
    };

// Liest den ausgewählten Song aus und ändert das Audio-Element und die Info-Daten
    var setSong = function(song) {
        // Daten auslesen
        var title = $(song).find('.'+settings.prefix+'--songtitle').text(),
            file = $(song).find('a').attr('href'),
            metadata = $(song).data('metadata');

        setlist.children().removeClass('is-active');
        $(song).addClass('is-active');

        // Daten einfügen
        infobox.find('.'+settings.prefix+'--songtitle').text(title);
        infobox.find('.'+settings.prefix+'--metadata').text(metadata);
        $(player).children('source:eq(0)').attr({src: file, type: "audio/mp3"});

        if (settings.ogg) {
            var fileOgg = file.slice(0, (file.length-3))+'ogg';
            $(player).children('source:eq(1)').attr({src: fileOgg, type: "audio/ogg"});
        }
        player.load();
    };



// Bei Klick auf Liste gewählten Song aktivieren
    setlist.on('click', 'li', function(e){
        e.preventDefault();
        var status = playerStatus(),
            oldSong = $(player).children('source').attr('src');
        setSong(this);
        var newSong = $(player).children('source').attr('src');
        playOrPause(newSong, oldSong, status);
    });

// Buffer-Progress updaten
    $(player).on('seeking', function(){
        timeRange.addClass('is-seeking');
    }).on('seeked', function(){
        timeRange.removeClass('is-seeking');
    });

// TimePosition updaten
    $(player).on('timeupdate', function(){
        var audioPos = player.currentTime / player.duration * 100;
        timePos.css('width', audioPos+'%');
    });

// Bei Klick zu TimePosition springen
    $(timeRange).on('click', function(e){
        var clickPos = e.pageX - $(this).position().left,
            width = $(this).width(),
            relPos = clickPos / width * 100;
        player.currentTime = relPos / 100 * player.duration;
        timePos.css('width', relPos+'%');
    });

// Leertaste für playOrPause zweckentfremden
    $('body').keydown(function (e) {
         if (e.keyCode === 32) {
            playOrPause('', '', playerStatus());
            e.preventDefault();
         }
    });

// Nach Songende automatisch nächsten Song spielen
    $(player).on('ended', function(){
        nextSong();
        playSong();
    });

// Play-Button
    btnPlay.on('click', function(){
        playSong();
    });
// Pause-Button
    btnPause.on('click', function(){
        pauseSong();
    });
// Next-Button
    btnNext.on('click', function(){
        nextSong();
        playSong();
    });
// Prev-Button
    btnPrev.on('click', function(){
        prevSong();
        playSong();
    });
//Mute-Button
    btnMute.on('click', function(){
        muteSong();
    });
//Unmute-Button
    btnUnmute.on('click', function(){
        unmuteSong();
    });





// Beim Inititalisieren Song aktivieren, nicht erforderliche Buttons ausblenden
    player.volume = 1;
    setSong(activeSong);
    $(btnPause).hide();
    $(btnUnmute).hide();

    return this;

};

}(jQuery));