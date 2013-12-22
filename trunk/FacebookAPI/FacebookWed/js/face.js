// JavaScript Document

window.fbAsyncInit = function () {
    // init the FB JS SDK
    FB.init(
    {
        appId: '479529902165723',                        // App ID from the app dashboard
        status: true,                                 // Check Facebook Login status
        xfbml: true                                  // Look for social plugins on the page
    });

    FB.Event.subscribe('auth.authResponseChange', function (response) {
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;

            // TODO: Handle the access token
            getAvatar();
            getmember();
            //getfeed();
            //getprofile('1');
            test(5);

        }
        else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook,
            // but has not authenticated your app
        }
        else {
            // the user isn't logged in to Facebook.
        }
    }, { scope: 'email,id,user_groups,user_likes,user_photos' });


    // Additional initialization code such as adding Event Listeners goes here
};// end

// Load the SDK asynchronously
(function () {
    // If we've already installed the SDK, we're done
    if (document.getElementById('facebook-jssdk')) { return; }

    // Get the first script element, which we'll use to find the parent node
    var firstScriptElement = document.getElementsByTagName('script')[0];

    // Create a new script element and set its id
    var facebookJS = document.createElement('script');
    facebookJS.id = 'facebook-jssdk';

    // Set the new script's source to the source of the Facebook JS SDK
    facebookJS.src = '//connect.facebook.net/en_US/all.js';

    // Insert the Facebook JS SDK into the DOM
    firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
}());

function getAvatar() {
    FB.api('/me?fields=picture,name,link', function (response) {
        $('#pic').attr('src', response.picture.data.url);
        $('#name').html(response.name);
        $('#name').attr('href', response.link);
    });
}

//Get feed in group
function getfeed() {
    FB.api('/241619362662034?fields=feed.limit(10)', function (response) {
        var length = response.feed.data.length;		
        for (var i = 0; i < length; i++) {
            //Ten va ID nguoi dang bai
            var ID = response.feed.data[i].from.id;
            var Name = response.feed.data[i].from.name;
            //Noi dung bai dang
            var Message = response.feed.data[i].message;

            //Tong so like
            var likecount = response.feed.data[i].likes;
            if (likecount == null) {
                likecount = 0;
            }
            else {
                likecount = response.feed.data[i].likes.data.length;
            }


            //show du lieu
            //FB.api('/'+ID+'?fields=picture', function(res){
            //    //$('#aaa.img').html('<img src="'+res.picture.data.url+'"/>');

            //    $('.feed').html('<div class="img"><img src="'+res.picture.data.url+'"/></div>');

            //});
            //var temp = '<a href="http://www.facebook.com/'+ID+'" target="_blank">'+Name+'</a>';
            //            $('#aaa.name').html(temp);
            //            $('.message').html(Message);
            //            $('#aaa.like').html(likecount+' like this');
            $('#aaa').html('<div class="img"><img src="https://graph.facebook.com/' + ID + '/picture?type=square"/></div>');
            var htm = '<div class="name"><a href="http://www.facebook.com/' + ID + '" target="_blank">' + Name + '</a></div>'
                + '<div class="message">' + Message + '</div>'
                + '<div class="like">' + likecount + ' like this</div>';

            $('.post').append(htm);


            var lengthComment;
            if (response.feed.data[i].comments == null) {
                lengthComment = 0;

            }
            else {
                lengthComment = response.feed.data[i].comments.data.length;

            }

            for (var j = 0; j < lengthComment; j++) {
                //Comment
                var IDcommnet = response.feed.data[i].comments.data[j].from.id;
                var Namecomment = response.feed.data[i].comments.data[j].from.name;
                var Likecomment = response.feed.data[i].comments.data[j].like_count;
                var Messagecomment = response.feed.data[i].comments.data[j].message;



                FB.api('/' + IDcommnet + '?fields=picture', function (res) {
                    var html = '<div class="img">'
                    + '<img src="' + res.picture.data.url + '"/>'
                    + '</div>';

                    $('.commnt').append(html);

                });
                var html = '<div class="comment">'
                        + '<div class="img">aaa</div>'
                        + '<div class="name">' + Namecomment + '</div>'
                        + '<div class="content">' + Messagecomment + '</div>'
                        + '<div class="like">' + Likecomment + ' like this</div>'
                    + '</div>';
                $('.post').append(html);
                //$('.commet').html('<div class="name">'+Namecomment+'</div>')
                //                $('.content').html(Messagecomment);
                //                $('#bbb.like').html(Likecomment+' like this');


            }
        }
    });

}
//Get members
function getmember() {
    var array = [];
    FB.api('/229667433871123?fields=members', function (response) {
        var length = response.members.data.length;
        for (var i = 0; i < length; i++) {
            var id = response.members.data[i].id;
            FB.api('/' + id + '?fields=name,link', function (resp) {
                $('#members').append('<p><a id="' + id + '" href="' + resp.link + '">' + resp.name + '</a></p>');
            });
        }
    });
}

//Get profile from id
function getprofileID(id) {
    FB.api('/' + id + '?fields=name,link', function (response) {
        var name = response.name;
        var link = response.link;
        return name;
    });

}

//Test
function test(num) {
	if(num==0)
	{
		num=5;
	}
	
    FB.api('/241619362662034?fields=feed.limit('+num+')', function (response) {
        var length = response.feed.data.length;
		
        for (var i = length-4; i < length; i++) {
            //Ten va ID nguoi dang bai
            var ID = response.feed.data[i].from.id;
            var Name = response.feed.data[i].from.name;
            //Noi dung bai dang
            var Message = response.feed.data[i].message;
			//ID Feed
			var IDFeed = response.feed.data[i].id;
			//Time to create Feed
			var TimeFeed = response.feed.data[i].created_time;
			
            //Tong so like
            var likecount = response.feed.data[i].likes;
            if (likecount == null) {
                likecount = 0;
            }
            else {
                likecount = response.feed.data[i].likes.data.length;
            }

            var lengthComment;
            if (response.feed.data[i].comments == null) {
                lengthComment = 0;
            }
            else {
                lengthComment = response.feed.data[i].comments.data.length;
            }
			
			
			var html = 
			'<div id="body">'
			+	'<section class="content-wrapper main-content clear-fix">'
			+		'<ul id="msgHolder">'
			+			'<li class="postHolder">'
			+				'<img src="https://graph.facebook.com/' + ID + '/picture?type=square"><p><a href="http://www.facebook.com/'+ID+'" target="_blank">'+Name+'</a>: <span>'+Message+'</span></p>'
			+				'<div class="postFooter">'
			+					'<span class="timeago" >'+TimeFeed+'</span>&nbsp;'
			+					'<span class="timeago">'+likecount+' like this</span> </br>'
			+					'<a class="linkComment" href="#">Like</a>'
			+					'<div class="commentSection">'
			+						'<ul id="'+IDFeed+'">'
			+							'<font face="Verdana, Geneva, sans-serif"></font>'
			+						'</ul>'
			+					'<div style="display: block" class="publishComment">'
			+						'<textarea class="commentTextArea" placeholder="write a comment..." style="height: 19px; overflow: hidden; word-wrap: break-word; resize: none;"></textarea>'
			+						'<input type="button" value="Comment" class="btnComment">'
			+					'</div>'
			+				'</div>'
			+			'</div>'
			+		'</li>'
			+	'</ul>'
			+	'</section>'
			+'</div>';
			$('#content').append(html);			
			
			for(var j=0;j<lengthComment;j++)
			{
				//Comment
                var IDcomment = response.feed.data[i].comments.data[j].from.id;
                var Namecomment = response.feed.data[i].comments.data[j].from.name;
                var Likecomment = response.feed.data[i].comments.data[j].like_count;
                var Messagecomment = response.feed.data[i].comments.data[j].message;											
				
				var Com = 
				'<li class="commentHolder">'
				+		'<a href="http://www.facebook.com/'+IDcomment+'" target="_blank"><img src="https://graph.facebook.com/' + IDcomment + '/picture?type=square"></a><p><a href="http://www.facebook.com/'+IDcomment+'" target="_blank">'+Namecomment+'</a>: <span>'+Messagecomment+'</span></p>'		
				+		'<div class="commentFooter"><span class="timeago" >thoi gian</span>&nbsp;&nbsp;<span>so luoc like</span></div>'	
				+	'</li>';
				$('#'+IDFeed).append(Com);
			}
			
        }
    });
}

function loadMore() {
	Number = Number + 5;

    console.log("More loaded");
    test(Number);
    $(window).bind('scroll', bindScroll);
}
var Number=5;
function bindScroll() {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        $(window).unbind('scroll');
        loadMore();
    }
}

$(window).scroll(bindScroll);