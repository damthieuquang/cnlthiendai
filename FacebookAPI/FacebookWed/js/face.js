// JavaScript Document

window.fbAsyncInit = function () {
    // init the FB JS SDK
    FB.init(
    {
        appId: '479529902165723',                        // App ID from the app dashboard
        status: true,                                 // Check Facebook Login status
        xfbml: true,                                  // Look for social plugins on the page
        async: false
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
            //getmember();
            //getfeed();
            //getprofile('1');
            //getfeed(4);
            SortLike();
            
            
			//$('.fb-login-button').attr('style','display: none;');
        }
        else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook,
            // but has not authenticated your app
            
        }
        else {
            // the user isn't logged in to Facebook.
            //$('#content').html('<h1>You must have login</h1>');
            //$('#menu').attr('style', 'display: none;');
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

//Get members
function getmember() {
    var array = [];
    FB.api('/241619362662034?fields=members', function (response) {
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
var test=0;
function getfeed(num) {
	
    FB.api('/241619362662034?fields=feed.limit(' + num + ')', function (response) {
        var length = response.feed.data.length;        
	    for (var i = test; i < length; i++) {
	        test = length;
	        //alert(i);
            //Ten va ID nguoi dang bai            
            var ID = response.feed.data[i].from.id;            
            var Name = response.feed.data[i].from.name;
            //Noi dung bai dang
            var Message = response.feed.data[i].message;
            getHashtag(Message);
			//ID Feed
            var IDFeed = response.feed.data[i].id;
	        //Picture va link cua feed    
            var Picture = "";
            var Link = "";
            if (response.feed.data[i].picture != null) {
                Picture = response.feed.data[i].picture;
                Link = response.feed.data[i].link;
            }

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

            var date = new Date(TimeFeed);                        
            
			var html = 
			'<div id="body">'
			+	'<section class="content-wrapper main-content clear-fix">'
			+		'<ul id="msgHolder">'
			+			'<li class="postHolder">'
			+               '<img src="https://graph.facebook.com/' + ID + '/picture?type=square"><p><a href="http://www.facebook.com/' + ID + '" target="_blank">' + Name + '</a>: <span>' + Message + '</span></p>'
            +               '<a href="'+Link+'"><img src="' + Picture + '"></a>'            
			+				'<div class="postFooter">'
			+					'<span class="timeago" >'+date+'</span>&nbsp;'
			+					'<span class="timeago">'+likecount+' like this</span> </br>'
			+                   '<a class="linkComment" href="#">Like</a>'
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
			
            //add "view more comments"
			
			if(lengthComment > 2)
			{
			    $('#' + IDFeed).append('<a >View more comments</a>');
			    lengthComment = 2;
			}
			
			for(var j = 0;j<lengthComment;j++)
			{				
				//Comment
                var IDcomment = response.feed.data[i].comments.data[j].from.id;
                var Namecomment = response.feed.data[i].comments.data[j].from.name;
                var Likecomment = response.feed.data[i].comments.data[j].like_count;
                var Messagecomment = response.feed.data[i].comments.data[j].message;
                var Createtime = response.feed.data[i].comments.data[j].created_time;

                var date = new Date(Createtime);
				
				var Com = 
				'<li class="commentHolder">'
				+		'<a href="http://www.facebook.com/'+IDcomment+'" target="_blank"><img src="https://graph.facebook.com/' + IDcomment + '/picture?type=square"></a><p><a href="http://www.facebook.com/'+IDcomment+'" target="_blank">'+Namecomment+'</a>: <span>'+Messagecomment+'</span></p>'		
				+		'<div class="commentFooter"><span class="timeago" >'+date+'</span>&nbsp;&nbsp;<span>'+Likecomment+' likes this</span></div>'	
				+	'</li>';
				$('#'+IDFeed).append(Com);
			}
			
        }
	    getparent();
    });    	
}

//get parent ID
function getparent() 
{

    $("a").on("click", function () {
        //var pa = $(this).parent().css({"color":"red","border":"2px solid red"})
        var pa = $(this).parent().attr("id");
        $(this).attr('style','display: none;');
        viewmore(pa);        
        return;
    });
}

//view more comments
function viewmore(IDFeed) {
    
    FB.api('/' + IDFeed + '?fields=comments', function (response) 
    {
        var length = response.comments.data.length;
        
        for (var g = 2; g < length; g++) {
            
            var IDcomment = response.comments.data[g].from.id;
            var Namecomment = response.comments.data[g].from.name;
            var Likecomment = response.comments.data[g].like_count;
            var Messagecomment = response.comments.data[g].message;
            var Createtime = response.comments.data[g].created_time;

            var date = new Date(Createtime);
            
            var Com =
            '<li class="commentHolder">'
            + '<a href="http://www.facebook.com/' + IDcomment + '" target="_blank"><img src="https://graph.facebook.com/' + IDcomment + '/picture?type=square"></a><p><a href="http://www.facebook.com/' + IDcomment + '" target="_blank">' + Namecomment + '</a>: <span>' + Messagecomment + '</span></p>'
            + '<div class="commentFooter"><span class="timeago" >'+date+'</span>&nbsp;&nbsp;<span>'+Likecomment+' likes this</span></div>'
            + '</li>';

            $('#' + IDFeed).append(Com);
        }
    });
}

function SortLike()
{   
    $('a.sortlike').on('click', function()
    {
        alert('you click me');
        FB.api({ method: 'fql.query', query: 'SELECT message, likes,post_id FROM stream WHERE source_id=241619362662034 ORDER BY likes.count desc limit 0,100' }, function (response) {
            GetPostID(response);
        });
    });
      
}

function GetPostID(resp)
{
    var length = resp.length;
    for (var i = 0; i < 3; i++) {
        var postID = resp[i].post_id;     
        ShowFeed(postID);        
    }
}

function ShowFeed(postID)
{
    FB.api('/' + postID, function (response) {
        //Ten va ID nguoi dang bai            
        var ID = response.from.id;
        var Name = response.from.name;
        
        //Noi dung bai dang
        var Message = response.message;
        
        //ID Feed
        var IDFeed = response.id;
        
        //Picture va link cua feed    
        var Picture = "";
        var Link = "";
        if (response.picture != null) {
            Picture = response.picture;
            Link = response.link;
        }

        //Time to create Feed
        var TimeFeed = response.created_time;
        
        //Tong so like
        var likecount = response.likes;
        if (likecount == null) {
            likecount = 0;
        }
        else {
            likecount = response.likes.data.length;
        }
        
        var lengthComment;
        if (response.comments == null) {
            lengthComment = 0;
        }
        else {
            lengthComment = response.comments.data.length;
        }
        
        var date = new Date(TimeFeed);
        

        var html = 
			'<div id="body">'
			+	'<section class="content-wrapper main-content clear-fix">'
			+		'<ul id="msgHolder">'
			+			'<li class="postHolder">'
			+               '<img src="https://graph.facebook.com/' + ID + '/picture?type=square"><p><a href="http://www.facebook.com/' + ID + '" target="_blank">' + Name + '</a>: <span>' + Message + '</span></p>'
            +               '<a href="'+Link+'"><img src="' + Picture + '"></a>'            
			+				'<div class="postFooter">'
			+					'<span class="timeago" >'+date+'</span>&nbsp;'
			+					'<span class="timeago">'+likecount+' like this</span> </br>'
			+                   '<a class="linkComment" href="#">Like</a>'
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

            //add "view more comments"
            
            if(lengthComment > 2)
			{
			    $('#' + IDFeed).append('<a >View more comments</a>');
			    lengthComment = 2;
			}
			
            for (var j = 0; j < lengthComment; j++) {
                //Comment
                var IDcomment = response.comments.data[j].from.id;
                var Namecomment = response.comments.data[j].from.name;
                var Likecomment = response.comments.data[j].like_count;
                var Messagecomment = response.comments.data[j].message;
                var Createtime = response.comments.data[j].created_time;

                var date = new Date(Createtime);
				
				var Com = 
				'<li class="commentHolder">'
				+		'<a href="http://www.facebook.com/'+IDcomment+'" target="_blank"><img src="https://graph.facebook.com/' + IDcomment + '/picture?type=square"></a><p><a href="http://www.facebook.com/'+IDcomment+'" target="_blank">'+Namecomment+'</a>: <span>'+Messagecomment+'</span></p>'		
				+		'<div class="commentFooter"><span class="timeago" >'+date+'</span>&nbsp;&nbsp;<span>'+Likecomment+' likes this</span></div>'	
				+	'</li>';
				$('#'+IDFeed).append(Com);
			}
		getparent();
    });
}

function getHashtag(str)
{
    if (str.indexOf("#") >=0) {
        //alert(str.indexOf("#"));
    }
}

//auto scroll
//function loadMore() {
//	Number = Number + 4;    
//	//alert('Scroll:' + Number);
//	//$('#content').html("");
//    getfeed(Number);
//    $(window).bind('scroll', bindScroll);
//}

//var Number=4;
//function bindScroll() {
//    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
//        $(window).unbind('scroll');
//        loadMore();        
//    }
//}

//$(window).scroll(bindScroll);