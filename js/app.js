var codin9cafe = {} || "";

codin9cafe.vm = (function(){
  var vm = {};
  vm.init = function(){
    firebase.initializeApp(config);
  };

  return vm; 
}())

codin9cafe.controller = function(){
  codin9cafe.vm.init();
  return {
    events: function(){
      var ref = firebase.database().ref("events/");
      var events = m.firebase(ref.orderByChild("num"));
      events.forEach(function(e){
        e.opened = m.prop(false);
        if(typeof e.seminars == "undefined")
          e.countOfPresentations = 0;
        else
          e.countOfPresentations = Object.keys(e.seminars).length;
      })
      return events.reverse();
    },
    presentations: function(id){
      var ref = firebase.database().ref("events/" + id + "/seminars/");
      var presentations = m.firebase(ref);
      return presentations.reverse();
    },
    timer: function(presentation){
      alert("타이머 시작");
    },
    like: function(presentation){
      alert("좋아요");
    },
    open: function(event){
      if(!event.opened()){
        console.log("open " + event.$id);
        event.opened(!event.opened());
        console.log(event.opened());
      } else {
        console.log("close " + event.$id);
        event.opened(!event.opened());
        console.log(event.opened());
      }
    }
  }
}

codin9cafe.view = function(ctrl){
  return [
    m('h1', 'Codin9cafe Events List'),
    m('ul', {id: "events"}, 
      ctrl.events().map(function(event){
        return [
          m('li', {id: event.$id, class: "event"}, event.date + ' / ' + event.num + ' / ' + event.loc + " (" + event.countOfPresentations + ")"),
          m('ul',
            ctrl.presentations(event.$id).map(function(presentation){
              return m('li', presentation.title + " - " + presentation.speaker, [
                m.trust(" / "),                  
                m('span', {class: "timer"}, presentation.time + " "),
                m('button', {class: "btn btn-primary timer"}, "start"),
                m.trust(" / "),
                m('span', {class: "like"}, presentation.like + " "),
                m('button', {class: "btn btn-info like"}, "좋아요")
              ])
            })
          )
        ]
      })
    )
  ];
}

var login = {} || "";

login.Info = function(data){
  this.id = m.prop(data.id);
  this.pwd = m.prop(data.pwd);
};

login.vm = (function() {
  var vm = {};
  vm.init = function() {
    vm.id = m.prop("");
    vm.pwd = m.prop("");
    vm.login = function(){
      console.log(vm.id(), vm.pwd());
      // go to server 
      m.request({
        method: "POST",
        url: "http://localhost:3000/login",
        data: {
          json: "{\"id\": \""+ vm.id() +"\", \"pw\": \""+ vm.pwd()+"\"}"
        }
      }).then(function(res){
        alert("Login Success");
      }, function(err) {alert("Login Failed");});
    };
  };
  return vm;
}())

login.controller = function() {
  login.vm.init();
}

login.view = function(){
  return [
    m('h1', "Login"),
    m('div', [
      m('input', {onchange: m.withAttr("value", login.vm.id), value: login.vm.id(), placeholder: "ID"}),
      m('br'),
      m('input', {type: "password", onchange: m.withAttr("value", login.vm.pwd), value: login.vm.pwd(), placeholder: "PW"}),
      m('br'),
      m('button', {onclick: login.vm.login}, "로그인"),
      m("a[href='/register']", {config: m.route},"to register")
    ])
  ]
}

var register = {} || "";

register.Info = function(data){
  this.id = m.prop(data.id);
  this.pwd = m.prop(data.pwd);
  this.email = m.prop(data.email);
};

register.vm = (function() {
  var vm = {};

  vm.init = function() {
    var xhrConfig = function(xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
    };
    var serialize = function(data){
      return JSON.stringify(data);
    };
    var deserialize = function(data){
      return JSON.parse(data.toString());
    };
    vm.id = m.prop("");
    vm.pwd = m.prop("");
    vm.email = m.prop("");
    vm.register = function(){
      var data = {id: vm.id(), pw: vm.pwd(), email: vm.email()};
      // go to server 
      m.request({
        method: "POST",
        url: "http://localhost:3000/register",
        config: xhrConfig,
        data: data,
        serialize: serialize,
        deserialize: deserialize
      }).then(function(res){
        alert("Register Success");
      }, function(err) {alert("Register Failed");});
    };
  };
  return vm;
}())

register.controller = function() {
  register.vm.init();
}

register.view = function(){
  return [
    m('h1', "Register"),
    m('div', [
      m('input', {onchange: m.withAttr("value", register.vm.id), value: register.vm.id(), placeholder: "ID"}),
      m('br'),
      m('input', {type: "password", onchange: m.withAttr("value", register.vm.pwd), value: register.vm.pwd(), placeholder: "PW"}),
      m('br'),
      m('input', {type: "email", onchange: m.withAttr("value", register.vm.email), value: register.vm.email(), placeholder: "e-mail"}),
      m('br'),
      m('button', {onclick: register.vm.register}, "회원가입")
    ])
  ]
}

m.route(document.body, "/login", {
  "/": codin9cafe,
  "/login": login,
  "/register": register
})