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
        unwrapSuccess: function(res) {
          // go to event list with params
          return res.data;
        },
        unwrapError: function(res) {
          alert("로그인 실패");
          m.route("/login");
        }
      })
    };
  };
  return vm;
}())

login.controller = function() {
  login.vm.init();
}

login.view = function(){
  return m('div', [
    m('input', {onchange: m.withAttr("value", login.vm.id), value: login.vm.id(), placeholder: "ID"}),
    m('br'),
    m('input', {type: "password", onchange: m.withAttr("value", login.vm.pwd), value: login.vm.pwd(), placeholder: "PW"}),
    m('br'),
    m('button', {onclick: login.vm.login}, "로그인")
  ]);
}

m.route(document.body, "/", {
  "/": codin9cafe,
  "/login": login
})