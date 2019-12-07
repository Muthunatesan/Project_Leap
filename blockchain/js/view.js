function timeConverter(UNIX_timestamp){
  if (UNIX_timestamp === null) return "none, no pending debits";
  var a = new Date(UNIX_timestamp * 1000);
  return a.toLocaleString("en-US");
}


function updateUserInfo(){
    $("#total_owed").html("$"+getTotalOwed(web3.eth.defaultAccount));
    $("#last_active").html(timeConverter(getLastActive(web3.eth.defaultAccount)))
}

var names = ["Carter","Emma","Henry","Josephine","Mason","Penelope","Ryan","Uriel","William","Zoey"]
var members = []

function updateActiveUsers(){
    $("#all_users").html(getUsers().map(function (u,i) { 
      if(members.length > 0)
      {
        var name = "";
        for(i = 0; i < members.length; i++)
        {
          if(members[i].hasOwnProperty(u))
          {
            name = members[i][u];
          }
        }
      }
      return "<li>" + name + ": " + u + "</li>" }));
}

$("#myaccount").change(function() {
    web3.eth.defaultAccount = $(this).val();
    updateUserInfo();
});


$("#addiou").click(function() {


  add_IOU($("#creditor").val(), $("#amount").val());
  updateUserInfo();
  updateActiveUsers();
});

var opts = web3.eth.accounts.map(function (a) { 
    if(members.length < 10) 
    {
      var o = {};
      o[a] = names[members.length];
      members.push(o)
    }
    var name = '';
    for(i = 0; i < members.length; i++)
        {
          if(members[i].hasOwnProperty(a))
          {
            name = members[i][a];
          }
        }

  return '<option value="'+a+'">'+ name + ': ' + a +'</option>' 
})

for(i = 0; i < opts.length; i++)
{
  opts[i] = names[i] + ': ' + opts[i];
}

$(".account").html(opts);
$(".address_list").html(web3.eth.accounts.map(function (a) 
  {
    if(members.length < 10) 
    {
      var o = {};
      o[a] = names[members.length];
      members.push(o)
    }
    var name = '';
    for(i = 0; i < members.length; i++)
        {
          if(members[i].hasOwnProperty(a))
          {
            name = members[i][a];
          }
        }
    return '<li style="font-size: 16px">'+ name + ': ' + a + '</li>' 
  }))

updateUserInfo();
updateActiveUsers();
