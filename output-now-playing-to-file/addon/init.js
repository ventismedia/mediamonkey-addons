"use strict";
requirejs('actions');
// Execute when the window is ready
window.whenReady(() => {
    //listen for playback state to change
    app.listen(app.player, 'playbackState', onPlaybackStateChange);
    let settings = getSettings();
    let currentTimeout;
    function getSettings() {
        return app.getValue('outputNowPlayingToFile_outputOptions', {
            path: '', outputBefore: '', outputAfter: '',
        });
    }
    function onPlaybackStateChange(newState) {
        switch (newState) {
            case 'pause':
                setNewTimeout(onPause);
                break;
            case 'stop':
                setNewTimeout(onStop);
                break;
            case 'trackChanged':
                setNewTimeout(onTrackChanged);
                break;
            case 'play':
            case 'unpause':
                setNewTimeout(onPlay);
                break;
        }
    }
    function setNewTimeout(cb) {
        clearTimeout(currentTimeout);
        currentTimeout = requestTimeout(cb, 50);
    }
    //Pause handler
    function onPause() {
        generateOutput('paused');
    }
    //Stop handler
    function onStop() {
        generateOutput('stopped');
    }
    //Play handler
    function onPlay() {
        generateOutput('playing');
    }
    //currently unused
    function onTrackChanged() {
        // console.log('ontrackchanged');
    }
    //Generate the output & save the file
    function generateOutput(state) {
        settings = getSettings();
        var track = app.player.getCurrentTrack();
        var summary = track.summary;
        var output = settings.outputBefore + summary + settings.outputAfter;
        if (state === 'paused') {
            output += ' (paused)';
        }
        else if (state === 'stopped') {
            output = 'No song is currently playing';
        }
        saveToFile(output);
    }
    //Save to the specified file path
    function saveToFile(text) {
        var path = settings.path;
        if (path) {
            app.filesystem.saveTextToFileAsync(path, text);
        }
    }
});
