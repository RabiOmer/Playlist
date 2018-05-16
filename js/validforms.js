class ValidForms {

    constructor() {
        this._img = false;
        this._list = [];
        this._imgeurl ='';
        this.i = 0;
        this._playlistname='';

    }

    get buttons() {
        let _this = this;
        //open add playlist form
        $("#add-playlist").on("click", function () {
            $(".add-form-1").show();
            $('.add-form-2').hide();
        })

        //Next page in form
        $('.add-form-1 .next').on("click", function () {
            if(_this.ValidForm()){
            $(".add-form-1").hide();
            $('.add-form-2').show();
            }
        })

        //validate song url
        $('.add-song-url').on('change', function () {
            _this.validSong($(this).val(), $(this));
        })

        //View Imge
        $('.add-form-1 .add-url-imge').on('change', function () {
            let url = $('.add-url-imge').val();
            _this.getValidImge(url);
        })

        //add another form
        $('.add-url-form').on("click", function () {
            i++;
            $('.url-list-form').append('<div><label>Songs URL </label> <input type="url" class="add-song-url"> <label>Name: </label> <input type="text" class="name-inp" data-i="' + i + '"></div>')
        })

        //validate and save form in DB
        $('.add-new-songs').on('click', function () {
            _this.validPlaylist();
        })

        $('.fa-trash').on('click',()=>{
            console.log('delete....')
        })
        $('.fa-pencil-alt').on('click',()=>{
            console.log('delete....')
        })

    }

    //set img Status
    img(newimg) {
        this._img = newimg;
    }

    //get img Status
    getimg() {
        return this._img;
    }
    //set playlist - from
    playlist(arr) {
        this._list[this.i]={
            name: arr[1],
            url: arr[0]
        };
        console.log(this._list)
        this.i++;
    }

    //clean Playlist
    cleanPlaylist() {
        this._list = [];
    }

    //get playlist
    getplaylist() {
        return this._list;
    }

    //Pring Errors
    fromError(location, err) {
        location.html(err);
    }

    playlistName(name){
        this._playlistname=name;
    }

    getplaylistName(){
        return this._playlistname;
    }

    playlistImage(url){
        this._imgeurl = url;
    }

    getplaylistImage(){
       return this._imgeurl;
    }

    validSong(url, song) {
        var regex = /[^/\\]+(?:mp3)/gi;
        if (url != '') {
          if (regex.test(url)) {
            $('.error-msg-2').html('');
            song.removeClass('error');
            return true
          } else {
            $('.error-msg-2').html('Invalid URL');
            song.addClass('error');
            return false;
          }
        }
      }

    //get valid imge
    getValidImge(url) {
        let regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        $('.add-form-1 .error-msg').html('');
        let _this = this;
        if (regex.test(url)) {
            _this.img(true);
            $('.show-imge').attr('src', url);
            $('.show-imge').on('error', function () {
                let _this = this;
                $(this).attr('src', 'img/preview.png');
                _this.img(false);
                _this.fromError($('.add-form-1 .error-msg'), 'Invalid URL')
            })
        } else {
            _this.img(false);
            _this.fromError($('.add-form-1 .error-msg'), 'Invalid URL')
        }
    }

    //valid Form Page 1
    ValidForm() {
        let _this = this;
        let err = ''
        let name = $('.add-form-1 .playlistName').val();
        let imge = $('.add-url-imge').val();
        if (imge == '') {
            err += ' Missing Imge';
        }
        if (!_this.getimg()) {
            err += ' Invalid Img';
        }
        if (name == '') {
            err += ' Missing playlist Name';
        } else {
            if (!isNaN(name)) {
                err += ' Invalid Playlist Name'
            }
        }
        if (err == '') {
            _this.fromError($('.add-form-1 .error-msg'), '')
            _this.playlistName(name);
            _this.playlistImage(imge);
            return true;
        } else {
            _this.fromError($('.add-form-1 .error-msg'), err)
        }
    }

    sumbmitPlaylist() {
        let _this = this;
        let playlist = _this.getplaylist();
        let name = _this.getplaylistName();
        let img = _this.getplaylistImage();
        $.ajax({
            url: 'http://localhost//playlist/api/playlist',
            method: 'post',
            dataType: 'json',
            data:{
                name: name,
                image: img,
                songs: playlist
            }
        }).done(function(r){
            console.log(r);
        }).fail(function(j,x){
            console.log('fail',j,x);
        })


    }

    // Valid form Page 2
    validPlaylist() {
        let arr = [];
        let err = '';
        let err2 = '';
        var _this = this;
        _this.cleanPlaylist();
        $.each($('.add-song-url'), function (k, v) {
            let song = $(this);
            let songurl = $(this).val();
            let arr = [];
            song.removeClass('error');
            $.each($('.name-inp'), function () {
                let flag = false;
                if ($(this).data('i') == k) {
                    let names = $(this);
                    names.removeClass('error');
                    name = $(this).val();
                    if (songurl) {
                        if (name == '' || !isNaN(name)) {
                            err = 'Invalid Name';
                            names.addClass('error');
                        } else {
                             _this.flag = true;
                        }
                        if (_this.validSong(songurl, song)) {
                            if (_this.flag) {
                                arr.push(songurl);
                                arr.push(name);
                                _this.playlist(arr);
                            }
                        } else {
                            err2 = 'Invalid URL';
                        }
                    }
                }
            })
        })
        if (err == '' && err2 == '') {
            let play = _this.getplaylist();
            if(play.length>0){
                _this.fromError($('.error-msg-2'), '');
                console.log(_this,'-------');
                _this.sumbmitPlaylist();
            }else{
                _this.fromError($('.error-msg-2'), 'You Need To Add Songs');
            }
        } else {
            let error = 'Error: ' + err + ' ' + err2;
            _this.fromError($('.error-msg-2'), error);
        }
    }




}