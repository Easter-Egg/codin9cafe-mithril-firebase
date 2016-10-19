# 시작하기 - Getting started

## 미스릴은 무엇인가요?

미스릴은 클라이언트-사이드 자바스크립트 MVC 프레임워크입니다. MVC 프레임워크는 일종의 도구로써 어플리케이션의 코드를 데이터 계층 (Model), UI 계층 (View), 그리고 이 둘을 연결하는 계층 (Controller)으로 나눌 수 있도록 합니다. 

미스릴은 작고 특화된 API 덕분에 약 7.8kB 크기를 가집니다. 미스릴은 성능 기준에 맞는 렌더링을 위해 가상 돔 비교 알고리즘이 구현된 템플릿 엔진을 제공하고, 함수형 구성을 이용하는 높은 수준의 모델링을 위한 기능들을 제공합니다. 또한 라우팅과 부품화를 위한 지원도 제공합니다.

이 프레임워크의 목적은 어플리케이션의 코드가 눈에 더 잘보이고, 알아보기 쉽고 유지보수하기 쉽게 만드는 것입니다. 그리고 당신이 더 나은 개발자가 되는 것을 도와주는 것입니다.

다른 프레임워크들과 달리 미스릴은 당신의 의존성에 그물에 걸리는 걸 피하기 위해 열심히 노력합니다. 당신은 또한 필요한만큼 프레임워크의 일부를 사용할 수 있습니다.

그러나, 미스릴 전체를 사용하는 것은 관용적으로 많은 이익을 가져다 줍니다. 진짜 세상에서 함수형 프로그래밍을 사용하는 것을 배우는 것과  OOP와 MVC에 대한 좋은 코딩 연습과정들을 확고히 하는 것은 많은 이익의 일부입니다.

---

## 간단한 응용프로그램
당신이 미스릴의 일부를 가진다면, 시작하기 과정은 놀랍게도 표준 문안으로부터 자유롭습니다.
````
<!doctype html>
<title>Todo app</title>  
<script src="mithril.min.js"></script>  
<body>
  <script>
    //app goes here
  </script>
</body>
````

그렇습니다. 위 코드는 유효한 HTML5 코드입니다. 표준에 따르면, ````<html>```` 태그와 ````<head>```` 태그는 생략될 수 있지만 브라우저가 마크업을 표현할 때 생략된 DOM 요소를 명시적으로 표현합니다.

---

## 모델

미스릴에서, 어플리케이션은 일반적으로 네임스페이스 안에서 살고 컴포넌트들을 포함합니다. 요소들은 볼 수 있는 "페이지" 또는 페이지의 일부를 표현하는 구조체입니다.  게다가, 어플리케이션은 세 가지 주요 계층인 모델, 컨트롤러와 뷰로 나뉘어집니다. 

간단함을 위해, 우리의 어플리케이션은 단 하나의 컴포넌트만 가질 것이며, 우리의 어플리케이션을 위한 네임스페이스로써 이 것을 사용할 것입니다.

미스릴에서 컴포넌트는 뷰 함수와 부가적으로 컨트롤러 함수를 가지는 객체입니다. 
````
//an empty Mithril component
var myComponent = {
  controller: function() {},
  view: function() {}
}
````

컨트롤러와 뷰를 가질 뿐만 아니라, 컴포넌트는 이 것에 속한 데이터를 저장하는 데에 사용할 수도 있습니다.

컴포넌트를 만들어 보죠.
````
<script>
  //this application only has one component: todo
  var todo = {};
</script>
````

일반적으로, 모델 개체들은 재사용가능하고 컴포넌트 밖에 존재합니다. (예. var User = ...) 이 예제에서는 전체 어플리케이션이 하나의 컴포넌트 안에 존재하기 때문에, 우리는 컴포넌트를 우리의 모델 개체를 위한 네임스페이스로써 사용할 것입니다.
````
var todo = {};

//for simplicity, we use this component to namespace the model classes

//the Todo class has two properties
todo.Todo = function(data) {
  this.description = m.prop(data.description);
  this.done = m.prop(false);
};

//the TodoList class is a list of Todo's
todo.TodoList = Array;
````

m.prop은 getter-setter 함수를 위한 간단한 팩토리입니다. getter-setter들은 다음과 같이 동작합니다.
````
//define a getter-setter with initial value `John`
var a_name = m.prop("John");

//read the value
var a = a_name(); //a == "John"

//set the value to `Mary`
a_name("Mary"); //Mary

//read the value
var b = a_name(); //b == "Mary"
````

위에서 정의한 Todo와 TodoList 클래스들은 순수한 자바스크립트 생성자입니다. 이들은 다음과 같이 초기화 될 수 있습니다.
```` 
var myTask = new todo.Todo({description: "Write code"});

//read the description
myTask.description(); //Write code

//is it done?
var isDone = myTask.done(); //isDone == false

//mark as done
myTask.done(true); //true

//now it's done
isDone = myTask.done(); //isDone == true

TodoList 클래스는 기본 Array 클래스와 동일합니다. var list = new todo.TodoList();
list.length; //0
````

MVC 패턴의 고전적인 정의에 따르면, 모델 계층은 데이터 저장, 상태 관리와 비즈니스 로직에 대한 책임이 있습니다. 

당신은 위에서 만든 클래스들이 기준에 부합하는 것을 확인할 수 있습니다: 그들은 의미있는 상태를 만들어 내기 위해 필요한 모든 메소드와 프로퍼티들을 가지고 있습니다. Todo 클래스가 바로 그 예가 될 수 있고 변화된 프로퍼티들을 가지고 있습니다. 리스트는 할 일 아이템을 push 메소드를 통해서 추가할 수 있습니다. 

---

## View-Model

다음 단계는 모델 클래스에서 사용할 뷰-모델을 작성하는 것입니다. 뷰-모델은 모델 수준의 개체이며 UI 상태를 저장합니다. 다양한 프레임워크에서 UI 상태는 전형적으로 컨트롤러에 저장되지만 컨트롤러가 데이터 제공자로써 디자인 되지 않았기 때문에 코드를 확장하기 어렵습니다. 미스릴에서는 UI 상태를 모델 데이터로 생각합니다. 비록 UI 상태가 데이터베이스의 ORM 개체에 필수적으로 대응이 되지 않더라도 말이죠.

뷰-모델은 UI의 특별한 제한들을 해결하기 위한 비즈니스 로직을 처리합니다. 예를 들어, 폼은 인풋과 취소 버튼을 가져야 합니다. 이러한 경우에 인풋의 원래 상태와 비교하여 인풋의 현재 상태를 추적하고 필요할 경우, 취소를 적용하는 것은 뷰-모델의 책임입니다. 폼이 저장된 경우에는, 뷰-모델이 더 적절한 ORM 모델 개체를 저장하는 것에 있어서 더 나을 것입니다. 

우리의 '할 일' 어플리케이션에서는, 뷰-모델은 몇 가지를 필요로 합니다: 할 일들의 목록을 추적하고 새로운 할 일을 추가하기 위한 필드가 필요합니다. 그리고 새로운 할 일을 추가하는 로직과 UI의 동작에 대한 구현이 필요합니다.
````
//define the view-model
todo.vm = {
  init: function() {
    //a running list of todos
    todo.vm.list = new todo.TodoList();

    //a slot to store the name of a new todo before it is created
    todo.vm.description = m.prop('');

    //adds a todo to the list, and clears the description field for user convenience
    todo.vm.add = function(description) {
      if (description()) {
        todo.vm.list.push(new todo.Todo({description: description()}));
        todo.vm.description("");
      }
    };
  }
};
````

위 코드는 'vm'이라고 하는 뷰-모델 객체를 정의합니다. init 함수를 가진 간단한 자바스크립트 객체입니다. 이 함수는 세 개의 멤버와 함께 'vm' 오브젝트를 초기화합니다. 단순 배열인 'list', m.prop getter-setter이고 초기값으로 빈 문자열을 가지는 'description', 그리고 description getter-setter가 빈 문자열이 아니라면 'list'에 새로운 '할 일' 인스턴스를 추가하는 메소드인 'add'가 있습니다.

이 가이드 이후에, 우리는 'description'을 이 함수의 인자로 전달할 것입니다. 그 때, 왜 OOP 스타일의 멤버 관게 대신에 왜 'description'을 인자로써 전달하는지를 설명하겠습니다.

다음과 같이 뷰-모델을 사용할 수 있습니다.
````
//initialize our view-model
todo.vm.init();

todo.vm.description(); //[empty string]

//try adding a to-do
todo.vm.add(todo.vm.description);
todo.vm.list.length; //0, because you can't add a to-do with an empty description

//add it properly
todo.vm.description("Write code");
todo.vm.add(todo.vm.description);
todo.vm.list.length; //1
````

---

## 컨트롤러

고전적인 MVC 패턴에서, 컨트롤러의 역할은 뷰에서 모델 계층으로 액션을 보내는 것입니다. 전통적인 서버-사이드 프레임워크들에서, HTTP 요청, 응답 그리고 컨트롤러가 HTTP 요청 데이터를 ORM 모델 메소드에게 전달되어 질 수 있는 무언가로 변환시켜주는 어댑터 계층으로써 동작하길 원하는 개발자들로 인해 드러난 프레임워크의 추상적인 개념때문에 컨트롤러 계층은 매우 중요합니다.

그러나, 클라이언트-사이드의 MVC 패턴에서는 이러한 불협화음은 존재하지 않고, 컨트롤러들은 매우 간단할 수 있습니다. 미스릴의 컨트롤러들은 거의 최소한으로 분해 될 수 있습니다. 그래서 컨트롤러들은 최소한으로 필수적인 역할을 수행합니다: 모델-수준 기능성의 제한된 집합을 드러내는 것입니다. 

다시 말해서, 컨트롤러가 해야할 것은 다음과 같습니다:
```  
todo.controller = function() {
  todo.vm.init()
}
```

---

## 뷰

다음 단계는 뷰를 작성해서 사용자들이 어플리케이션과 소통할 수 있도록 해야합니다. 미스릴에서, 뷰들은 순수한 자바스크립트입니다. 여기서 몇가지 이점(적절한 에러 보고, 적절한 어휘적 스코핑 등)들이 있고 프로세싱 툴을 통해 사용되는 HTML 문법도 허용합니다.
````
todo.view = function() {
  return m("html", [
    m("body", [
      m("input"),
      m("button", "Add"),
      m("table", [
        m("tr", [
          m("td", [
            m("input[type=checkbox]")
          ]),
          m("td", "task description"),
        ])
      ])
    ])
  ]);
};
````

유틸리티 메소드인 ````m()````은 가상의 DOM 요소들을 만듭니다. 보시다시피, 속성을 명시하기 위해서 CSS 셀렉터도 사용할 수 있습니다. 또한 ````.````과 ````#````을 통해 클래스와 아이디도 부여할 수 있습니다.

사실, MSX HTML syntax preprocessor를 사용하지 않는다면, 상속적 문법 표현을 통한 진정한 효과를 위해 CSS 셀렉터를 사용하는 것을 추천합니다. (예. ````m(".modal-body")````)

우리의 코드를 실험해 보기 위해서, 다음과 같이 뷰는 ````m.render```` 메소드를 통해서 표현될 수 있습니다.
````
m.render(document, todo.view())
````

템플릿을 적용하기 위해 root DOM element(````document````)와 템플릿 그 자체를 전달하는 것을 명심하세요.

이 코드는 다음과 같은 마크업을 표현합니다.
````
<html>
  <body>
    <input />
    <button>Add</button>
    <table>
      <tr>
        <td><input type="checkbox" /></td>
        <td>task description</td>
      </tr>
    </table>
  </body>
</html>
````

````m.render````는 미스릴에서 매우 낮은 수준의 메소드로 오직 한번만 수행되며 자동으로 auto-drawing 시스템을 수행하지 않습니다. 자동으로 그리는 것을 가용하게 만들기 위해서, 'todo' 컴포넌트는 ````m.mount````에 의해 초기화 되거나 ````m.route````를 통한 경로 정의를 생성하므로써 초기화 되야합니다. 또한 명심하세요. Knockout.js와 같은 관찰 기반의 프레임워크와 달리, 미스릴에서는 ````m.prop```` getter-setter를 통한 값 설정은 다시 그리는 것에 대한 부작용을 유발하지 않습니다.

---

## 데이터 바인딩

텍스트 입력에 대한 데이터 바인딩을 구현해 봅시다. 데이터 바인딩은 DOM 개체와 자바스크립트 변수를 연결해서 하나가 변경되면 다른 하나도 같이 변경됩니다.
````
//binding a model value to an input in a template
m("input", {value: todo.vm.description()})
````

다음은 description의 getter-setter와 텍스트 인풋을 연결하는 예시입니다. 모델에서 description의 값의 변경은 미스릴이 다시 그릴 때, DOM 인풋을 변경합니다.
````
todo.vm.init();

todo.vm.description(); // empty string
m.render(document, todo.view()); // input is blank

todo.vm.description("Write code"); //set the description in the controller
m.render(document, todo.view()); // input now says "Write code"
````

언 뜻 보면, 위 코드는 매우 비효율적인 것처럼 보이지만 사실, ````todo.view```` 메소드를 여러번 호출하는 것은 실제로 전체 템플릿을 다시 그리지 않습니다. 내부적으로, 미스릴은 캐쉬에 가상의 DOM의 표현을 유지하고 있고, 변경을 감지한 뒤 오직 DOM에서 변경이 필요한 최소한의 부분만을 수정합니다. 실제로, 이 결과는 매우 빠르게 다시 그려집니다.

위 예시에서, 미스릴은 인풋의 value 속성만 건드립니다.

위의 예시는 DOM의 인풋 개체의 값을 입력만 하고 읽지 않습니다. 이는 인풋에 무언가를 입력하고 다시 그리는 것은 화면에 글자를 때려 넣는 것을 의미합니다.

---

운좋게도, 바인딩은 양방향이 될 수 있습니다: 즉, 위처럼 코딩할 수 있으며 DOM 값을 세팅하기 위해, user type으로써 읽을 수도 있고 뷰-모델의 description getter-setter를 갱신합니다.

다음은 뷰와 모델의 바인딩을 구현하는 기본적인 방법입니다.
````
m("input", {onchange: m.withAttr("value", todo.vm.description), value: todo.vm.description()})
````

````onchange````에 연결된 이 코드는 다음과 같이 해석할 수 있습니다: "속성 값을 ````todo.vm.description````에 설정하라."

하지만 미스릴이 바인딩이 어떻게 갱신할지 규정하지는 않습니다: ````onchange````, ````onkeypress````, ````oninput````, ````onblur```` 또는 선호하는 다른 이벤트에 바인딩할 수 있습니다.

또한 바인딩한 속성을 설정할 수 있습니다. ````<select>````의 value 속성에 바인딩 할 수 있을 뿐만 아니라 어떤 이유든지 간에, ````selectedIndex```` 속성 값을 바인딩 할 수도 있다는 것을 의미합니다.

````m.withAttr```` 기능은 뷰에서 무명 함수의 필요성을 최소화하기 위해 미스릴이 제공하는 함수형 프로그래밍 도구입니다.

위 코드의 ````m.withAttr("value", todo.vm.description)```` 호출은 다음과 동등한 함수를 반환합니다.
````
onchange: function(e) {
  todo.vm.description(e.target["value"]);
}
````

무명함수를 피하는 것 말고도, 또 다른 차이점은 ````m.withAttr```` 표현이 올바른 이벤트 타겟을 파악하고 적절한 데이터의 근원을 선택한다는 점입니다 - 예. 데이터가 자바스크립트 값으로부터 온 것인가 혹은 ````DOMElement::getAttribute()````로 부터 온 것인가

---

게다가 양방향 데이터 바인딩에서, 이벤트에 매게변수화된 함수를 바인딩 할 수도 있습니다.
````
var vm = todo.vm

m("button", {onclick: vm.add.bind(vm, vm.description)}, "Add")
````

위 코드에서, 간단하게 자바스크립트 ````Function::bind```` 메소드를 사용하고 있습니다. 그리고 이미 있는 함수를 인자로 새로운 함수를 만들었습니다. 함수형 프로그래밍에서는, 이를 [partial application](https://en.wikipedia.org/wiki/Partial_application)이라고 부릅니다.

위의 ````vm.add.bind(vm, vm.description)```` 표현은 다음의 코드와 동등한 함수를 반환합니다.
````
onclick: function(e) {
  todo.vm.add(todo.vm.description)
}
````

만약 병렬화된 바인딩을 설계할 때, 값이 아닌 참조를 통해 description getter-setter를 전달하는 것을 명심하길 바랍니다. 미스릴은 컨트롤러 메소드에서 그 값을 얻기 위해 getter-setter를 수행합니다. 이 것이 바로 느린 실행의 형태입니다. 이는 "이벤트 핸들러가 호출됐을 때, 이 값을 사용하라" 라고 말할 수 있습니다.

지금부터는 왜 미스릴이 ````m.prop````의 사용을 권장하는 지를 알 수 있게 될 것입니다. 미스릴의 getter-setter 들은 함수들이며, 이들은 천성적으로 함수형 프로그래밍 도구들을 잘 구성하고 몇 가자의 강력한 표현을 허용하기 때문입니다. 이러한 경우에는, C 포인터처럼 사용하고 있습니다.

미스릴은 이를 흥미로운 방법으로 사용합니다.

영리한 독자들은 우리가 ````add```` 메소드를 더 간단하게 만들었다는 것을 눈치챘을 겁니다. 
````
vm.add = function() {
  if (vm.description()) {
    vm.list.push(new todo.Todo({description: vm.description()}));
    vm.description("");
  }
};
````

변형된 버전의 차이점은 ````add```` 메소드가 더 이상 인자를 가지지 않습니다.

이로써, 템플릿과의 ````onclick````의 바인딩을 훨씬 더 간단하게 만들 수 있습니다.
````
m("button", {onclick: todo.vm.add}, "Add")
````

여기서 partial application이라고 말했던 이유는, 매개 변수화된 이벤트 핸들러들을 다룰 때 유용하기 때문입니다. 현실에서 선택할 때, 여러분은 항상 경우에 따른 가장 간단한 표현을 선택해야 합니다.

---

코드의 나머지 부분은 우리가 이미 작성한 표현을 통해 구현할 수 있습니다. '완료' 뷰는 다음과 같습니다.
````
todo.view = function() {
  return [
    m("input", {onchange: m.withAttr("value", todo.vm.description), value: todo.vm.description()}),
    m("button", {onclick: todo.vm.add}, "Add"),
    m("table", [
      todo.vm.list.map(function(task, index) {
        return m("tr", [
            m("td", [
              m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
            ]),
            m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description()),
        ])
      })
    ])
  ];
};
````

다음은 위 템플릿의 특이 사항입니다.

- 템플릿은 ````<body>````의 자식으로 그려집니다.
- 텍스트 인풋은 그 값을 미리 정의한 ````todo.vm.description```` getter-setter에 저장합니다.
- 버튼은 클릭될 때 ````todo.vm.add````를 호출합니다.
- 테이블은 모든 할 일들을 리스트로 보여줍니다.
- 체크박스는 그 값을 ````task.done```` getter-setter에 저장합니다.
- 체크 될 경우, 취소선이 적용됩니다.
- 업데이트 시, 모든 템플릿이 다시 그려지는 게 아닙니다. 오직 변경점만 적용됩니다.

---

지금까지 우리는 데이터의 변화를 만든 후에 수동적으로 다시 그리기 위해 ````m.render````를 사용해 왔습니다. 그러나 이 전에 언급했던 것처럼, ````todo```` 컴포넌트를 ````m.mount````를 통해서 초기화하므로써 [auto-redrawing 시스템](http://mithril.js.org/auto-redrawing.html)을 사용할 수 있습니다.
````
//render the todo component inside the body DOM node
m.mount(document.body, {controller: todo.controller, view: todo.view});
````

미스릴의 auto-redrawing 시스템은 컨트롤러의 안정성을 추적합니다. 그리고 비동기 AJAX 콜을 포함해서, 컨트롤러가 코드를 전부 수행하고 끝난 것을 감지할 때만 뷰를 다시 그립니다. 또한, 그리기 전에 이벤트 핸들러 내부의 비동기 서비스가 완료되기를 기다립니다. 

redrawing이 어떻게 동작하는지는 [여기서](http://mithril.js.org/auto-redrawing.html) 더 자세히 알아 볼 수 있습니다.
