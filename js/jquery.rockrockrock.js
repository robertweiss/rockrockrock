/*global console:true */

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
        console.log('ogg!');
    }

    var setlist = this,
        btnPlay = $('.'+settings.prefix+'--play'),
        btnPause = $('.'+settings.prefix+'--pause'),
        btnNext = $('.'+settings.prefix+'--next'),
        btnPrev = $('.'+settings.prefix+'--prev'),
        btnMute = $('.'+settings.prefix+'--mute'),
        btnUnmute = $('.'+settings.prefix+'--unmute'),
        infobox = $('.'+settings.prefix+'--playing'),
        activeSong = setlist.children(':eq('+settings.current+')');

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

    var playSong = function() {
            player.play();
            $(btnPlay).hide();
            $(btnPause).show();
    };

    var pauseSong = function() {
            player.pause();
            $(btnPause).hide();
            $(btnPlay).show();
    };

    var muteSong = function() {
        btnMute.hide();
        btnUnmute.show();
        $(player).animate({volume: 0}, settings.fadeTempo, function(){
            player.muted=true;
        });
    };

    var unmuteSong = function() {
        btnUnmute.hide();
        btnMute.show();
        player.muted=false;
        $(player).animate({volume: 1}, settings.fadeTempo);
    };


    // Checkt Player-Status und pausiert und spielt ab
    var playPause = function(newSong, oldSong, status) {
        // Song pausieren, wenn selber Song ausgewählt wird und dieser gerade spielt
        // ansonsten Song abspielen
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
        player.load();
    };

    // Bei Klick auf Liste gewählten Song aktivieren
    setlist.on('click', 'li', function(e){
        e.preventDefault();
        var status = playerStatus(),
            oldSong = $(player).attr('src');
        setSong(this);
        playPause($(player).attr('src'), oldSong, status);
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
        var nextSong = $('.is-active').next();
        if (nextSong.length) {
            setSong(nextSong);
        } else {
            setSong($('.is-active').siblings().first());
        }
        playSong();
    });

    // Prev-Button
    btnPrev.on('click', function(){
        var prevSong = $('.is-active').prev();
        if (prevSong.length) {
            setSong(prevSong);
        } else {
            setSong($('.is-active').siblings().last());
        }
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