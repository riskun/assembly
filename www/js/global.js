$.event.special.tap = {
  setup: function() {
    var self = this,
      $self = $(self);

    $self.on('touchstart', function(startEvent) {
      var target = startEvent.target;

      $self.one('touchend', function(endEvent) {
        if (target == endEvent.target) {
          $.event.simulate('tap', self, endEvent);
        }
      });
    });
  }
};


function loadPage(page, number){


	$("#status").addClass("loading");
	$("#status").text('');  

	//alert($(window).width());
	$("#main").removeClass("notransition");

	$("#main").transition({x: -$(window).width()}, function(){

		$("#main").html("");
 
		$.ajax({
			dataType: 'jsonp',
			url: "http://ckprototype.com/assembly/modules/"+page+"_jsonp.php?id="+number+"&callback=?",
			success: function(data){

				//console.log(data);

				var noLoaded = 0;

				//$("#main").html(data);

				if (number != undefined) {

					window.location.hash = page+"-"+number;

				} else {

					window.location.hash = page;

				}
 
 				placeElements(page, data);

				currentPage = page;

				resizeElements(currentPage);


				$("#main").transition({x: 0}, function(){


					$("#main").addClass("notransition");
			 
					//var tocWidth = Math.floor(windowWidth * 0.5);					

				});



			}

		})

	});


}

function placeElements(page, data){

	$("#resource_container").remove();

	if (page == "list") {


		$("#main").append('<div id="magazine-list-container"></div>');
		$("#magazine-list-container").append('<ul id="magazine-list"></ul>');

		$.each(data, function(i,o){

			var format = '\
				<li issue="'+o.issue+'">\
					<div class="magazine-list-cover">\
						<div class="magazine-list-button-container">\
								<i class="fa fa-shopping-cart"></i> BUY\
								<i class="fa fa-eye"></i> VIEW\
						</div>\
					</div>\
					<div class="magazine-list-image" style="background-image:url('+o.image+')">\
					</div>\
					<h1>'+o.title+'</h1>\
				</li>';

			$("#magazine-list").append(format);

		});


	} else if (page == "toc") {

		$("#main").append('<div id="toc"></div>');

		$.each(data, function(i,o){

			//alert(o.excerpt);

			var format = '\
			<div class="toc-item" article="'+o.article+'">\
				<div class="toc-item-cover">\
				</div>\
				<div class="toc-item-image" style="background-image:url('+o.image+')">\
				</div>\
				<div class="toc-item-text">\
					<h1>'+o.title+'</h1>\
					<p>'+o.excerpt+'</p>\
				</div>\
			</div>';

			$("#toc").append(format);

		});


		
	} else if (page == "detail") {

		console.log(data);

		//$.each(data, function(i,o){

		var format = '<div id="article"></div>';

		$("#main").append(format);

		var format = '<ul id="article_pages"></ul>';

		$("#article").append(format);		

		var articleImage = '\
			<li>\
				<div class="article_image" style="background-image:url('+data.image+')">\
					<div class="article_title">\
						'+data.title+'\
					</div>\
				</div>\
				<!--\
				<div id="article_text">\
						'+data.content+'\
				</div>\
				-->\
			</li>';

		$("#article_pages").append(articleImage);

		
		//$("#header").append('<div id="swipe_bar">SWIPE HERE</div>');
		
		/*
		$("#swipe_bar").stop().delay(1000).transition({opacity: 1}, 400, function(){

			$("#swipe_bar").delay(3000).transition({opacity: 0}, 400, function(){


				$("#swipe_bar").remove();

			});

		});
		*/

		if (data.sections.length > 0) {

			/*
			$("body").append('<div id="resource_container">\
				<div id="resource_container_button"><i class="fa fa-bookmark" id="open-bottom-bar"></i><span>Resources</span></div>\
				<div id="bottom-bar"></div>\
			</div>');
			*/


			$.each(data.sections, function(i,o){

				var articleText = '\
					<li>\
						<div class="section_image" style="background-image:url('+o.image+')">\
							<div class="section_title">\
								'+o.title+'\
							</div>\
						</div>\
						<div class="article_text">\
							<div class="article_text_content">\
								'+o.content+'\
							</div>\
						</div>\
					</li>';

				$("#article_pages").append(articleText);			


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

		}

		/*
		if (data.resource.length > 0) {

			$("body").append('<div id="resource_container">\
				<div id="resource_container_button"><i class="fa fa-bookmark" id="open-bottom-bar"></i><span>Resources</span></div>\
				<div id="bottom-bar"></div>\
			</div>');
			//$("#bottom-bar").append('<h1>Additional Resources</h1>');

			$.each(data.resource, function(i,o){

				var format = '\
				<div class="resource">\
					<div class="resource_image" style="background-image:url('+o.image+')">\
					</div>\
					<h1>'+o.title+'</h1>\
					'+o.content+'\
				</div>';

				$("#bottom-bar").append(format);

			});

		}
		*/

		//});


		
	} 
}

function removeTransit(elem) {

	elem.remove()

}

function resizeElements(page){

	//alert(page);
	//$("body").stop().transition({opacity: 0}, 0);

	//$(window).scrollTop(0);

	/*
	  $("#main").swipe( {
	    //Generic swipe handler for all directions
	    swipe:function(event, direction, distance, duration, fingerCount) {
	      
	      $("#status").text("You swiped " + direction );  
	    
	    },
	     threshold:0
	  });	
*/
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

			var magazineWidth = parseInt(($("#main").width() - magazineUnit*3) / 4);
			var magazineHeight = parseInt(magazineWidth * 1.3175);
			//var magazineMargin = parseInt(magazineWidth * 0.05);

			//alert(magazineWidth);

			$("#magazine-list div.magazine-list-image").css("height", magazineHeight+"px");
			$("#magazine-list li").css("width", magazineWidth +"px"); 

			
			//$("#magazine-list li").css("padding-left", (magazineMargin + "px"));
			//$("#magazine-list li").css("padding-right", (magazineMargin + "px"));
			//$("#magazine-list li").css("padding-top", (magazineMargin + "px"));
			$("#magazine-list li").css("padding-bottom", (magazineUnit + "px"));
			$("#magazine-list li:nth-child(3n-1)").css("margin-right", (magazineUnit + "px"));
			$("#magazine-list li:nth-child(3n-1)").css("margin-left", (magazineUnit + "px"));
		

		} else {

			var magazineWidth = parseInt(($("#main").width() - magazineUnit) / 2);
			var magazineHeight = parseInt(magazineWidth * 1.3175);


			$("#magazine-list div.magazine-list-image").css("height", magazineHeight+"px");
			$("#magazine-list li").css("width", magazineWidth +"px"); 


			$("#magazine-list li").css("padding-bottom", (magazineUnit + "px"));
			$("#magazine-list li:nth-child(2n)").css("margin-right", (magazineUnit / 2 + "px"));
			$("#magazine-list li:nth-child(2n)").css("margin-left", (magazineUnit / 2 + "px"));

		}


		var magazineCount = $("#magazine-list li").size();
		var magazineWidthNew = $("#magazine-list li").outerWidth(true);

		var magazineListWidth = magazineCount * magazineWidthNew;


		//$("#magazine-list").width(magazineListWidth);

		var toolbarWidth = $("#header-toolbar-right").outerHeight();

		/*
		$("#magazine-list").css("padding-top", magazineMargin*2 + "px");
		$("#magazine-list").css("padding-bottom", magazineMargin*2 + "px");
		$("#magazine-list").css("padding-left", windowWidth/2 - magazineWidthNew/2 + "px");
		$("#magazine-list").css("padding-right", windowWidth/2 - magazineWidthNew/2 + "px");
		*/

		var magazineListHeight = $("#magazine-list-container").outerHeight();

		//$("#magazine-list").css("margin-top", ((windowHeight / 2) - (magazineListHeight / 2) + headerHeight/2 + "px"));		

		//console.log("MAG LIST HEIGHT: " + magazineListHeight);

		//console.log("MARGIN-TOP: " + ((windowHeight / 2) - (magazineListHeight / 2))); 

		var coverHeight = $(".magazine-list-cover").height();
		var buttonContainerHeight = $(".magazine-list-button-container").height();

		//alert(buttonContainerHeight);

		//$(".magazine-list-cover").css("bottom", -coverHeight+"px");



	} else if (page == "toc") {

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

		$(".article_text").css("padding-top", magazineUnit*2 + "px");

		$(".article_text, .article_text_content").css("margin-left", magazineUnit*2 + "px");
		$(".article_text, .article_text_content").css("margin-right", magazineUnit*2 + "px");

		$(".article_text").css("min-height", (windowHeight - headerHeight) / 3 * 2 - magazineUnit*4 + "px");


		$(".article_text").css("padding-bottom", magazineUnit*2 + "px");

		var resourceBtnHeight = $("#resource_container_button").outerHeight();
		var resourceHeight = $("#resource_container").outerHeight();

		$("#resource_container").css("bottom", -resourceHeight + resourceBtnHeight);
		$("#resource_container, #resource_container_button").removeAttr("active");

		//$("#article").css("padding-bottom", (resourceBtnHeight + "px"));
		$(".article_text").css("padding-bottom", magazineUnit*2 + resourceBtnHeight + "px");
		$(".article_title, .section_title").css("bottom", magazineUnit*2 + resourceBtnHeight + "px");


		if (windowWidth > 640) { 

	

		} else {

			$(".article_text").css("margin-left", 0);
			$(".article_text").css("margin-right", 0);
		}


		
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

		imgs.find("li").each(function(i,o){

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

		$(document).on(onHandler, ".article_navigation", function(e) {


			e.preventDefault();
			var index = $(this).attr("index");
			//$(window).scrollTop(0);
			//$("html, body").animate({ scrollTop: "0" });


			//currentImg = parseInt(index);

			particularImage(parseInt(index));


		});


		//alert("Fired");


		function swipeStatus(event, phase, direction, distance, fingers)
		{
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


		}

		function particularImage(index)
		{


			$("body").stop().animate({ scrollTop: "0" }, "fast", function(){

				currentImg = parseInt(index);

				console.log("current: " + currentImg);
				scrollImages( IMG_WIDTH * currentImg, speed);
				resizeContainer(index);

			});


		}


		function previousImage()
		{



			$("body").stop().animate({ scrollTop: "0" }, "fast", function(){

				currentImg = Math.max(currentImg-1, 0);
				scrollImages( IMG_WIDTH * currentImg, speed);
				resizeContainer(currentImg);

			});




		}

		function nextImage()
		{



			$("body").stop().animate({ scrollTop: "0" }, "fast", function(){

				currentImg = Math.min(currentImg+1, maxImages-1);			
				scrollImages( IMG_WIDTH * currentImg, speed);
				resizeContainer(currentImg);

			});



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

		hash = "list";

	}

	if (hash != "detail") {

		closeResource();

	}

	hashSplit = hash.split("-");

	console.log(hashSplit);

	loadPage(hashSplit[0], hashSplit[1]);


});

$(window).load(function(){

    FastClick.attach(document.body);


	hashSplit = hash.split("-");
	//loadPage(hashSplit[0], hashSplit[1]);


	if (hashSplit[0] == "toc") {

		$(window).trigger("hashchange");


	} else if (hashSplit[0] == "detail") {

		//window.location.hash = "list";
		$(window).trigger("hashchange");

	} else {

		window.location.hash = "list";
		$(window).trigger("hashchange");
		$(window).trigger("hashchange");

		//loadPage("list");

		/*
		$.ajax({

			url: "modules/list.php",
			success: function(data){

				//alert("Hello");
				currentPage = "list";			
				$("#main").html(data);
				resizeElements(currentPage);


			}

		})
		*/

	}


	$("body").stop().transition({opacity: 1});




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


$(window).scroll(function(){

	//alert("Scroll!");

})




$(window).bind('orientationchange', _orientationHandler);

function _orientationHandler(){

	//alert("Orientation");
	resizeElements(currentPage);

}


$(document).on(onHandler, "#magazine-list>li", function(e) {


	e.preventDefault();

	var issue = $(this).attr("issue");
	currentToc = issue;
	window.location.hash = "toc-"+issue;


});	

$(document).on(onHandler, "#back_button", function(e) {


	e.preventDefault();

	var destination = $(this).attr("destination");
	window.location.hash = destination;

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


$(document).on(onHandler, ".resource", function(e) {

	e.preventDefault();
	
	var confirm = window.confirm("Would you like to leave the app and open AOTG?");

	if (confirm == true) {

		//window.location.href = "http://aotg.com";
		window.open('http://aotg.com', '_blank', 'location=yes');
	}


});	



function openResource(elem){

	//var windowHeight = $(window).height();
	//var windowWidth = $(window).width();
	var bottomHeight = $("#resource_container").outerHeight();
	//var headerHeight = $("#header").outerHeight();

	//alert(windowHeight);

	//$("#resource_container").css("height", bottomHeight+"px");

//	alert($("#bottom-bar").height());

	//$("#resource_container").css("bottom", -bottomHeight+"px");
	//$("#main").css("padding-bottom", bottomHeight+"px");
	$("#resource_container").attr("active", "on");
	//$("#bottom-bar").html("AOTG Additional Reading "+ elem.text());

	$("#resource_container").stop().transition({bottom: 0+"px"}, function(){

		/*
		var slidePos = (windowHeight / 3) + headerHeight - elem.height();

	     $('html, body').animate({
	         scrollTop: elem.offset().top - slidePos
	     }, "fast");
		*/

	});





}

function closeResource(){

	//var windowHeight = $(window).height();
	//var windowWidth = $(window).width();
	//var bottomHeight = $("#resource_container").outerHeight();
	
	var resourceBtnHeight = $("#resource_container_button").outerHeight();
	var resourceHeight = $("#resource_container").outerHeight();

	//$("#resource_container").css("bottom", -resourceHeight + resourceBtnHeight);

	$("#resource_container").stop().transition({bottom: -resourceHeight + resourceBtnHeight +"px"}, 300);
	$("#resource_container, #resource_container_button").removeAttr("active");

}


function swapResource(elem){


	//$("#bottom-bar").html("AOTG results for: "+ elem.text());


}

$(document).on(onHandler, ".article_text .highlight, #open-bottom-bar, #resource_container_button", function(e) {

	e.preventDefault();

	var barActive = $("#resource_container").attr("active");
	var linkActive = $(this).attr("active");




	

	if (barActive == "on" && linkActive == "on") {

		closeResource();
		$(this).removeAttr("active");

	} else if (barActive == "on" && linkActive != "on") {

		swapResource($(this));
		$(this).attr("active", "on");
		$(".highlight").not(this).removeAttr("active");


	} else if (barActive != "on" && linkActive != "on") {

		openResource($(this));
		$(this).attr("active", "on");



	}	


});	

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
