var editText = angular.module('editText',['toolBar','mainApp']);
     
editText.directive('pageleft',function($mdToast,$document){
	return{
		restrict:"AE",
		templateUrl:"./template/page.left.tmpl.html",
		scope:{},
		link:function($scope){
            var indexArray=10;

			$scope.createNewPage = function(){
				//第一个页面必须有 swiper-slide-active
			    $('.swiper-slide').hasClass('isEdit')?$('.swiper-slide').removeClass('isEdit').css("display","none"):'';
				var newSlide = $('<div class="swiper-slide isEdit"></div>');
				$(".isEdit").css('display','block');
                newSlide.appendTo($('#pagesList'));
                showBackgroundEditPanel($mdToast,$document);
			}
		}
	}
});


//init edit bar
editText.directive('edittool1',function($mdToast,$parse,$sce,$compile,$document,$rootScope,$state,projectFn,AuthService,SERVER_URL){
	return {
		restrict:'AE',
		templateUrl:'./template/editbar.html',
		scope:{},
		link:function($scope,$rootScope,$mdDialog,$state){
            var loadingProjectById = projectFn.getProjectId();

			if(loadingProjectById){
				projectFn.loadEditPage(loadingProjectById).then(function(data){
						$compile($("#pagesList").attr('ng-bind-html','page.editCode'))($scope)
						$scope.page = { "editCode":""};
						$scope.page.editCode = $sce.trustAsHtml(data.pages.editCode);
						$scope.editcode = data.pages.editCode;
						$("#pagesList").attr('data-projectid',projectIdInEditroolDirective);
					    $(document).on('click',' .isEdit > div ',function(e){
					    	console.log('edit page works length'+$(e.target).find('.mText').length+"||"+e.target.nodeName);
					    	console.log($(e.target).hasClass('mText')+":$(this).hasClass('mText')")
					    	if($(e.target).hasClass('mText')){
					    		$(e.target).focus();
				  	  			$(".rotate-rightTop").css('display','none');
				  	  			$('.ui-selected').removeClass('ui-selected');
				  	  			$(e.target).parent().addClass('ui-selected');
				  	  			$(e.target).parent().find(".rotate-rightTop").show();
				  	  			initSelectedDraggable()
					    	}else if($(e.target).hasClass('mImage')){
					    		$('.mText').blur();
					    		$(".rotate-rightTop").css('display','none');
				  	  			$('.ui-selected').removeClass('ui-selected');
				  	  			$(e.target).parent().addClass('ui-selected');
				  	  			$(e.target).parent().find(".rotate-rightTop").show();
				  	  			initSelectedDraggable()
					    	}
					    });
						
	           },function(){})
			}

			if($("#userProfileInDashboard").hasClass('dashboardActive')){
				$("#welcome").css('display','none')
				var user = AuthService.getUserInfo();
				$('<span class="userImage"><img id="uImage" src="'+user[0].userPhoto+'"></span><span class="userName ng-binding"  role="button" tabindex="0"> '+user[0].userName+' </span>').prependTo($("#userProfile"));
			}
			
			$(document).on('click','#loginOut',function(){
				setTimeout(function(){
				$("#loginOut").remove();
				$("#uName").html('欢迎,登陆');
				},1000);
			})
	        $scope.myProject = function(){

	        		if($("#welcome").css('display') == "block"){

			    		$mdToast.show({
			           controller: function($scope,$mdToast,$mdDialog,$rootScope,$state){
			           		$scope.loginClose = function(){
				      			$('#loginOverLay').css('display','none');
				      	    }
			      			$scope.loginBtn = function(){
			      				$scope.loading = true;
				    		 	$scope.credentials = { "username":$scope.user.firstName,"password":$scope.user.passWord};
				  		     	AuthService.login($scope.credentials).then(function(user){
				  		     	if(typeof(user.userName)!=="undefined"){
				  		     			$rootScope.userName = user.userName;
					  		     		$rootScope.userPhoto = user.userPhoto;
										$('<span class="userImage"><img id="uImage" src="'+user.userPhoto+'"></span><span class="userName ng-binding" role="button" tabindex="0"> '+user.userName+' </span>').prependTo("#userProfile")
			        			 		$("#welcome").css('display','none')
										$("#loginOverLay").css('display','none');
										$("#pagesList").css('display','block');
										AuthService.setUserInfo(user.userName,user.userPhoto);
										$scope.loading = false;
										$state.go('.dashboard');
				  		     		}else{
				  		     			$scope.error ="用户名或密码错误";
				  		     		}
				  		     	},function(){
				  		     		
				  		     	});
			  		     	
			 			}
			      },
			      templateUrl:'./template/user.login.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			      hideDelay: false
			    });
	        	}else{
	        			
	        			$mdToast.show({
			               controller: function($scope,$mdDialog,$rootScope,$state){
							$state.go('.dashboard');
			             }
			
			           });
	        		}
	        }
			$scope.userLogin = function(){
				$("#pagesList").css('display','none');
		        $mdToast.show({
			      controller: function($q,$scope,$mdDialog,$rootScope){
			      		$scope.loginClose = function(){
				      		$('#loginOverLay').css('display','none');
				      	}
			      	$scope.loginBtn = function(){
			      		$scope.loading = true;
			    		 $scope.credentials = { "username":$scope.user.firstName,"password":$scope.user.passWord};
			  		     	AuthService.login($scope.credentials).then(function(user){
			  		     		console.log(user.userName+"////////////user.userName")
			  		     		if(typeof(user.userName)!=="undefined"){
			  		     			$scope.loading = false;
				  		     			$rootScope.userName = user.userName;
					  		     		$rootScope.userPhoto = user.userPhoto;
										$('<span class="userImage"><img id="uImage" src="'+user.userPhoto+'"></span><span class="userName ng-binding" role="button" tabindex="0"> '+user.userName+' </span>').prependTo("#userProfile")
			        			 		$("#welcome").css('display','none')
										$("#loginOverLay").css('display','none');
										$("#pagesList").css('display','block');
										AuthService.setUserInfo(user.userName,user.userPhoto);
				  		     		}else{
				  		     			$scope.error ="用户名或密码错误";
				  		     		}
			  		     	},function(){
			  		     	});

			 		}

			      },
			      templateUrl:'./template/user.login.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			      hideDelay: false
			    });
		
			  
			}



			$scope.newText = function(){
                createNewText($mdToast,$document);
				// showTextEditPanel($mdToast,$document);
				//var editPanelIsShow = true;
				showTextEditPanel($mdToast,$document);
				initElement('.mText','text',$mdToast,$document);
				//initText($mdToast,$document,editPanelIsShow);
			};

			$scope.newImages = function(){
				$('.ui-selected').removeClass('ui-selected');
				$('.rotate-rightTop').css('display','none');
				 var newImage = true;
				 showEditPanel($mdToast,$document,'image',newImage);
				//initElement('.mImage','imageWithOverlay',$mdToast,$document);
			};

			$scope.newGraph = function(){
				$mdToast.show({
			      // controller: 'ToastCtrl',
			      templateUrl: './template/graphPropertyPanel.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });
			};



			$scope.newInput = function(){
                showInputEditPanel($mdToast,$document);
				initElement('.formElement','input',$mdToast,$document);
				
			}



			$scope.newTextarea = function(){
				$mdToast.show({
			      controller:function($mdToast,$document){
			      	// createTextarea($mdToast,$document);
			      },
			      templateUrl: './template/form.textarea.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });	
				
			}



			$scope.newCheckbox = function(){
				$mdToast.show({
			      controller:function($mdToast,$document){
			      	// createCheckBox($mdToast,$document);
			      },
			      templateUrl: './template/form.checkbox.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });	
			}



			$scope.newRadiobox = function(){
				$mdToast.show({
			      controller:function($mdToast,$document){
			      	// createRadioBox($mdToast,$document);
			      },
			      templateUrl: './template/form.radiobox.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });					
			}



			$scope.newButton = function(){

				$mdToast.show({
			      controller:function($mdToast,$document,$rootScope){
			      	// createButton($mdToast,$document,$rootScope);
			      },
			      templateUrl: './template/form.button.tmpl.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });		
			}




			$scope.newForm = function(){
				if($('#formContent').length == 0){
					createNewForm($mdToast,$document);
					initElement('.mForm','form',$mdToast,$document);
			    
				}else{
					initElement('.mForm','form',$mdToast,$document);
			   }
			};

		}
	}
})


function showFormEditPanel($mdToast,$document){
	$mdToast.show({
			      controller: function($scope){

			      		//common function
			      		// initFormDraggable($mdToast,$document);
					

				  		$scope.$watch("setFormBackgroundColor",function(newValue,oldColor){
							$('#myForm').css('backgroundColor',newValue);	
						});

    					//set form Radius 
	    				$scope.setFormRadiusSize   = function(){
	    					console.log('image radius size works');
	    					$("#myForm").css("borderRadius",$scope.formRadius.size+"px");
	    				}



	    				//set form border
	    				$scope.setFormBorderWidthSize = function(){
							$('#myForm').css('borderWidth',$scope.formBorderWidth.size+"px");
						}


						//set form border style
						$scope.formBorderStyle = [{"formBorderStyle":"none"},{"formBorderStyle":"solid"},{"formBorderStyle":"dotted"},{"formBorderStyle":"double"},{"formBorderStyle":"dashed"}];
	    				//set FontFamily
	    				$scope.setFormBorderStyle = function(newStyle){
	    					console.log('set form style works'+newStyle);
	    					// $('#myForm').css('border','"1px red '+newStyle+'"');
	    					$('#myForm').css('border','1px #eeeeee '+newStyle);
	    					$('#formBorderStyle').html(newStyle);
	    				}



	    				//set form border color
	    				$scope.$watch("setFormBorderColor",function(newColor,oldColor){
	    					$('#myForm').css('borderColor',newColor);
	    				});

						

						//set form animate
	    				$scope.formAnimate = function(){
	    					console.log('form works');
	    					function testAnimation(x){
							    $('#myForm').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
							      // $(this).removeClass();
							    });
							  }
							  $('#js--formAnimations').change(function(){
							    var anim = $(this).val()
							    testAnimation(anim);
							  }); 
	    				}
			      },
			      templateUrl: './template/formPropertyPanel.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
		});
}


function projectIsNull(){
	var status = typeof($("#pagesList").data('projectid')) == "undefined"?true:false;
	return status;
}
//Create new text
function createNewText($mdToast,$document){
	$('.ui-selected').removeClass('ui-selected');
	$('.rotate-rightTop').css('display','none');
	var iText = $('<div class="ui-selected" data-type="text" style="width:200px;height:60px;position:absolute;"><div class="rotate-location rotate-rightTop" style="display:block;"><i class="icon-undo"></i></div><div class="mText" contentEditable="true" style="overflow: hidden; border: 0px none rgb(0, 0, 0); border-radius: 0px;">text placeholder</div></div>');
    // var iText = $('<div class="ui-selected" data-type="text" style="width:200px;height:60px;position:absolute;"><div class="mText" contentEditable="true" style="overflow: hidden; border: 0px none rgb(0, 0, 0); border-radius: 0px;">text placeholder</div></div>');
    var currentPage = $('.isEdit');
    iText.appendTo(currentPage);
}


function createNewForm($mdToast,$document){
	//text link
	var formDiv = $('<form class="form-horizontal ui-selected mForm" id="formContent" style="font-size:10px;"><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Name</label><div class="col-sm-10"><input type="text" class="form-control" id="m1111" placeholder="" name="name"></div></div><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Email</label><div class="col-sm-10"><input type="email" class="form-control" id="m2222" placeholder="" name="email"></div></div><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Address</label><div class="col-sm-10"> <input type="text" class="form-control" id="m3333" placeholder=""></div></div><div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">Other</label><div class="col-sm-10"><textarea class="form-control formElement" id="m444" name="comments" rows="3"></textarea></div></div><div class="form-group formElement"><div class="col-sm-offset-2 col-sm-10"><div class="checkbox formElement"><label><input type="checkbox" id="m555" name="call me"> Remember me</label></div></div></div><div class="form-group formElement"><div class="col-sm-offset-2 col-sm-10"><button  id="formSubmit" class="btn btn-default">Submit</button></div></div></form>');
	var oDiv = $("<div id='myForm' style='width:90%;'></div>");
	formDiv.appendTo(oDiv);
	oDiv.appendTo($('.isEdit'));
	// initFormDraggable($mdToast,$document);
}


function createInput($mdToast,$document){
	var formInput=$('<div class="form-group ui-state-default" data-type="input"><input type="text"  name="text1" class="form-control"  placeholder="textPlaceholder"></div>');
	formInput.appendTo($('#formContent'));
	initFormDraggable($mdToast,$document);
}

function createTextarea(){
	var formTextarea=$('<div class="form-group ui-state-default" data-type="textarea" ><textarea class="form-control" rows="3"></textarea></div>');
	formTextarea.appendTo($('#formContent'));
}

function createCheckBox(){
	var formCheckbox=$(' <div class="checkbox ui-state-default"  data-type="checkbox"><label><input type="checkbox"> Remember me</label></div>');
	formCheckbox.appendTo($('#formContent'));
}

function createRadioBox(){
	var formRadioBox = $('<div class="radio ui-state-default" data-type="radio" ><label><input type="radio"  checked><span>text placeholder</span></label></div>');
	formRadioBox.appendTo($('#formContent'));
}

function createButton($rootScope){
	var projectIdForMyForm = $('#pagesList').attr('class') == ''? 'projectIdIsActive' : $('#pagesList').attr('class');
	var formButton = $('<div class="form-group ui-state-default" data-type="input"><input id="projectId" type="hidden"  name="projectId" value="'+projectIdForMyForm+'" class="form-control"  placeholder="textPlaceholder"></div>'+'<div class="form-group ui-state-default"  data-type="button"><button type="button" class="btn btn-info" id="formSubmit"><span>text placeholder</span></button></div>');
	formButton.appendTo($('#formContent'));
}

function showTextEditPanel($mdToast,$document)	{
				$mdToast.show({
			      controller: function($scope,$mdDialog){ 
			      	setFontSize();
			      	
			      	//get  FonttSize
			      	$scope.getFontSize = function(fontSize){
    					$('.ui-selected > .mText').css('fontSize',$scope.fontSize.size);
    					$('#fontSize').html(fontSize); 
    				}
    				function setFontSize(){
            		$('#fontSize').html($(".ui-selected > .mText").css('fontSize'));
    				}

    				 	//get  FonttSize
			      	$scope.getLineHeight = function(fontSize){
    					$('.ui-selected > .mText').css('lineHeight',$scope.lineHeight.size);
    				}

    				//init FontFamily
    				$scope.fontFamily = [{"name":"Helvetica","value":"Helvetica"},{"name":"Arial","value":"Arial"},{"name":"Verdana","value":"Verdana"},{"name":"Tahoma","value":"Tahoma"},{"name":"Georgia","value":"Georgia"},{"name":"sans-serif","value":"sans-serif"},{"name":"monospace","value":"monospace"},{"name":"fantasy","value":"fantasy"},{"name":"cuisive","value":"cuisive"},{"name":"Helvetica, sans-serif","value":"Helvetica, sans-serif"},{"name":"Arial, sans-serif","value":"Arial, sans-serif"},{"name":"Lucida Grande', sans-serif","value":"Lucida Grande', sans-serif"},{"name":"Verdana,sans-serif","value":"Verdana,sans-serif"},{"name":" Tahoma, sans-serif","value":" Tahoma, sans-serif"},{"name":"'Trebuchet MS', sans-serif","value":"'Trebuchet MS', sans-serif"},{"name":"Georgia, serif","value":"Georgia, serif"},{"name":"Times, serif","value":"Times, serif"},{"name":"微软雅黑","value":"Microsoft YaHei"},{"name":"华文细黑","value":"STHeiti"},{"name":"黑体","value":"SimHei"},{"name":"楷体_GB2312","value":"KaiTi_GB2312"}];
    				// $scope.fontFamily = [{"name":"Helvetica","value":"Helvetica"},{"name":"Arial":"value":"Arial"},{"name":"Verdana":"value":"Verdana"},{"name":"Tahoma":"value":"Tahoma"},{"name":"Georgia":"value":"Georgia"},{"name":"sans-serif":"value":"sans-serif"},{"name":"微软雅黑","value":"Microsoft YaHei"},{"name":"楷体_GB2312","value":"KaiTi_GB2312"},{"name":"仿宋_GB2312","value":"FangSong_GB2312"},{"name":"楷体","value":"KaiTi"},{"name":"仿宋","value":"FangSong"},{"name":"新宋体","value":"NSimSun"},{"name":"宋体","value":"SimSun"},{"name":"黑体","value":"SimHei"},{"name":"华文仿宋","value":"STFangsong "},{"name":"华文宋体","value":"STSong"},{"name":"华文楷体","value":"STKaiti"},{"name":"华文黑体","value":"STHeiti"},{"name":"华文细黑","value":"STHeiti Light"}];
    				//set FontFamily
    				$scope.setFontFamily = function(){
    					
    					$('.ui-selected > .mText').css('fontFamily','"'+$scope.selected+'"');
    					
    					console.log($scope.selected+">>><<,");
    					//$('#fontFamily').html($scope.selected);
    				}

    				//set FontColor
    				$scope.$watch("setFontColor",function(newColor,oldColor){
    					$('.ui-selected > .mText').css('color',newColor);
    				});

    				//init line height
    				$scope.setLineHeight = function(){
    					$('.ui-selected > .mText').css('lineHeight',$scope.selected.lineHeight*100+"%");
    				}

    				//setFontBold
    				$scope.setFontBold = function(){
    					if($('.ui-selected > .mText').css("fontWeight") != "bold"){
    						$('.ui-selected > .mText').css("fontWeight","bold");
    						$(".bold-active").css("background","#eeeeee");
    					}else if($('.ui-selected > .mText').css("fontWeight") == "bold"){
    						$('.ui-selected > .mText').css("fontWeight","");
    						$(".bold-active").css("background","");
    					}
    				};

    				//set Italic
    				$scope.setFontItalic = function(){
    					if($('.ui-selected > .mText').css("fontStyle") != "italic"){
    						$('.ui-selected > .mText').css("fontStyle","italic");
    						$(".italic-active").css("background","#eeeeee");
    					}else if($('.ui-selected > .mText').css("fontStyle") == "italic"){
    						$('.ui-selected > .mText').css("fontStyle","");
    						$(".italic-active").css("background","");
    					}
    				}
    				
    				//set Text Decoration
    				$scope.setTextDecoration = function(){
    					if($('.ui-selected > .mText').css("textDecoration") != "underline"){
    						$('.ui-selected > .mText').css("textDecoration","underline");
    						$(".textDecoration-active").css("background","#eeeeee");
    					}else if($('.ui-selected > .mText').css("textDecoration") == "underline"){
    						$('.ui-selected > .mText').css("textDecoration","");
    						$(".textDecoration-active").css("background","");
    					}
    				}

    				//set TextAlignLeft
    				$scope.setTextAlign = function(textPos){
    					if($('.ui-selected > .mText').css("textAlign") != textPos){
    						$('.ui-selected > .mText').css("textAlign",textPos);
    						$(".text"+textPos+"-active").css("background","#eeeeee");
    					}else if($('.ui-selected > .mText').css("textAlign") == textPos){
    						$('.ui-selected > .mText').css("textAlign","");
    						$(".text"+textPos+"-active").css("background","");
    					}
    				}

    				//set Radius 
    				$scope.getRadiusSize = function(){
    					$('.ui-selected').css("borderRadius",$scope.radius.size+"px");
    				}

    				//set FontBackgroundColor
    				$scope.$watch("setFontBackgroundColor",function(newValue,oldValue){
    					$('.ui-selected').css("backgroundColor",newValue);
    				});

    				//set FontOpacity
    				$scope.getFontOpacity  = function(){
    					$('.ui-selected > .mText').css("opacity",$scope.opacity.numberValue);
    				};

    				// //set setFontTransform
    				// $scope.setFontTransform = function(){
    				// 	$('.ui-selected > .mText').css('transform','rotate('+$scope.transform.numberValue+'deg)');
    				// }

    				//init border style
		    		$scope.borderStyle = [{"borderStyle":"none"},{"borderStyle":"dotted"},{"borderStyle":"dashed"},{"borderStyle":"solid"},{"borderStyle":"double"},{"borderStyle":"groove"},{"borderStyle":"ridge"},{"borderStyle":"inset"},{"borderStyle":"outset"},{"borderStyle":"inherit"}]
		    		//set  border style
		    		$scope.setBorderStyle = function(){
		    			$('.ui-selected > .mText').css('borderStyle',$scope.selected.borderStyle);	
		    		};
		    		
		    		//set font link
		    		$scope.$watch("setFontLink",function(newValue,oldValue){
						$('.ui-selected > .mText').attr("data-link",newValue);		    			
		    		})

		    		//set border color
		    		$scope.$watch("setBorderColor",function(newValue,oldColor){
		    			$('.ui-selected > .mText').css('borderColor',newValue);	
		    		});

		    		//text animate
		    		$scope.textAnimate = function(){
					    testAnimation($scope.selected);
		    		 function testAnimation(x){
					    $('.ui-selected').removeClass().addClass(x + ' animated ui-selected ui-draggable ui-resizable').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					      // $(this).removeClass();
					    });
					  }
		    		}
		    		
		    		//text link
		    		$scope.setTextLink = function(){
		    			$mdDialog.show({
		    				controller:function($scope){
		    				  $scope.saveTextLinkCancel = function(){
		    	    			$mdDialog.cancel();
		    	    			$('.md-dialog-container').css('display','none');
		    	    		  }
		    				  $scope.saveTextLink = function(){
		    				   $(".ui-selected").attr("onclick","window.open('"+$('#textLink').val()+"','target','param')");
		    				   $mdDialog.cancel();
		    				   $('.md-dialog-container').css('display','none');
		    				   	$("#addBox").show();
								setTimeout(function(){$("#addBox").fadeTo(3000).hide();	},1000);
		    				  }
		    				},
		    				templateUrl:'./template/page.addLink.tmpl.html',
		    				parent:$document[0].querySelector("#main"),
		    				hideDelay:false
		    			});
		    		}


    			},
			      templateUrl: './template/fontPropertyPanel.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			      hideDelay: false
			      // position: $scope.getToastPosition()
			    });
}//end of showTextEditPanel function





function initFormDraggable($mdToast,$document){
	
	$('#formContent div').on('click',function(event){
         event.stopPropagation();  
        $(".isEdit").css("border","");
        $("#imageSelected").css("border","");
        $("#textSelected").css("border","");              
        $('#selectedFormItem').attr('id','');
        $(this).attr('id','selectedFormItem');
        $(this).css({'border':'#dedede 2px dashed','overflow':'hidden'});

       var theTypeOfSelectedItem = $(this).data('type');
       console.log(theTypeOfSelectedItem+"///"+$(this).attr('type'));
       switch(theTypeOfSelectedItem){
            case "input" :  showInputEditPanel($mdToast,$document);
            break;
            case "textarea": showTextareaEditPanel($mdToast,$document);
            break;
            case "radio":    showRadioEditPanel($mdToast,$document);
            break;
            case "checkbox": showCheckboxEditPanel($mdToast,$document);
            break;
            case "button":   showButtonEditPanel($mdToast,$document);
            break;
       }

	});


	$('#myForm').draggable({'position':'absolute'});
	$("#myForm").css({'resize':'both','overflow':'hidden','width':'80%','min-height':'350px','padding':'2%'});
    $('#myForm').on("mouseover",function(){
    	$(this).css('opacity','0.5');
    })
    $('#myForm').on("mouseout",function(){
    	$(this).css('opacity','1');
    })

}






// show input edit panel if input active
function showInputEditPanel($mdToast,$document){
	$mdToast.show({
      controller:function($scope,$mdToast,$document){
      	// createInput($mdToast,$document);
      	$scope.$watch('inputLable',function(newValue,oldValue){
      		//$scope.inputLable = newValue;
      		console.log(newValue+"$scope.inputLable");
      	});

      	$scope.$watch('requiredStatus',function(newValue,oldValue){
      		//$scope.requiredStatus = newValue;
      		console.log(newValue+'$scope.requiredStatus')
      	});

      	$scope.$watch('inputType',function(newValue,oldValue){
      		//$scope.inputType = newValue;
      		console.log(newValue+"////")
      	});

      	$scope.createInputFn = function(){
      		var initInput = $('<div class="form-group formElement"><label for="inputEmail3" class="col-sm-2 control-label">'+$scope.inputLable+'</label><div class="col-sm-10"><input readonly type="'+$scope.inputType+'" class="form-control" name="'+$scope.inputLable+'" placeholder=""></div></div>');
      		initInput.appendTo($('#formContent'));
      	} 
      },
      templateUrl: './template/form.input.tmpl.html',
      parent : $document[0].querySelector('#editModulePosition'),
      hideDelay: false
	});	
}

// show textarea edit panel if textarea active
function showTextareaEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().parent().attr('id','selectedFormItem');
		$(this).parent().parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.textarea.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}

// show button edit panel if button active
function showButtonEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().attr('id','selectedFormItem');
		$(this).parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.button.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}

// show checkbox edit panel if checkbox active
function showCheckboxEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().attr('id','selectedFormItem');
		$(this).parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.checkbox.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}


// show radiobox edit panel if radiobox active
function showRadioEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function(){
	      	//createInput();
	      	if($('#selectedFormItem').length >0){
			$('#selectedFormItem').removeAttr('style');
			$('#selectedFormItem').removeAttr('id');
		}
		$(this).parent().attr('id','selectedFormItem');
		$(this).parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

 
	    $(function() {
		    $( "#formContent" ).sortable({
		      revert: true
		    });
		});

	      },
	      templateUrl: './template/form.radiobox.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}

// show radiobox edit panel if radiobox active
function showBackgroundEditPanel($mdToast,$document){
		$mdToast.show({
	      controller:function($scope){
			//set FontColor
			$scope.$watch("setPageBackgroundColor",function(newColor,oldColor){
				$('.isEdit').css('backgroundColor',newColor);
			});
		
			$(this).parent().attr('id','selectedFormItem');
			$(this).parent().css({'border':'#dedede 3px dashed','overflow':'hidden'});

	 
		    $(function() {
			    $( "#formContent" ).sortable({
			      revert: true
			    });
			});

	      },
	      templateUrl: './template/page.background.tmpl.html',
	      parent : $document[0].querySelector('#editModulePosition'),
	       hideDelay: false
	      // position: $scope.getToastPosition()
		});	
}



function showImageEditPanel($mdToast,$document,newImage){
	var activeOpacity = $('.ui-selected').data('opacity');
	$mdToast.show({
			      controller: function($scope,$mdDialog){
				   if(newImage){
				   	 $mdDialog.show({
				      controller: function($scope,$compile,getImageList,imageActionService){
				      $scope.imageList = getImageList.data;		  
					   $scope.imageSelected = function(target){
							$compile($('<div class="ui-selected" data-type="image" style="width:200px;height:200px;position:absolute;"><div class="rotate-location rotate-rightTop"><i class="icon-undo"></i></div><div class="mImage" ng-click="imageActive()" style="position: absolute; width: 100%; height:100%;overflow: hidden; border: 0px none rgb(0, 0, 0); border-radius: 0px;background-image: url('+target+');background-size:100% 100%;"></div></div>').appendTo($('.isEdit')))($scope);
						    initElement('.mImage','image',$mdToast,$document);
						    $("#imgpop").animate({left:"-99999px"},200);
						    $('.md-dialog-backdrop').remove();
							$('.md-scroll-mask').remove();
							$('.md-scroll-mask-bar').remove();
							$('.md-dialog-container').remove();
					    }

						$scope.removeImage = function(imageId){
							console.log('imageId in controller'+imageId)
					      	imageActionService.removeImage(imageId);
					      	$("#"+imageId).remove();
					    }

					    $scope.uploadImage = function(element){
					    	 $scope.$apply(function(scope) {
						         var photofile = element.files[0];
						         var reader = new FileReader();
						         reader.onload = function(e) {
						           $scope.prev_img = e.target.result;
						           imageActionService.addImage(photofile,$scope);
						           console.log($scope.prev_img+"/////////")
						         };
						        console.log( reader.readAsDataURL(photofile)+".........");
						     });
					    	
					    }
					
				      },
				      resolve:{
				      		getImageList :function(imageActionService){
				      		return imageActionService.loadImage();
				      	}
				      },
				      templateUrl: './template/addImage.tmpl.html',
			          parent: $document[0].querySelector('#main')
			    	 });

				   }
                   
		          /*
					use below to return the value on edit panel
			      */

			      $scope.imageRadius  = {"size":$('.ui-selected').data('radius')};
			      $scope.selected     = $(".ui-selected").data('animate');
                  $scope.opacity      = {"numberValue":activeOpacity};

    			  $scope.getImageOpacity = function(){
      					$('.ui-selected').css('opacity',$scope.opacity.numberValue);
      					$('.ui-selected').attr('data-opacity',$scope.opacity.numberValue);
  				   }

				
				//set image Radius 
    				$scope.setImageRadiusSize   = function(){
    					$('.ui-selected').attr('data-radius',$scope.imageRadius.size);
    					$(".ui-selected >.mImage").css("borderRadius",$scope.imageRadius.size+"px");
    				}
				//set image animate
				   $scope.setImageAnimate = function(){
				   		$('.ui-selected').attr('data-animate',$scope.selected);
				   	 	testAnimation($scope.selected);
				   	  	function testAnimation(x){
						    $('.ui-selected').removeClass().addClass(x + ' animated ui-selected ui-draggable ui-resizable').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						    });
						 }
				   }

				   //set font link
		    // 		$scope.$watch("setImageLink",function(newValue,oldValue){
		    // 			console.log(newValue+"newValuenewValuenewValuenewValue")
						// if(newValue){
						// 	$(".ui-selected").addClass('hasLink');
						// 	$(".ui-selected").attr("onclick","window.open('"+newValue+"','target','param')");

						// }	    			
		    // 		})


					$scope.setImageLink = function(){
						  	console.log('xxx')
		    			$mdDialog.show({
		    				controller:function($scope){
		    				  $scope.saveImageLinkCancel = function(){
		    	    			$mdDialog.cancel();
		    	    			$('.md-dialog-container').css('display','none');
		    	    		  }
		    				  $scope.saveImageLink = function(){
		    				  	console.log('xxx')
		    				   $(".ui-selected").attr("onclick","window.open('"+$('#textLink').val()+"','target','param')");
		    				   $mdDialog.cancel();
		    				   $('.md-dialog-container').css('display','none');
		    				   	$("#addBox").show();
								setTimeout(function(){$("#addBox").fadeTo(3000).hide();	},1000);
		    				  }
		    				},
		    				templateUrl:'./template/page.addImageLink.tmpl.html',
		    				parent:$document[0].querySelector("#main"),
		    				hideDelay:false
		    			});
		    		}

			      },
			      templateUrl: './template/imagePropertyPanel.html',
			      parent : $document[0].querySelector('#editModulePosition'),
			       hideDelay: false
			      // position: $scope.getToastPosition()
			    });



			    function DialogController($scope, $mdDialog) {
				
				  $scope.hide = function() {
				    $mdDialog.hide();
				  };
				  $scope.cancel = function() {
				    $mdDialog.cancel();
				  };
				  $scope.answer = function(answer) {
				    $mdDialog.hide(answer);
				  };
				}

}


// init element 

function initElement(clickOnTargetElementName,panelType,$mdToast,$document){
	$(document).ready(function(){
		$('.rotate-rightTop').on('mouseover',function(){ $(this).css('display','block');});
	
		var selected = $([]), offset = {top:0, left:0}; 

		$( ".isEdit > div" ).draggable({
		    start: function(ev, ui) {
		      // ev.stopPropagation();
		        if ($(this).hasClass("ui-selected")){
		            selected = $(".ui-selected").each(function() {
		               var el = $(this);
		               el.data("offset", el.offset());
		            });
		        }
		        else {
		            selected = $([]);
		            $(".isEdit > div").removeClass("ui-selected");
		        }
		        offset = $(this).offset();
		    },
		    drag: function(ev, ui) {
		        var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
		        selected.not(this).each(function() {
		        var el = $(this), off = el.data("offset");
		        el.css({top: off.top + dt, left: off.left + dl});
		        });
		    }
		}).resizable({ handles: 'n, e, s, w,se,sw,ne,nw' });

		$( ".isEdit " ).selectable();

		//rotate function
		applyRotation();
		function applyRotation() {
		    $('.rotate-rightTop').draggable({
		        opacity: 0.01,
		        helper: 'clone',
		        drag: function (event, ui) {
		            var rotateCSS = 'rotate(' + ui.position.left + 'deg)';
		            $(this).parent().css({
		                '-moz-transform': rotateCSS,
		                    '-webkit-transform': rotateCSS
		            });
		        }
		    });
		}



		$(clickOnTargetElementName).on('click',function(e){
			showEditPanel($mdToast,$document,panelType);
			e.stopPropagation();
			if(clickOnTargetElementName == ".formElement"){
				 if($(e.target).hasClass("ui-selected")){
			  	  $(e.target).focus();
			  	  $(".rotate-rightTop").css('display','none');
			  	  $(e.target).find(".rotate-rightTop").show();
			  }else if(!$(e.target).hasClass("ui-selected")){
			  	  $(e.target).focus();
			  	  $(".rotate-rightTop").css('display','none');
			  	  $('.ui-selected').removeClass('ui-selected');
			  	  $(e.target).addClass('ui-selected');
			  	  $(e.target).find(".rotate-rightTop").show();
			  }  
			}else{
			  if($(e.target).parent().hasClass("ui-selected")){
			  	  $(e.target).focus();
			  	  $(".rotate-rightTop").css('display','none');
			  	  $(e.target).parent().find(".rotate-rightTop").show();
			  }else if(!$(e.target).parent().hasClass("ui-selected")){
			  	  $(e.target).focus();
			  	  $(".rotate-rightTop").css('display','none');
			  	  $('.ui-selected').removeClass('ui-selected');
			  	  $(this).parent().addClass('ui-selected');
			  	  $(e.target).parent().find(".rotate-rightTop").show();
			  }  
			}
		 
		});

       $('#pagesList').on('mousedown',function(){
       		console.log(' works works');
       		$('.mText').blur();
       		 $(".rotate-rightTop").css('display','none');
       })});
}

function showEditPanel ($mdToast,$document,panelType,newImage){
	switch(panelType){
		case "image":showImageEditPanel($mdToast,$document,newImage);
		break;
		case "text" :showTextEditPanel($mdToast,$document);
		break;
		case "form" :showFormEditPanel($mdToast,$document);
		case "input":showInputEditPanel($mdToast,$document);
	}

}



function initSelectedDraggable(){
	$(document).ready(function(){
		$('.rotate-rightTop').on('mouseover',function(){ $(this).css('display','block');});
		var selected = $([]), offset = {top:0, left:0}; 
		$( ".isEdit > div" ).draggable({
		    start: function(ev, ui) {
		      // ev.stopPropagation();
		        if ($(this).hasClass("ui-selected")){
		            selected = $(".ui-selected").each(function() {
		               var el = $(this);
		               el.data("offset", el.offset());
		            });
		        }
		        else {
		            selected = $([]);
		            $(".isEdit > div").removeClass("ui-selected");
		        }
		        offset = $(this).offset();
		    },
		    drag: function(ev, ui) {
		        var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
		        selected.not(this).each(function() {
		        var el = $(this), off = el.data("offset");
		        el.css({top: off.top + dt, left: off.left + dl});
		        });
		    }
		}).resizable({ handles: 'n, e, s, w,se,sw,ne,nw' });

		$( ".isEdit " ).selectable();

		//rotate function
		applyRotation();
		function applyRotation() {
		    $('.rotate-rightTop').draggable({
		        opacity: 0.01,
		        helper: 'clone',
		        drag: function (event, ui) {
		            var rotateCSS = 'rotate(' + ui.position.left + 'deg)';
		            $(this).parent().css({
		                '-moz-transform': rotateCSS,
		                    '-webkit-transform': rotateCSS
		            });
		        }
		    });
		}
});
}