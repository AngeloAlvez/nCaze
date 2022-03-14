



var active = true;

try {
    chrome.storage.sync.get({
        activate: true
    }, function (items) {
        active = items.activate;
        if (active) {
            main();
        }
        track(items.activate ? "true" : "false");
    });
} catch (e) {
    if (active) {
        main();
    }
    track("undefined");
}

function track(active) {
    //UA-9413471-3

    ga('create', 'UA-9413471-3', 'auto');
    ga('set', 'dimension1', active);
    ga('send', 'pageview');

    // //Analytics
    // var _gaq = window._gaq || [];
    // _gaq.push(['_setAccount', 'UA-9413471-3']);
    // _gaq.push(['_gat._forceSSL']);
    // _gaq.push(["_setCustomVar", 1, "Active", active, 3]);
    // _gaq.push(['_trackPageview']);
}

//Content script, image replacer
function main() {
    
    //rNet 
    (function ($) {
        // https://cdn.rawgit.com/AaronLayton/rNet/master/images/
        var self = {
            rNetImgs: [
                'https://s2.glbimg.com/BQYMRNvV-rqLrWxNwCHaI8qA6_M=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2022/T/9/eTHsI7QO6y3fSIBqtYyw/casimiro.jpg',
                'https://cdn.ome.lt/U5tpMhHGFHfNfcBjSId9r-Vx1M0=/1200x630/smart/extras/conteudos/Casimiro_sorrindo.png',
                'https://dropsdejogos.uai.com.br/wp-content/uploads/sites/10/2022/01/youtube-casimiro-reproducao-scaled-1280x720.jpg',
                'https://noticiasdatv.uol.com.br/media/_versions/artigos_2021/casimiro-miguel-globo-bbb-divulgacao-grande_fixed_large.jpg',
                'https://t.ctcdn.com.br/ZDh3bgyOF3PfJXpSZxynAzjxIOo=/512x288/smart/filters:format(webp)/i553847.png',
                'https://www.opovo.com.br/_midias/jpg/2021/11/11/818x460/1_conheca_casimiro_jornalista_esportivo_apresentador_streamer_torcedor_ilustre_do_vasco-17469300.jpg',
                'https://midias.agazeta.com.br/2022/01/12/casimiro-e-um-fenomeno-da-web-680996-article.jpg',
                'https://noticias.maisesports.com.br/wp-content/uploads/2021/12/casimiro-nobru-trofeu-premio-esports-brasil.jpg',
                'https://pbs.twimg.com/profile_images/1429865698684178432/ZK3KmpzI_400x400.jpg',
                'https://clubedovideogame.com.br/wp-content/uploads/2022/01/BBB-fake.jpg',
                'https://www.lance.com.br/files/article_main/uploads/2022/01/24/61ef3e53ed409.jpeg',
                'https://noticias.maisesports.com.br/wp-content/uploads/2022/01/casimiro-promessa-evoque.jpg',
                'https://media.supervasco.com/photo/2021/10/thumbs/casimiro-miguel.jfif.696x0_q70_crop.webp',
                'https://media.gazetadopovo.com.br/amp-stories/sites/3/2022/01/11102758/casimiro.png',
                'https://uploads.metropoles.com/wp-content/uploads/2022/01/01181126/1-694-600x400.jpg',
                'https://pbs.twimg.com/media/FBdW4pmWUAIBThF.jpg',
                'https://www.hypeness.com.br/1/2022/02/ef71d5af-edit_casimiro_4.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl3OPlCH5b5z_ahbd2EkguHe0_5DHYblWxPw&usqp=CAU',
                'https://pbs.twimg.com/media/FBMeSM9WEAgfvOV.jpg',
                'https://pbs.twimg.com/media/E-eMXVFWUAMBf9W.png',
                'https://pbs.twimg.com/media/FHLnYPZX0AUNKd3?format=jpg&name=large',
                'https://i.ytimg.com/vi/IVqDeAbomMU/maxresdefault.jpg'
            ],

            //Handles all images on page with an interval of time
            handleImages: function (lstImgs, time) {
                $.each($('img'), function (i, item) {
                    //Skip if image is already replaced
                    if ($.inArray($(item).attr('src'), lstImgs) == -1) {
                        var h = $(item).height();
                        var w = $(item).width();

                        //If image loaded
                        if (h > 0 && w > 0) {

                            self.handleImg(item, lstImgs);
                        }
                        else {
                            //Replace when loaded
                            $(item).load(function () {
                                //Prevent 'infinite' loop
                                if ($.inArray($(item).attr('src'), lstImgs) == -1) {
                                    self.handleImg(item, lstImgs);
                                }
                            });
                        }
                    }
                });

                //Keep replacing
                if (time > 0) {
                    setTimeout(function () { self.handleImages(lstImgs, time); }, time);
                }
            },
            //Replace one image
            handleImg: function (item, lstImgs) {
                $(item).error(function () {
                    //Handle broken imgs
                    self.handleBrokenImg(item, lstImgs);
                });

                self.setRandomImg(item, lstImgs);
            },
            //Set a random image from lstImgs to item 
            setRandomImg: function (item, lstImgs) {
                var h = $(item).height();
                var w = $(item).width();
                $(item).css('width', w + 'px').css('height', h + 'px');
                $(item).attr('src', lstImgs[Math.floor(Math.random() * lstImgs.length)]);
            },
            //Removed broken image from lstImgs, run handleImg on item
            handleBrokenImg: function (item, lstImgs) {

                var brokenImg = $(item).attr('src');
                var index = lstImgs.indexOf(brokenImg);
                if (index > -1) {
                    lstImgs.splice(index, 1);
                }
                self.setRandomImg(item, lstImgs);
            },
        };

        //Run on jQuery ready
        $(function () {

            self.handleImages(self.rNetImgs, 3000);

        });

        //Set global variable
        $.rNet = self;


    })(jQuery);
    //end rNet
}