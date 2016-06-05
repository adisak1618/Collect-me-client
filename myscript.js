
var url = chrome.extension.getURL('images/logo.jpg');
// var iframe = "<iframe src='"+url+"' id='collectmetoolbar1618'>";
var login_section = "<div class='clogin_section'><form><div class='cprofile'><div class='cimage'><center><h1>Sign In</h1></center></div><div class='input-box'><div class='item-input'><input type='text' name='cmeusername' placeholder='Username'/></div><div class='item-input'><input type='password' name='cmepassword' placeholder='Password'/></div></div><div class='item-input'><button type='button' id='collectmesubmit' class='collectmebotton' name='cmesubmit'>LOGIN </button></div></div></form></div>";
var sigup_section = " <div class='csignup_section'><center><h1>Join Us</h1></center> <form> <div class='cprofile'> <div class='input-box'> <div class='item-input'> <input type='text' name='csignup_name' placeholder='Name'/> </div><div class='item-input'> <input type='text' name='csignup_email' placeholder='Email'/> </div><div class='item-input'> <input type='password' name='cme_signup_password' placeholder='Password'/> </div></div><div class='item-input'> <button type='button' id='collectme_signup_submit' class='collectmebotton' name='cmesubmit'> Signup </button> </div></div></form> </div>";
var header = "<div class='cheader'><div class='cstatusbar'></div><h1 class='collectmename'>Collect Me</h1><div class='cbottom_section'><span class='creadermode' href='#'>Reader Mode</span><span id='collectmelogout'>Logout</span></div></div>";
var toolbar = "<div id='collectmetoolbar' class='' ><div id='collectmemainwrapper'><div id='collectmewrapper'>"+header+"<div class='content'></div></div></div><div class='cme-frontpage'>"+login_section+"<hr/>"+sigup_section+"</div></div>";
var mainPage = "<div id='collectme-mainpage' class='collectmescrollbar'><div class='cmecontent'></div><div class='collectmeclose'>CLOSE</div></div>";
var secondPage = "<div id='collectme-secondpage' class='collectmescrollbar'><div class='cmecontent'></div><div class='collectme-back'>Back</div></div>";
var reader_mode = "<div id='collectme-reader-mode'>"+mainPage+secondPage+"</div>";



var popup_box = "<div id='collectme_popup'></div>";
var text, article, profile_words,profile_words_array;
var user_word_length = 0;
var words = ['a'];
var background = "<div id='collectmebackground'></div>";
$("html").append(toolbar);
$("html").append(reader_mode);
$("html").append(popup_box);
$("html").append(background);


var data = ['love','world','mikel','object','function','adisak','chaiyakul','oat','kmutt','university','bangmod','mom','dad','what','fuck','kiss','dota','badman','amazing','photograph','need','do','harry','magic','content','marry','jobs','got','food','dude'];
var createitems = false;
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {


  if(msg.action == "show"){
    $("#collectmetoolbar").toggleClass("showcm");
    // console.log(chrome.storage.sync.get('token'));
    // chrome.storage.sync.get('token',function(data){
    //   if(data != null){
    //     $.get("localhost/v0v1/words?token="+chrome.storage.sync.get('token'), function(){
    //       console.log(data);
    //       renderPage();
    //     });
    //   };
    // });
    isLogin();

  }
});


$("#collectmelogout").click(function(){
  chrome.storage.sync.remove('token');
  $("#collectmemainwrapper").removeClass('showcm');
  createitems = false;
});
$(".collectmeclose").click(function(){
  togglePage();
});
$(".collectmename").click(function(){

  togglePage();
  $("#collectme-reader-mode #collectme-mainpage .cmecontent").html("<center><h1>History</h1></center><center><h2> "+user_word_length+" Words</h2></center>"+profile_words);
  $(".chistory").click(function(){

    console.log( profile_words_array[Number($(this).parent(".cword").data("role"))]);
    history_object = profile_words_array[Number($(this).parent(".cword").data("role"))];
    backbutton = "<div class='chistory_toolbar'><div style=''>Back</div></div>";
    history_text = backbutton+ ""+ history(history_object);
    $("#collectme-secondpage").html(history_text).addClass('collectme-secondpage-show');
    console.log(history_text);
    $("#collectme-reader-mode #collectme-secondpage .chistory_toolbar").click(function(){
      $("#collectme-secondpage").html("").removeClass('collectme-secondpage-show');
    });
  });
});

$("#collectme_signup_submit").click(function(){
  var signup_name = $("input[name='csignup_name']").val();
  var signup_email = $("input[name='csignup_email']").val();
  var signup_password = $("input[name='cme_signup_password']").val();
  $.ajax({
    type: "POST",
    url: api_url+'/v0v1/authen/signup',
    data: {
      'name': signup_name,
      'email':signup_email,
      'password':signup_password
    },
    success: function(data){

      if(data.user_id != null){

        // localStorage.setItem('token',data.token);
        popup("SUCCESS!!!");
        chrome.storage.sync.set({'token': data.token,'name': data.name});

        isLogin();
      }
    }
  });
});
$("#collectmesubmit").click(function(){
  var cmusername = $("input[name='cmeusername']").val();
  var cmpassword = $("input[name='cmepassword']").val();
  // chrome.runtime.sendMessage({action: "login", username: cmusername, password:cmpassword}, function(response) {
  //   console.log(response);
  // });
  $.ajax({
    type: "POST",
    url: api_url+'/v0v1/authen/login',
    data: {
      'email': cmusername,
      'password':cmpassword
    },
    success: function(data){

      if(data.success == true){
        console.log(data);
        // localStorage.setItem('token',data.token);

        popup("<center>LOGIN SUCCESS!</center>");
        chrome.storage.sync.set({'token': data.token,'name': data.name});

        isLogin();
      }
    }
  });
});

$('#collectmetoolbar .creadermode').click(function(){
  togglePage();
  $("#collectme-reader-mode #collectme-mainpage .cmecontent").html(article.content);
});

$('#clickme').click(function(){

});

function isLogin(){
  // Feed content
  chrome.storage.sync.get('token',function(token){
    console.log(token);
    $.get(api_url+'/v0v1/words?token='+token.token, function(data){
      console.log(data);
      if(data.words != null){
        chrome.storage.sync.get('name',function(name){
          $(".collectmename").html(name.name);
        });

        $("#collectmemainwrapper").addClass('showcm');
        renderPage(data.words);
        profile(data.words);
      }else{
        $("#collectmemainwrapper").removeClass('showcm');
      }
    });
  });


}
function profile(words){
  console.log("WORDDDDDDDDDDDDDDDD!");
  console.log(words);

  profile_words = "";
  profile_words_array = [];
  words.reverse().map(function(value, key){
    console.log(key);
    profile_words += "<div class='cword "+(value.understand ? "" : "donotunderstan")+"' data-role='"+key+"'> <div class='cwordvalue'><span>"+value.name+"</span></div><div class='ccount'>"+value.count+"</div><div class='chistory'><div></div></div></div>";
    profile_words_array.push(value.history);

  });
  console.log(profile_words);
}

function addHistory(addword, addcount, addunderstand){
  profile_words += "<div class='cword "+(addunderstand ? "" : "donotunderstan")+"'> <div class='cwordvalue'><span>"+addword+"</span></div><div class='ccount'>"+addcount+"</div></div>";
}

function renderPage(user_word){
  user_word_length = user_word.length;
  //   console.log("WORD!!!!!!");
  // console.log(user_word);
  array_user_word = user_word
  .filter(function(item){
    if(item.understand == true){
      return true;
    }else{
      return false;
    }
  })
  .map(
    function(item){
      //console.log(item);
      return item.name;
    }
  );
  // console.log(array_user_word);

  var documentClone = document.cloneNode(true);
  var loc = document.location;
  var uri = {
    spec: loc.href,
    host: loc.host,
    prePath: loc.protocol + "//" + loc.host,
    scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
    pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
  };
  article = new Readability(uri, documentClone).parse();
  text = article.content.replace(/<\/?[^>]+>/ig, " ");
  text = text.toLowerCase();
  words = text.match(/[a-zA-Z]+/g)
  // console.log("RESULT");
  // console.log(text);
  // console.log(words);
  // console.log(article);



  var items = "";

  console.log(words);
  words = uniq(words);
  console.log(words);
  console.log(array_user_word);
  // words = $(words).not(array_user_word);
  console.log("Fillllll");
  array_user_word.push("nbsp");
  console.log($(words).not(array_user_word));
  words = $(words).not(array_user_word);
  words.map(function(object, value){
    // console.log(object);
    // console.log(value);
    items+= createWord(value);
  });


  if(!createitems){

    $("#collectmetoolbar #collectmewrapper .content").html(items);
    createitems = true;
    $("#collectmetoolbar #collectmewrapper .item .got").click(function(){
      $(this).parent(".item").slideUp();
      addWord($(this).parent(".item").find(".cmeword").html() ,1 ,1 );
      addHistory($(this).parent(".item").find(".cmeword").html(),1,true);
      user_word_length++;
    });
    $("#collectmetoolbar #collectmewrapper .item .ngot").click(function(){
      $(this).parent(".item").slideUp();
      addWord($(this).parent(".item").find(".cmeword").html(), 0, 2);
      translation($(this).parent(".item").find(".cmeword").html());
      // popup("<center><h2>"+$(this).parent(".item").find(".cmeword").html()+" --> xxxxxxx</h2></center>");
      addHistory($(this).parent(".item").find(".cmeword").html(),1,false);
      user_word_length++;

    });
  }



}

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {

        return seen.hasOwnProperty(item) ? false : (seen[item] = true && item.length > 1);
    });
}

function createWord(word){
  var item = "<div class='item'><div class='got'>o</div><div class='cmeword'>"+word+"</div><div class='ngot'>x</div></div>";
  return item;
}
function addWord(item,understandWord,user_action){
  addWords([{name: item, understand: understandWord, url: location.href, title: document.title, action: user_action}]);
}
function addWords(words){
    data = JSON.stringify(words);
    chrome.storage.sync.get('token',function(token){
      $.ajax({
        type: "POST",
        url: api_url+"/v0v1/words/add?token="+token.token,
        data: {
          words:data
        },
        success: function(data){
          console.log(data);
        }
      });
    });

}

function popup(data){
  $("#collectme_popup").removeClass('popup_show');
  var hasToolbar = 0;
  if($("#collectmetoolbar").hasClass()){
    hasToolbar = 300;
  }
  window_w =  (window.innerWidth-hasToolbar)/2;

  $("#collectme_popup").css("left",window_w).html(data).addClass('popup_show');
  setTimeout(function(){ $("#collectme_popup").removeClass('popup_show'); },4000);

}

function togglePage(){
  var window_w =  ((window.innerWidth*80)/100)-300;

  $("#collectme-reader-mode").css("width",window_w);
  $("#collectme-reader-mode").toggleClass("readershow");
  $("#collectmebackground").toggleClass("cshowbg");
}
//read_date title url action
function history(items){
  var htmlstring = "<div>";
  if(items instanceof Array){
    items.reverse().map(function(item, key){
      htmlstring+= "<div class='cword "+(item.action == 1? "":"donotunderstan")+"' > <div class='cwordvalue'><span>"+item.title+"</span></div><div class='cdate'>"+format_date(item.read_date)+"</div><div class='clink'><a href='"+item.url+"' target='_blank'>Link</a></div></div>";
    });
    htmlstring+="</div>";
    return htmlstring;
  }
}


function format_date(time){
  var d = new Date(time);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    return (curr_date + "-" + curr_month + "-" + curr_year);
}

function translation(text){
  url_api = 'https://www.googleapis.com/language/translate/v2?key='+google_api+'&q='+text+'&source=en&target=th';
  $.ajax({
    type: "GET",
    url: url_api,
    success: function(data){
      console.log(data.data.translations[0].translatedText);
      popup(data.data.translations[0].translatedText);

    }
  });
}

$( 'body' ).on( 'mouseup', function(){
  console.log("mouseup");
  sel = document.getSelection();
  sel_string = String(sel);
  if( sel_string.length > 2 ){
    //alert( String(sel) );
    translation(sel_string);
  }
});
//submenu of word --> history
