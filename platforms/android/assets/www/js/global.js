
$(document).ready(function(){


    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 		//alert("PHONE");
	    document.addEventListener("deviceready", onDeviceReady, false);

	} else {

		onDeviceReady();

	}

});


var fs = null;

function onDeviceReady() {

    document.addEventListener("backbutton", onBackKeyDown, false);

	function onBackKeyDown() {
	    // Exit the app!
	}

    //window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	function errorHandler(e) {
	  var msg = '';
	  switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
	      msg = 'QUOTA_EXCEEDED_ERR';
	      break;
	    case FileError.NOT_FOUND_ERR:
	      msg = 'NOT_FOUND_ERR';
	      break;
	    case FileError.SECURITY_ERR:
	      msg = 'SECURITY_ERR';
	      break;
	    case FileError.INVALID_MODIFICATION_ERR:
	      msg = 'INVALID_MODIFICATION_ERR';
	      break;
	    case FileError.INVALID_STATE_ERR:
	      msg = 'INVALID_STATE_ERR';
	      break;
	    default:
	      msg = 'Unknown Error';
	      break;
	  };
	  alert(msg);
	}

	function initFS() {
	  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(filesystem) {
	    fs = filesystem;
	  }, errorHandler);
	}

    function download(url) {


        var remoteFile = encodeURI(url);

        alert("Starting download for " + remoteFile);

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (filesystem) {

        	alert("Filesystem success");

            filesystem.root.getFile("dummy.html", {
                create: true,
                exclusive: false
            }, function (fileEntry) {

                var localPathRoot = fileEntry.fullPath.replace("dummy.html", "");

                var localPath = localPathRoot + "aotg_assembly/temp/" + remoteFile.substring(remoteFile.lastIndexOf('/') + 1);

                alert(localPath);	            

                var ft = new FileTransfer();
                ft.download(remoteFile, localPath, function (entry) {

                    alert("Download success for " + localPath);
                    alert("Physical path is " + entry.fullPath);


                    $.getJSON(entry.fullPath, function (data) {


                        var downloads = data.downloads;

                        alert("Total of " + downloads.length);

                        var downloadSuccessCount = 0;

                        var slug = data.slug;

                        //alert("Slug name for issue is " + slug);

		                var localContentPath = localPathRoot + "aotg_assembly/"+slug+"/" + remoteFile.substring(remoteFile.lastIndexOf('/') + 1);

		                ft.download(remoteFile, localContentPath, function (entry) {

                        	alert("Content download complete.");

	                        $.each(downloads, function (i, o) {

	                            var remoteAssetPath = "http://ckprototype.com/assembly/modules/downloads/" + slug + "/" + o;

	                            //alert("Starting download for " + remoteAssetPath);

	                            var localAssetPath = localPathRoot + "aotg_assembly/" + slug + "/" + o;

	                            ft.download(remoteAssetPath, localAssetPath, function (assetEntry) {

	                                downloadSuccessCount = downloadSuccessCount + 1;
	                                //alert();
	                                $("#status").html(downloadSuccessCount + "/" + downloads.length);

	                                if (downloadSuccessCount == downloads.length) {

	                                	alert("Asset download complete. Please restart the app.");
									    navigator.app.exitApp();


	                                }

	                            }, fail);


	                        });


		                }, fail);



                    });

                }, fail);


            }, fail);

        }, errorHandler);

    };
    
    function fail(error) {
        alert(error.code);
    }

    $("#header").click(function(){

    	//download("http://ckprototype.com/assembly/modules/downloads/spring-2014/content.json");

    });

	function checkDownload() {

		var existingIssues = [];

	    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {

	        window.rootFullPath = fileSystem.root.fullPath;

	        fileSystem.root.getDirectory("aotg_assembly", {
                create: true,
                exclusive: false
            }, function (directory) {

	            var directoryReader = directory.createReader();
	            directoryReader.readEntries(function (entries) {

	                for (i = 0; i < entries.length; i++) {

	                	if (entries[i].name != "temp") {

	                    	//alert(entries[i].name);
	                    	existingIssues.push(entries[i].name);

	                	}

	                }

	                //alert("existing issues loaded.");
	                window.existingIssues = existingIssues;

					loadPage("list");

	            }, fail);

	        });

	    }, fail);

	};




	if (window.requestFileSystem) {

	    //checkDownload();

	}



    FastClick.attach(document.body);

	hashSplit = hash.split("-");

	if (window.requestFileSystem) {

		var url = "sample/content.json";

	} else {

			var url = "http://ckprototype.com/assembly/modules/generator.php?id=4&callback=?";
	}

	$.ajax({
	   type: 'GET',
	    url: url,
	    async: false,
	    jsonpCallback: 'jsonCallback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    success: function(json) {

	    	window.currentIssue = json;
	    	loadPage("list");

	    },
	    error: function(e) {
	       
	    	alert("Error loading JSON");

	    }
	});



	//loadPage("list");


	$("body").stop().transition({opacity: 1});




}


function loadPage(page, number){

	//alert("asdfdsa");

	console.log(window.currentIssue);


	$("#status").addClass("loading");
	$("#status").text('');  

	$("#main").removeClass("notransition");

	$("#main").transition({x: -$(window).width(), opacity: 0}, function(){

		$("#main").html("");

		if (page == "") {

			page = "list";

		}

		$("body").scrollTop(0);


		placeElements(page, number);

		currentPage = page;

		//alert(currentPage);

		$("#main").transition({x: 0, opacity: 1}, function(){

			$("#main").addClass("notransition");

		});


	});
	/*
	$("#main").transition({x: -$(window).width(), opacity: 0}, function(){

			$("#main").html("");
	 
			$.ajax({
				dataType: 'jsonp',
				url: "http://ckprototype.com/assembly/modules/"+page+"_jsonp.php?id="+number+"&callback=?",
				success: function(data){


					if (number != undefined) {

						window.location.hash = page+"-"+number;

					} else {

						if (page != "list") {
							window.location.hash = page;
						}

					}


				}

			})

		});
*/






}

function placeElements(page, data){

	$("#resource_container").remove();
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	if (page == "list") {

		$("#main").append('<div id="magazine-list-container"></div>');
		$("#magazine-list-container").append('<ul id="magazine-list"></ul>');

    	var thumbnailPath = "sample/images/"+$.md5(window.currentIssue.id)+'_thumbnail.jpg';

		var format = '\
			<li location="toc" issue="'+window.currentIssue.id+'">\
				<div class="magazine-list-image" style="background-image:url('+thumbnailPath+')">\
				</div>\
				<div class="magazine-list-cover">\
					<h1>'+window.currentIssue.name+'</h1>\
					<ul class="magazine-list-button-container">\
							<!--<li><i class="fa fa-download"></i> DOWNLOAD</li>-->\
							<li><i class="fa fa-eye"></i> VIEW</li>\
					</ul>\
				</div>\
			</li>';

		$("#magazine-list").append(format);

		resizeElements(page);				


	} else if (page == "toc") {

		$("#main").append('<div id="toc"></div>');

		var articles = window.currentIssue.articles;
		
		$.each(articles, function(i,o){

			//alert(o.excerpt);

			if (windowWidth > 640) {

	    	var thumbnailPath = "sample/images/"+$.md5(o.id)+'_medium.jpg';

	    	} else {

	    	var thumbnailPath = "sample/images/"+$.md5(o.id)+'_thumbnail.jpg';

	    	}

			var format = '\
			<div class="toc-item" article="'+o.id+'">\
				<div class="toc-item-cover">\
				</div>\
				<div class="toc-item-image" style="background-image:url('+thumbnailPath+')">\
				</div>\
				<div class="toc-item-text">\
					<h1>'+o.title+'</h1>\
					<p>'+o.excerpt+'</p>\
				</div>\
			</div>';

			$("#toc").append(format);

		});

		resizeElements(page);


		
	}  else if (page == "detail") {


		var articles = window.currentIssue.articles;
		var article = null;

		$.each(articles, function(i,o) {

			//console.log(articles);
			//alert(data);

			if (o.id == parseInt(data)) {

				//alert("Hello!");
				article = o;
				return;

			}

		});

		console.log(article);

		//$.each(data, function(i,o){

		var format = '<div id="article"></div>';

		$("#main").append(format);

		var format = '<ul id="article_pages"></ul>';

		$("#article").append(format);		

		if (windowWidth > 640) {

	   	var articleImagePath = "sample/images/"+$.md5(article.id)+'_large.jpg';

    	} else {

	   	var articleImagePath = "sample/images/"+$.md5(article.id)+'_medium.jpg';

    	}

		var articleImage = '\
			<li>\
				<div class="article_image" style="background-image:url('+articleImagePath+')">\
					<div class="article_image_slide">Slide left to begin</div>\
					<div class="article_title">\
						'+article.title+'\
					</div>\
				</div>\
				<!--\
				<div id="article_text">\
						'+article.content+'\
				</div>\
				-->\
			</li>';

		$("#article_pages").append(articleImage);

		
		//$("#header").append('<div id="swipe_bar">SWIPE HERE</div>');
		


		if (article.chapters.length > 0) {

			/*
			$("body").append('<div id="resource_container">\
				<div id="resource_container_button"><i class="fa fa-bookmark" id="open-bottom-bar"></i><span>Resources</span></div>\
				<div id="bottom-bar"></div>\
			</div>');
			*/


			$.each(article.chapters, function(i,o){

				if (windowWidth > 640) {

					   	var chapterImagePath = "sample/images/"+$.md5(o.id)+'_large.jpg';

		    	} else {

					   	var chapterImagePath = "sample/images/"+$.md5(o.id)+'_large.jpg';

		    	}

			   	if (o.title == "[ADVERTISEMENT]") {
				var articleText = '\
						<li>\
							<div class="article_ad">\
									<img src="'+chapterImagePath+'"/>\
							</div>\
							<ul class="article_adjacent" rel="'+i+'">\
							</ul>\
						</li>';



			   	} else {

					var articleText = '\
						<li>\
							<div class="section_image" style="background-image:url('+chapterImagePath+')">\
								<div class="section_title">\
									'+o.title+'\
								</div>\
							</div>\
							<div class="article_text">\
								<div class="article_text_content">\
									'+o.content+'\
								</div>\
							</div>\
							<ul class="article_adjacent" rel="'+i+'">\
							</ul>\
						</li>';

				}

				$("#article_pages").append(articleText);			

				if (i == 0) {

				var articleAdjacentText = '\
					<li class="next full">Next <i class="fa fa-angle-double-right"></i></li>';

				} else if (i == article.chapters.length - 1) {

				var articleAdjacentText = '\
					<li class="prev full"><i class="fa fa-angle-double-left"></i> Previous</li>';

				} else {

				var articleAdjacentText = '\
					<li class="prev"><i class="fa fa-angle-double-left"></i> Previous</li>\
					<li class="next">Next <i class="fa fa-angle-double-right"></i></li>';

				}

				$(".article_adjacent[rel='"+i+"']").append(articleAdjacentText);

		


				/*
				var format = '\
				<div class="resource">\
					<div class="resource_image" style="background-image:url('+o.image+')">\
					</div>\
					<h1>'+o.title+'</h1>\
					'+o.content+'\
				</div>';

				$("#bottom-bar").append(format);
				*/

			});

		$(".article_text_content a").each(function(i,o){

			if ($(this).find("img").size() == 0) {

				$(this).prepend('<i class="fa fa-file"></i> ');

				
			}

		});

		}

		
		if (article.resources.length > 0) {

			$("body").append('<div id="resource_container">\
				<!--<div id="resource_container_button"></div>-->\
				<h1><i class="fa fa-bookmark"></i> Resources</h1>\
				<div id="bottom-bar"></div>\
			</div>');
			//$("#bottom-bar").append('<h1>Additional Resources</h1>');



			$.each(article.resources, function(i,o){

			   	var resourceImagePath = "sample/images/"+$.md5(o.id)+'_thumbnail.jpg';

				var format = '\
				<div class="resource">\
					<div class="resource_image" style="background-image:url('+resourceImagePath+')">\
					</div>\
					<h1>'+o.title+'</h1>\
					'+o.content+'\
				</div>';

				$("#bottom-bar").append(format);

			});

		}
		

		//});
		resizeElements(page);


		
	} 
}

function removeTransit(elem) {

	elem.remove()

}

function resizeElements(page){


	$("#main").height("");


	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	var headerHeight = $("#header").outerHeight();
	//$("#main").css("margin-top", headerHeight+"px");
	var magazineWidth = parseInt(windowHeight * 0.3);
	var magazineHeight = parseInt(magazineWidth * 1.3175);
	var magazineMargin = parseInt(magazineWidth * 0.08);

	var magazineUnit = magazineMargin;

	$("#back_button").show();

	$("#status").removeClass("loading");
	//$(window).transition({x: 0})



	if ($("#article_pages").hasClass("swiped") == true) {

		//alert("Removing swipe");
		//$("#article_pages").swipe("destroy");		 

	}


	if (page == "list") {

		$("#back_button").hide();
		$("#status").text("Home");

		$("#main").css("margin-top", headerHeight+"px");
		$("#main").css("padding-left", (magazineUnit*2 + "px"));
		$("#main").css("padding-right", (magazineUnit*2 + "px"));
		$("#main").css("padding-top", (magazineUnit*2 + "px"));
		$("#main").css("padding-bottom", (magazineUnit*2 + "px"));

		
		if (windowWidth > 640) { 


			//var magazineMargin = parseInt(magazineWidth * 0.05);

			//alert(magazineWidth);
			var magazineWidth = parseInt($("#main").width() / 2 / 3);
			var magazineHeight = parseInt(magazineWidth * 1.3175);

			$("#magazine-list div.magazine-list-image").css("height", magazineHeight+"px");
			$("#magazine-list div.magazine-list-image").css("width", magazineWidth +"px"); 
			$("#magazine-list>li").css("width", "50%"); 
			$("#magazine-list>li").css("float", "left"); 		
			$("#magazine-list>li").css("margin-bottom", magazineUnit + "px"); 				
			//$("#magazine-list li").css("padding-left", (magazineMargin + "px"));
			//$("#magazine-list li").css("padding-right", (magazineMargin + "px"));
			//$("#magazine-list li").css("padding-top", (magazineMargin + "px"));
			//$("#magazine-list li").css("padding-bottom", (magazineUnit + "px"));
			//$("#magazine-list li:nth-child(3n-1)").css("margin-right", (magazineUnit + "px"));
			//$("#magazine-list li:nth-child(3n-1)").css("margin-left", (magazineUnit + "px"));
		

		} else {

			var magazineWidth = parseInt($("#main").width() / 3);
			var magazineHeight = parseInt(magazineWidth * 1.3175);

			$("#magazine-list>li").css("width", "100%"); 
			$("#magazine-list>li").css("float", ""); 	
			$("#magazine-list div.magazine-list-image").css("height", magazineHeight+"px");
			$("#magazine-list div.magazine-list-image").css("width", magazineWidth +"px"); 
			$("#magazine-list>li").css("margin-bottom", magazineUnit + "px"); 	


			//$("#magazine-list li").css("padding-bottom", (magazineUnit + "px"));
			//$("#magazine-list li:nth-child(2n)").css("margin-right", (magazineUnit / 2 + "px"));
			//$("#magazine-list li:nth-child(2n)").css("margin-left", (magazineUnit / 2 + "px"));

		};


		$("#magazine-list div.magazine-list-cover").css("width", $("#magazine-list li").width() - magazineWidth - magazineUnit +"px"); 

		$("#magazine-list div.magazine-list-cover").each(function(i,o) {

			$(this).css("margin-top", (magazineHeight - $(this).height()) / 2 + "px");

		});

		var magazineCount = $("#magazine-list li").size();
		var magazineWidthNew = $("#magazine-list li").outerWidth(true);

		var magazineListWidth = magazineCount * magazineWidthNew;


		//$("#magazine-list").width(magazineListWidth);

		var toolbarWidth = $("#header-toolbar-right").outerHeight();

		var magazineListHeight = $("#magazine-list-container").outerHeight();

		//$("#magazine-list").css("margin-top", ((windowHeight / 2) - (magazineListHeight / 2) + headerHeight/2 + "px"));		

		//console.log("MAG LIST HEIGHT: " + magazineListHeight);

		//console.log("MARGIN-TOP: " + ((windowHeight / 2) - (magazineListHeight / 2))); 

		var coverHeight = $(".magazine-list-cover").height();
		//var buttonContainerHeight = $(".magazine-list-button-container").height();

		//alert(buttonContainerHeight);

		//$(".magazine-list-cover").css("bottom", -coverHeight+"px");



	} else if (page == "toc" || page == "localtoc") {

		$("#back_button").attr("destination", "list");
		$("#status").text("Contents");

		$("#main").css("margin-top", headerHeight+"px");
		$("#main").css("padding-left", (magazineUnit*2 + "px"));
		$("#main").css("padding-right", (magazineUnit*2 + "px"));
		$("#main").css("padding-top", (magazineUnit*2 + "px"));
		$("#main").css("padding-bottom", (magazineUnit*2 + "px"));
 
		//var tocWidth = Math.floor(windowWidth * 0.5);
		var tocWidth = windowWidth;
		//var tocMargin = Math.floor(tocWidth * 0.08);


		$("#toc").width(tocWidth - magazineMargin*4);

		var tocWidthNew = $("#toc").width();
		var tocItemWidth = Math.floor(tocWidthNew / 3);

		var tocHeight = Math.floor(tocWidthNew * 0.4);

		$(".toc-item").css("width", tocWidthNew + "px");		
		$(".toc-item").css("min-height", tocHeight * 0.8 + "px");		
		$(".toc-item").css("height", tocHeight * 0.8 + "px");

		$("#main").height($("#toc").height());


		
	} else if (page == "detail") {

		//alert(windowWidth);
		//console.log(windowWidth);

		
		$(".article_image_slide").stop().delay(0).transition({opacity: 1}, 400, function(){


		});
		
		closeResource();

		$("#back_button").attr("destination", "toc-"+currentToc);
		$("#status").text("");


		var articleNo = $("#article_pages>li").size();
		$("#article_pages").width(windowWidth * articleNo);
		$("#article, #article_pages>li").width(windowWidth);


		

		$("#main").css("margin-top", headerHeight+"px");
		$("#main").css("padding-left", (0 + "px"));
		$("#main").css("padding-right", (0 + "px"));
		$("#main").css("padding-top", (0 + "px"));
		$("#main").css("padding-bottom", (0 + "px"));
 
		//var tocWidth = Math.floor(windowWidth * 0.5);
		var tocWidth = windowWidth;
		//var tocMargin = Math.floor(tocWidth * 0.08);

		$(".article_image").height(windowHeight - headerHeight);
		$(".section_image").height((windowHeight - headerHeight) / 3);


		$(".article_title").css("padding", magazineUnit + "px");
		$(".section_title").css("padding", magazineUnit + "px");
		$(".article_image_slide").css("padding", magazineUnit + "px");
		$(".article_image_slide").css("top", magazineUnit*2 + "px");


		$(".article_text, .article_text_content").css("margin-left", magazineUnit*2 + "px");
		$(".article_text, .article_text_content").css("margin-right", magazineUnit*2 + "px");


		
		var adjacentNavHeight = $(".article_adjacent").outerHeight();

		$(".article_text").css("min-height", (windowHeight - headerHeight) / 3 * 2 - magazineUnit*4 - adjacentNavHeight + "px");
		$(".article_text").css("padding-bottom", magazineUnit*2 + "px");
		$(".article_text").css("padding-top", magazineUnit*2 + "px");

		$(".article_ad").css("min-height", (windowHeight - headerHeight) - adjacentNavHeight + "px");

		/* RESOURCE TIME */

		closeResource();

		//console.log(resourceData);
		//$("body").append(resourceData);

		var resourceBtnHeight = $("#resource_container_button").outerHeight();
		var resourceBtnWidth = $("#resource_container_button").outerWidth();

		var resourceHeight = $("#resource_container").outerHeight();

		//$("#resource_container").transition({x: -resourceWidth/2+"px"});


		if (windowWidth > windowHeight) { 

			$("#resource_container").css("width", windowWidth / 2);

		} else {

			$("#resource_container").css("width", windowWidth);

			$(".article_text").css("margin-left", 0);
			$(".article_text").css("margin-right", 0);
		}



		//$("#resource_container").css("bottom", -resourceHeight + resourceBtnHeight);
		$("#resource_container, #resource_container_button").removeAttr("active");
		$("#resource_container").css("height", windowHeight - headerHeight + "px");		
		$("#resource_container").css("top", headerHeight + "px");		

		//$("#resource_container_button").css({ transformOrigin: $("#resource_container_button").outerWidth()+'px 0' }).transition({rotate: "90deg", y: -resourceBtnWidth+"px"});

		//$("#article").css("padding-bottom", (resourceBtnHeight + "px"));
		//$(".article_text").css("padding-bottom", magazineUnit*2 + resourceBtnHeight + "px");
		$(".article_title, .section_title").css("bottom", magazineUnit*2 + "px");

		//alert($("#resource_container").height());

		$("#bottom-bar").css("height", $("#resource_container").height() - $("#resource_container>h1").outerHeight(true) + "px");		
		$("#bottom-bar").css("overflow-y", "auto");		
		$("#bottom-bar").css("-webkit-overflow-scrolling", "touch");				

		var resourceWidth = $("#resource_container").outerWidth();

		var resourceData = $("#resource_container").wrap('<p/>').parent().html();
		$("#resource_container").remove();
		$("body").append(resourceData);

		//alert($("#bottom-bar").height());


		//$("#resource_container_button").css({ transformOrigin: resourceBtnWidth+'px ' + 0 + 'px' }).transition({x: resourceBtnWidth+"px", y: 0+"px", rotate: "0deg"}, 0);


		//alert(resourceWidth);

		//$("#resource_container").stop().transition({x: -resourceWidth +"px"}, 300);
		

		//closeResource();
		
		var IMG_WIDTH = windowWidth,
		currentImg=0,
		maxImages= articleNo;
		speed=500,
		imgs = $("#article_pages");

		//$(".article_image").swipe("destroy");
		

		$(".article_image").swipe("destroy");

		$(".article_image").swipe({
			triggerOnTouchEnd : true,
			swipeStatus : swipeStatus,
			allowPageScroll:"vertical",
			threshold: 50
		});

		imgs.children("li").each(function(i,o){

			$("#status").append("<a class='article_navigation' index='"+i+"'><i class='fa fa-circle' /></a>");

		});


		$(".article_navigation:first").addClass("navigation_highlight");

		resizeContainer(currentImg);
		imgs.addClass("notransition");
		$("#article_pages").addClass("swiped");

		/**
		* Catch each phase of the swipe.
		* move : we drag the div.
		* cancel : we animate back to where we were
		* end : we animate to the next image
		*/

		//$("").

		$(document).off(onHandler, "#open-bottom-bar");

		$(document).on(onHandler, "#open-bottom-bar", function(e) {

			e.preventDefault();

			var barActive = $("#resource_container").attr("active");

			if (barActive == "on" ) {

				//$("#resource_container").removeAttr("active");
				//console.log("closing");
				closeResource();

			} else if (barActive != "on") {

				openResource();

			}	


		});	

		function openResource(elem){

			$(".article_image").swipe("destroy");

			var bottomHeight = $("#resource_container").outerHeight();

			$("#resource_container").remove();
			$("body").append(resourceData);

			$(document).off(onHandler, ".article_navigation");
			$("#status").stop().fadeTo("fast", 0.2);

			//$("#resource_container").css("bottom", -bottomHeight+"px");
			//$("#main").css("padding-bottom", bottomHeight+"px");
			$("#resource_container").attr("active", "on");

			$("body").stop().animate({ scrollTop: "0" }, "fast", function(){	


				$("body").css("overflow-y", "hidden");
				$("body").css("margin-top", -$("body").scrollTop() + "px");
				$("body").height($(window).height());

				//$("#bottom-bar").html("AOTG Additional Reading "+ elem.text());

				$("#resource_container").stop().transition({x: 0+"px"}, function(){


				});


			});






		}

		function closeResource(){


			var resourceBtnHeight = $("#resource_container_button").outerHeight();
			var resourceWidth = $("#resource_container").outerWidth();

			$(".article_image").swipe({
				triggerOnTouchEnd : true,
				swipeStatus : swipeStatus,
				allowPageScroll:"vertical",
				threshold: 50
			});

			$(document).on(onHandler, ".article_navigation", navigationChapter);
			$("#status").fadeTo(0, 1);

			$("body").css("overflow-y", "");
			$("body").css("margin-top", "");
			$("body").height("");
			
			$("#resource_container").stop().transition({x: -resourceWidth +"px"}, 300);
			$("#resource_container").removeAttr("active");


		}




		$(document).off(onHandler, ".article_navigation");
		$(document).on(onHandler, ".article_navigation", navigationChapter);

		$(document).off(onHandler, "ul.article_adjacent>li");
		$(document).on(onHandler, "ul.article_adjacent>li", adjacentChapter);


		function navigationChapter(e){

			e.preventDefault();
			var index = $(this).attr("index");

			particularImage(parseInt(index));


		}

		function adjacentChapter(){

			//alert("Clicked");

			if ($(this).hasClass("next") == true) {

				$(".navigation_highlight").next().click();

			} else if ($(this).hasClass("prev") == true) {

				$(".navigation_highlight").prev().click();

			}


		}




		//alert("Fired");


		function swipeStatus(event, phase, direction, distance, fingers) {
			//If we are moving before swipe, and we are going L or R, then manually drag the images


			if( phase=="move" && (direction=="left" || direction=="right"))
			{
				var duration=0;



				if (direction == "left")
					scrollImages((IMG_WIDTH * currentImg) + distance, duration);

				else if (direction == "right")
					scrollImages((IMG_WIDTH * currentImg) - distance, duration);

				//}

			}

			//Else, cancel means snap back to the begining
			else if ( phase == "cancel")
			{
				scrollImages(IMG_WIDTH * currentImg, speed);


			}

			else if (phase == "start")
			{



			}

			//Else end means the swipe was completed, so move to the next image
			else if ( phase =="end" )
			{





				if (distance > windowWidth / 3) {


					if (direction == "right")
						previousImage()
					else if (direction == "left")
						nextImage()
					/*else 
						scrollImages(IMG_WIDTH * currentImg, speed);*/
				

				} else {

					scrollImages(IMG_WIDTH * currentImg, speed);

				}





			}
		}

		function resizeContainer(index) {


				var currentLi = $("#article_pages>li:eq("+index+")");
				$("#main").height(currentLi.height());
				//$('body').unbind('touchmove');


		}

		function particularImage(index)
		{

				//alert();

			if ($("body").scrollTop() > 0) {

				//$('body').bind('touchmove', function(e){e.preventDefault()})

				$("body").stop().animate({ scrollTop: "0" }, "fast", function(){

					currentImg = parseInt(index);
					scrollImages( IMG_WIDTH * currentImg, speed);
					resizeContainer(index);



				});


			} else {

				currentImg = parseInt(index);
				scrollImages( IMG_WIDTH * currentImg, speed);
				resizeContainer(index);

			}




		}


		function previousImage()
		{

				currentImg = Math.max(currentImg-1, 0);
				scrollImages( IMG_WIDTH * currentImg, speed);
				resizeContainer(currentImg);

		}

		function nextImage()
		{

				currentImg = Math.min(currentImg+1, maxImages-1);			
				scrollImages( IMG_WIDTH * currentImg, speed);
				resizeContainer(currentImg);

		}

		/**
		 * Manually update the position of the imgs on drag
		 */
		function scrollImages(distance, duration)
		{

			imgs.removeClass("notransition");

			imgs.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");

			//inverse the number we set in the css

			$(".article_navigation:eq("+currentImg+")").addClass("navigation_highlight");
			$(".article_navigation:eq("+currentImg+")").siblings("a").removeClass("navigation_highlight");

			var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();

			imgs.css("-webkit-transform", "translate3d("+value +"px,0px,0px)");



		}



	}


}


var currentPage = null;
var dragging = false;

$(document).on("touchmove", function(){
      dragging = false;
});

$(document).on("touchend", function(){
      dragging = false;
});


var onHandler = "click";
//var outHandler = "mouseout";

var hash = window.location.hash;
hash = hash.replace("#", "");

var currentToc = 0;


$(window).on('hashchange', function(){

	var hash = window.location.hash;
	hash = hash.replace("#", "");

	if (hash == "") {

		//hash = "list";

	}

	if (hash != "detail") {

		//closeResource();

	}

	hashSplit = hash.split("-");

	console.log(hashSplit);

	loadPage(hashSplit[0], hashSplit[1]);


});








function isiPhone(){
    return (
        (navigator.platform.indexOf("iPhone") != -1) ||
        (navigator.platform.indexOf("iPod") != -1)
    );
}

$(window).resize(function(){

	//alert(currentPage);

	//alert("Resize");

	if(isiPhone()){
	
	   //alert('iPhone detected');

	} else {

		resizeElements(currentPage);

	}


})


$(window).scroll(function(e){


	//console.log("Scroll! " + scrollTop);

	//e.preventDefault();



})




$(window).bind('orientationchange', _orientationHandler);

function _orientationHandler(){

	//alert("Orientation");
	resizeElements(currentPage);

}


$(document).on(onHandler, "#magazine-list>li", function(e) {


	e.preventDefault();

	//var location = $(this).attr("location");
	var issue = $(this).attr("issue");
	currentToc = issue;
	window.location.hash = "toc-"+issue;


});	

$(document).on(onHandler, "#back_button", function(e) {


	e.preventDefault();

	$(this).hide();
	var destination = $(this).attr("destination");
	window.location.hash = destination;

});	

$(document).on("touchstart", ".article_adjacent>li", function(e) {


	e.preventDefault();
	$(this).addClass("header-toolbar-touch");

});	

$(document).on("touchend", ".article_adjacent>li", function(e) {


	e.preventDefault();
	$(this).removeClass("header-toolbar-touch");

});	

$(document).on("touchstart", "#back_button", function(e) {


	e.preventDefault();

	$(this).addClass("header-toolbar-touch");

});	




$(document).on("touchend", "#back_button", function(e) {


	e.preventDefault();

	$(this).removeClass("header-toolbar-touch");

});	


$(document).on("touchstart", ".toc-item", function(e) {

	//$(this).stop().transition({ scale: 1, opacity: 0.5 }, 300, 'ease', function(){});

});

$(document).on(onHandler, ".toc-item", function(e) {



	e.preventDefault();

	var article = $(this).attr("article");
	window.location.hash = "detail-"+article;



});	


$(document).on(onHandler, ".article_text_content a", function(e) {

	e.preventDefault();
	var href = $(this).attr("href");
	window.open(href, '_blank', 'location=no');


	/*	
	var confirm = window.confirm("Would you like to leave the app and open AOTG?");



	if (confirm == true) {

		//window.location.href = "http://aotg.com";
		window.open('http://aotg.com', '_blank', 'location=yes');
	}
	*/

});	

$(document).on(onHandler, ".resource", function(e) {

	e.preventDefault();
	//var href = $(this).attr("href");
	window.open("http://aotg.com", '_blank', 'location=no');


	/*	
	var confirm = window.confirm("Would you like to leave the app and open AOTG?");



	if (confirm == true) {

		//window.location.href = "http://aotg.com";
		window.open('http://aotg.com', '_blank', 'location=yes');
	}
	*/

});	




function swapResource(elem){


	//$("#bottom-bar").html("AOTG results for: "+ elem.text());


}



/*
$(document).on(onHandler, "#bottom-bar", function(e) {

	e.preventDefault();

	var barActive = $("#bottom-bar").attr("active");
	var linkActive = $(this).attr("active");

	closeResource();
	$(this).removeAttr("active");
	$("#open-bottom-bar").removeAttr("active");



});	
*/
