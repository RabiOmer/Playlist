class PlayList {

    constructor() {
        let _this = this;
        let _songs;
        let _btn;
        let _list;

    }


    onload() {
        this.Playlist;
    }


    addplaylist(r) {
        for (let i = 0; i < r.length; i++) {
            let id = r[i].id;
            let name = r[i].name;
            let image = r[i].image;
            let play = $(`<div id="${id}"class="box-play">
            <p class="title">${name}</p>
            <div class="img-list">
            <img class="imagep" src="${image}"></img>
            </div>
            <div data-i="${id}" class="btn-list btn-play-list">
            <span class="fas fa-play play-musice"></span>
          </div>
          <div class="more-btn"><span class="fas fa-pencil-alt"></span><span class="fas fa-trash"></span></div>
          </div>`);
            play.appendTo('#play-list');
            $('.title').arctext({
                radius: 200,
                rotate: false
            })
        }
        let _this = this;
        $('.btn-play-list').on('click', function () {
            let data = _this.play;
            let name,image,id;
            for(let i=0;i<data.length;i++){

                if(data[i].id==$(this).data('i')){
                    name = data[i].name;
                    id = data[i].id;
                    image = data[i].image;
                }
            }
            _this.getSongs(id,name,image)
            $("#player").show();
            $("#main-box").css("margin-top", "300px")
        })
        $('.imagep').on('click',()=>{
            console.log('imeeeeeeeeeg')
        })
        $('.fa-pencil-alt').on('click',()=>{
            console.log('edit');
        })
        $('.fa-trash').on('click',()=>{
            console.log('delete')
        })
    }
    musicbtn() {
        var audio = document.getElementById('player-music');
        let btn;
        audio.onpause = function () {
            $.each($('#playlist span[name="stop"]'), (k, v) => {
                if ($(v).hasClass('fa-pause')) {
                    $(v).removeClass('fa-pause');
                    $(v).addClass('fa-play');
                }
                $('#img-btn').removeClass('fa-pause');
                $('#img-btn').addClass('fa-play');
            })
            $('.imge-player img').removeClass('spinning-circle');
            $('#img-btn').removeClass('fa-pause');
            $('#img-btn').addClass('fa-play');
        }
        audio.onplay = function () {
            $.each($('#playlist span[name="stop"]'), (k, v) => {
                    if($(v).hasClass('fa-pause')){
                        btn = $(v);
                    }
                })
                btn.removeClass('fa-play');
                btn.addClass('fa-pause');
                $('.imge-player img').addClass('spinning-circle');
                $('#img-btn').removeClass('fa-play');
                $('#img-btn').addClass('fa-pause');
            }
        

    }
    getSongs(id, name, image) {
        console.log('songsss', id,name,image)
        let _this = this;
        $.ajax({
                url: 'http://localhost//playlist/api/playlist/' + id + '/songs',
                method: 'get',
                dataType: 'json',
            }).done(function (r) {
                
                console.log(r.data, id, name, image);
                _this.songs = r.data.songs;
                _this.addToPlayer(r.data.songs, id, name, image);

            })

    }
    get music() {
        var audio = document.getElementById('player-music');
        if (!audio.paused && audio.duration > 0) {
            return true
        } else {
            return false
        }
    }
    set songs(song) {
        this._songs = song;
    }
    get songs() {
        return this._songs;
    }
    set play(play){
        this._list=play;
    }
    get play(){
        console.log(this._list);
       return this._list;
    }
    get stopandplay() {
        var audio = document.getElementById('player-music');
        if (!audio.paused && audio.duration > 0) {
            audio.pause();
        } else {
            audio.play();
        }
    }
    keepgoing(i, s, list) {

        var audio = document.getElementById('player-music');
        let song = this.songs;
        let _this = this
        audio.onended = function () {
            let i = 0;
            $.each($('#playlist span[name="stop"]'), (k, v) => {
                if ($(v).hasClass('fa-pause')) {
                    i = k + 1;
                    if (i < song.length) {
                        _this.songClicked(i, song, list)
                    } else {
                        console.log('remove class');
                        $('.imge-player img').removeClass('spinning-circle');
                    }
                }
            })

        }

    }

    addToPlayer(songs, id, name, image) {
        console.log('add to player');
        $('#playlist').html('');
        $('#nowplay span').html('');
        $('.imge-player').html(`<img src="${image}" class='spinning-circle'>`);
        let btnimg = $(`<div id="btn-imge">
        <span id="img-btn" class="fas fa-pause pause"></span>
        </div>`).on('click', () => {
            this.stopandplay;
            if (this.music) {
                $('.imge-player img').addClass('spinning-circle');
                $('#img-btn').removeClass('fa-play');
                $('#img-btn').addClass('fa-pause');
            } else {
                $('.imge-player img').removeClass('spinning-circle');
                $('#img-btn').removeClass('fa-pause');
                $('#img-btn').addClass('fa-play');
            }
        })
        $('.imge-player').append(btnimg);
        $('#playerBox').html(`<div id="more"><span class="fas fa-trash"></span><span class="fas fa-pencil-alt"></span></div><audio autoplay id="player-music" src="${songs[0].url}" type="audio/mpeg" controls controlsList="nodownload"></audio>
            <p id="nowplay">Now Playing:
              <span>${songs[0].name}</span>
            </p><ul id="playlist"></ul>`)
        for (let i = 0; i < songs.length; i++) {
            let btn;
            if (i == 0) {
                btn = $(`<P>
                    <span name="stop" class="btn-play fas fa-pause"></span>
                    <span class="num">${i+1} .</span>${songs[i].name}</p>`);
            } else {
                btn = $(`
                    <P>
                <span name="stop" class="btn-play fas fa-play"></span>
                <span class="num">${i+1} .</span>${songs[i].name}</p>`);
            }
            let list = $(`<li></li>`).on('click', () => {
                this.songClicked(i, songs, list);
            })
            list.append(btn);
            list.appendTo('#playlist');
            this.keepgoing(null, null, list);
            this.musicbtn();
        }
    }

    songClicked(i, songs, list) {
        let btn;
        $('.imge-player img').addClass('spinning-circle');
        $.each($('#playlist span'), (k, v) => {
            if ($(v).hasClass('fa-pause')) {
                $(v).removeClass('fa-pause');
                $(v).addClass('fa-play');
            }
        })
        if ($('audio').attr('src') == songs[i].url) {
            $.each($('#playlist span[name="stop"]'), (k, v) => {
                if (k == i) {
                    if (!this.music) {
                        if ($(v).hasClass('fa-play')) {
                            console.log('fa-play', $(v).hasClass('fa-play'));
                            this.stopandplay;
                            $(v).removeClass('fa-play');
                            $(v).addClass('fa-pause');
                        }
                    } else {
                        console.log('fa-pause', $(v).hasClass('fa-pause'));
                        $(v).removeClass('fa-pause');
                        $(v).addClass('fa-play');
                        this.stopandplay;
                    }
                }

            })
        } else {
            btn = $(`<P>
                <span name="stop" class="btn-play fas fa-pause"></span>
                <span class="num">${i+1} .</span>${songs[i].name}</p>`);
            $(list).html(btn);
            $('audio').attr('src', songs[i].url);
            $("#nowplay span").html(songs[i].name);
        }

    }
    get Playlist() {
        let _this = this;
        $.ajax({
            url: 'http://localhost//playlist/api/playlist',
            method: 'get',
            dataType: 'json'

        }).done(function (r) {
            _this.play=r.data;
            _this.addplaylist(r.data);
        })
    }


}