"use strict";
requirejs('controls/control');

(() => {
    // idx 0 -> color1, idx 1 -> color2, etc.
    var specialColorKeywords = JSON.parse('[["ADD","ADD CONSTRAINT","ALTER","ALTER COLUMN","ALTER TABLE","ALL","AND","ANY","AS","ASC","BACKUP DATABASE","BETWEEN","CASE","CHECK","COLUMN","CONSTRAINT","CREATE","CREATE DATABASE","CREATE INDEX", \
        "CREATE OR REPLACE VIEW","CREATE TABLE","CREATE PROCEDURE","CREATE UNIQUE INDEX","CREATE VIEW","DATABASE","DEFAULT","DELETE","DESC","DISTINCT","DROP","DROP COLUMN","DROP CONSTRAINT","DROP DATABASE","DROP DEFAULT", \
        "DROP INDEX","DROP TABLE","DROP VIEW","EXEC","EXISTS","FOREIGN KEY","FROM","FULL OUTER JOIN","GROUP BY","HAVING","IN","INDEX","INNER JOIN","INSERT INTO","INSERT INTO SELECT","IS NULL","IS NOT NULL","JOIN","LEFT JOIN", \
        "LIKE","LIMIT","NOT","NOT NULL","OR","ORDER BY","OUTER JOIN","PRIMARY KEY","PROCEDURE","RIGHT JOIN","ROWNUM","SELECT","SELECT DISTINCT","SELECT INTO","SELECT TOP","SET","TABLE","TOP","TRUNCATE TABLE","UNION", \
        "UNION ALL","UNIQUE","UPDATE","VALUES","VIEW","WHERE"], \
        ["Albums","Artists","ArtistsAlbums", \
        "ArtistsSongs","Covers","DBInfo","DBInfo","DBInfo","DBInfo","DeviceCollectionConfig","DeviceTracks","Devices","Downloads","Filters","Folders","FoldersHier","Genres","GenresSongs","Links","Lists","ListsSongs","MediaConnections", \
        "MediaServerFilters","MediaServerPlaylists","MediaServers","Medias","NetworkResources","NodeViews","OrganizeRules","ParentalRatings","PathProcessing","Pinned","Played","PlaylistSongs","PlaylistViews","Playlists","PodcastDirs", \
        "PodcastEpisodes","Podcasts","Radio","RemoteClients","RemoteServers","Songs","SongsText","SynchAlbum","SynchArtist","SynchCollection","SynchGenre","SynchLocation","SynchPlaylist","SynchPodcast","SynchRating","URLRequestCache","Views","Webs"], \
        ["Albums","Authors","Conducts","Lyrics","Products","Publishes","Roles","ACSettHash","AcceptExternalIPs","Action","Actors","AddToLib","AdvancedSynch","Album", \
        "AlbumArtist","AllowWifiSync","AllowedDeviceMACs","Artist","ArtistNodeType","ArtworkLink","ArtworkModified","AudioCDTrack","AudiobookMask","Author","AutoConversions","AutoUnmount","BiDirConfirm","BiDirSync","BiDirSyncMetadata", \
        "Bitrate","Broadcast","BytesDownloaded","BytesTotal","CDDBId","CDDBQueryResult","CDDBQueryState","CacheName","CachePath","CacheStatus","CachedImageLink","CachedTime","Capacity","Channels","ClassMusicMask","Comment","Cond","Conductor", \
        "ContainerType","Converted","Cookie","CopyToPCFolder","Copyright","CoverDescription","CoverOrder","CoverPath","CoverStorage","CoverType","Custom1","Custom10","Custom2","Custom3","Custom4","Custom5","Custom6","Custom7","Custom8", \
        "Custom9","CustomizeCustomizeContent","CustomizeRules","Date","DateAdded","DelEpisodes","DelOnlyListened","DelRating","DelRatingValue","DeleteConfirm","DeleteConfirmUnknown","DeleteUnknown","DeleteUnsynch","Denied","Description", \
        "Destination","DetailedCopyM3PlaylistFormat","DeviceContentType","DeviceDescription","DeviceDeviceCaption","DevicePath","DirName","DirUrl","DiscNumber","DontDelete","DownloadType","Downloaded","DriveType","EnablePlayCounter", \
        "Enabled","Encoder","EpisodeAge","EpisodeNumber","ExtendedTags","Extension","FileLength","FileModified","Filters","FirstArtist","FirstGenre","Folder","FrameRate","GaplessBytes","Generator","Genre","GenreName","Genres","GroupDesc", \
        "ID","IDAlbum","IDArtist","IDChildFolder","IDCollection","IDDevice","IDEpisode","IDFilter","IDFolder","IDGenre","IDInfo","IDInfo,","IDList","IDListType","IDMedia","IDMediaServer","IDParentFolder","IDPlayed","IDPlaylist", \
        "IDPlaylistSong","IDPodcast","IDRemoteClient","IDServer","IDSong","IDTrack","IDView","ImageCollageInfo","ImageLink","ImagePath","InfoString","InfoValue","InfoValue","InitialKey","Invisible","InvolvedPeople","IsAudioLocation", \
        "IsAutoPlaylist","IsPlayCount","Kind","KnownDeviceMACs","Label","Language","LastAccessTime","LastAutoSynch","LastChangedACRulesTm","LastContentHash","LastMetaHash","LastModified","LastTimePlayed","LastTimeShown","Login","Lyricist", \
        "Lyrics","M3UCopyAlbums","M3UCopyArtists","M3UCopyLocations","M3UCopyPlaylists","M3UFlags","M3UFolder","M3UOrganize","Mask","MaskPath","MaxSample","MediaFile","Mood","MusicBrainzDiscId","MusicMask","MusicVideoMask","Name", \
        "NetSource","NodeType","NormalizeAlbum","NormalizeTrack","NotSharedCustomNodes","Occasion","OrigArtist","OrigFileLength","OrigLyricist","OrigTitle","OrigYear","OtherContentSize","OverwriteTags","Parent","ParentName", \
        "ParentPlaylist","ParentalRating","PartialCheck","Password","Path","Persistent","PersonType","PictureDataHash","PictureType","PlayCounter","PlayDate","PlaybackPos","PlaylistName","Playlists","PluginName","PodcastMask", \
        "PodcastName","PodcastUrl","Port","Pos","PostGap","PreGap","PreModified","PreferStars","PreviewLength","PreviewName","PreviewStartTime","PreviewState","Producer","PubDate","Publisher","Quality","QueryData","QueryDatasrcMedia", \
        "RandomSelection","Rating","Remixer","RemoveAAByteRate","RemoveAAFromTag","RequestBody","ReserveSpace","ReserveSpaceNumber","Response","ResyncOnMaskChange","RetainEpisodes","RetainNumber","SampleRate","SamplingFrequency", \
        "SaveAAToFolder","SaveAAToTag","ScanFolders","ScanOnConnect","SeasonNumber","Seekable","SerialNumber","ServerName","ShareAllCollections","ShareAllPlaylists","ShareCollections","SharePlaylists","ShareWithNewDevices", \
        "ShowIndexForCategories","ShowIndexForCategoriesValue","ShowLabel","ShowRemovedEpisodes","SignPart1","SignPart2","SignPart3","SignPart4","SignType","SkipCount","SongLength","SongOrder","SongPath","SongTitle","SortOrder","Source", \
        "StartDate","StartTime","Status","Stereo","StopTime","StreamCount","StreamInfo","SubTitle","SyncAAMask","SyncBackFolders","SyncSourceInfo","SynchOnConnect","TOCData","TVMask","TargetMask","Tempo","TextData","Title","TotalSamples", \
        "TrackCount","Track","TrackModified","TrackNumber","TrackType","Tracks","TurnedDriveLetter","Type","UTCOffset","UploadTime","UsageCount","UseAsSyncServer","UserAgent","VideoHeight","VideoMask","VideoPodcastMask","VideoWidth", \
        "View","ViewStatus","VisibleInMainTree","WebArtist","WebCommercial","WebCopyright","WebFilepage","WebLink","WebPayment","WebPublisher","WebRadio","WebSource","WebUser","WirelessIDString","Year","autor","category","coll_id", \
        "criteriaIcon","description","duration","handlercustomSynchAll","keywords","link","linkInfo","linkType","mime","objectType","srcPath","string_type_id","subtitle","summary","title","type","type_id"]]'
    );

    inheritClass('SQLEditor', Control, {
        initialize: function(elem, params) {
            SQLEditor.$super.initialize.apply(this, arguments);
            
            elem.classList.add('codeEditor');
            
            this.textarea = document.createElement('textarea');
            this.textarea.style.resize = 'none';
            this.textarea.style.fontFamily = 'monospace';
            this.textarea.classList.add('scrollable', 'stretchWidth', 'fill', 'codeEditorTextarea');
            this.textarea.setAttribute('data-id', 'sqlarea');
            elem.appendChild(this.textarea);
            this.pre = document.createElement('pre');
            this.pre.classList.add('scrollable', 'stretchWidth', 'fill', 'codeEditorPre');
            this.pre.style.fontFamily = 'monospace';
            elem.appendChild(this.pre);
            
            var replaces = [
                [/</g, '&lt;'],
                [/>/g, '&gt;'],
            ];
            
            forEach(specialColorKeywords, (itm, i) => {
                let wordsList = itm.join('|');
                let strReplace = `$1<span class="color${i + 1}">$2</span>$3`;
                replaces.push([new RegExp('(^|\\s)(' + wordsList + ')($|[\\s,])', 'gi'), strReplace]);
            });
            
            const _this = this;
            this.localListen(this.textarea, 'keydown', () => {
                _this.requestTimeout(() => {
                    var html = this.textarea.value;
                    for (let i in replaces) {
                        let regex = replaces[i][0];
                        let replace = replaces[i][1];
                        html = html.replace(regex, replace);
                    }
                    _this.pre.innerHTML = html;
                    
                    _this.pre.scrollTop = _this.textarea.scrollTop; // in the case of pasting
                }, 1, 'textEdit')
            });
            this.localListen(this.textarea, 'scroll', (e) => {
                _this.pre.scrollTop = _this.textarea.scrollTop;
            });
        },
        cleanUp() {
            SQLEditor.$super.cleanUp.call(this);
        }
    });
})();