var $=jQuery.noConflict();
var zWin=$(window);
var large=$("#large");
var largeImg=$("#largeImg");
var totalImg=17;
var cid;
$(function () {
	 FastClick.attach(document.body);
});
var mainObj={
	init:function () {
		var htmlTempl='';
		var fontsize=$("html").css("font-size");
		for(var i=1;i<=totalImg;i++)
		{
			var marginLeft=0.1+'rem';
			i%4==1 ? marginLeft=0+'rem' : marginLeft;
			htmlTempl+="<li style='margin-left:"+marginLeft+"' class='animated bounceIn' data-id="+i+"><canvas id='cvs_"+i+"'></canvas></li>";
			var imgObj=new Image();
			imgObj.index=i;
			imgObj.onload=function () {
				var cvs=$("#cvs_"+this.index)[0].getContext('2d');
				var test=imgObj.width;
				cvs.width=imgObj.width;
				cvs.height=imgObj.height;
				cvs.drawImage(this,0,0);
			}
			imgObj.src="Images/"+i+".jpg";
		}
		$("#imgList").html(htmlTempl);
	},
	loadImage:function (id,callback) {
		var imgObj=new Image();
		var imgsrc="Images/large"+id+".jpg";;
		imgObj.onload=function () {
			var imgW=this.width;
			var imgH=this.height;
			var winW=zWin.width();
			var winH=zWin.height();
			var relW=winH*imgW/imgH;
			var relH=winW*imgH/imgW;
			var paddingLeft=(winW-relW)/2;
			var paddingTop=(winH-relH)/2;
			large.css({
				width:winW,
				height:winH,
			}).show();
			largeImg.css("width","auto").css("height","auto");
			largeImg.css("margin","0");
			if (imgH/imgW>winH/winW) {
				largeImg.attr("src",imgsrc).css("height",winH).css("width",relW).css("margin-left",paddingLeft);
			}
			else
			{
				largeImg.attr("src",imgsrc).css("width",winW).css("height",relH).css("margin-top",paddingTop);
			}
			callback&&callback();
		}
		imgObj.src=imgsrc;
	}
}
mainObj.init();


// 用委托添加点击每个小图的事件
$("#container ul").delegate("li","click",function () {
	var id=cid=$(this).attr("data-id");
	mainObj.loadImage(id);
});


// 大图的交互操作
$("#largeImg").click(function () {
	 $("#large").hide();
 });
$("#largeImg").swipe({
       
        swipe:function(event, direction, distance, duration, fingerCount) {
          if (direction=="left") {
          	cid==totalImg ? cid=totalImg :mainObj.loadImage(++cid,function () {
				largeImg[0].addEventListener("webkitAnimationEnd", function () {
					largeImg.removeClass("animated bounceInRight");
					largeImg[0].removeEventListener("webkitAnimationEnd");
				});
				$("#largeImg").addClass("animated bounceInRight");
			});
          }
          if (direction=="right") {
          	cid==1 ? cid=1: mainObj.loadImage(--cid,function () {
				largeImg[0].addEventListener("webkitAnimationEnd",function () {
					largeImg.removeClass("animated bounceInLeft");
					largeImg[0].removeEventListener("webkitAnimationEnd");
				});
			 	$("#largeImg").addClass("animated bounceInLeft"); 
		 	});
          }  
      	},
      	threshold:30
      });

// 导航条的切换
$("header nav .item a").click(function () {
	 $("header nav .item a").removeClass("active");
	 $(this).addClass("active");
})
// 侧滑菜单
$(".menu").click(function () {
	  $(".mask").show();
	  $(".sidebar").css("right","0rem");
})
$(".mask,.sidebar").swipe({
	swipe:function (event,direction,distance,duration,fingerCount) {
		 if(direction=="right"){
		 	$(".mask").hide();
		 	$(".sidebar").css("right","-4.5rem");
		 }
	},
	threshold:30
});

