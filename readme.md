## 리액트 테스팅

https://blog.rhostem.com/posts/2020-10-14-beginners-guide-to-testing-react-1

의 포스팅을 바탕으로 리액트 환경에서 테스트 하는 방법론 학습





### 테스트 목적

-   그 앱이 제대로 동작한다는 확신을 주기 위해
-   자동화 테스트 라이브러리 -> `jest`,`testing-library/react`

### 혼자서 생각해볼 것

-   Home컴포넌트와 Form컴포넌트를 가지고 어떻게 테스트를 할 것인가?

-> 유저관점에서 컴포넌트의 구현과는 상관 없는 테스트를 작성하는 것이 좋다.== 구현에 종속적이지 않는다.

### 내가 생각하는 테스트해야 하는 것들

1. input값에 특정 단어를 입력했을 때 input값에 잘 전달 되는가?

2. 전달된 인풋값을 가지고 search 버튼을 클릭했을때 잘 작동하는가?
   2-1. 로딩->결과 화면이 자동으로 전환 되는가?

3. header 컴포넌트에서

   3-1. reddit timer를 클릭하면 home컴포넌트를 불러오는가?
   다른 컴포넌트는 없어야한다.

   3-2. how it works를 클릭하면 해당 컴포넌트를 불러오는가?
   다른 컴포넌트는 없어야한다.

   3-3. about 버튼을 클릭하면 해당 컴포넌트를 불러오는가?
   다른 컴포넌트는 없어야한다.

- 엣지 케이스일 때.

1. input값이 없을땐 아무 동작하지 않아야 한다.

2. 유효하지 않는 값이 들어간다면 별도의 처리가 필요하...ㄴ가?

   

### 테스트 하기 위해서는

- 헤더테스트를 위해서는 헤더 뿐 아니라 헤더에서 작용한 결과가 나타나는 APP컴포넌트 전체가 필요로 하다.



### 라우팅 환경 설정

- `<App/>`  컴포넌트 안에는 `Router` 컴포넌트가 없다.  라우팅 로직을 테스팅하기 위해서는 `<MemoryRouter/>  (import {MemoryRouter} from "react-router-dom")` 를 임포트 해야한다.

  

### 테스트 환경 초기 설정

- 해당 컴포넌트의 돔트리를 확인해보고 싶다면  `screen.debug()`를 이용해보자.

  콘솔에 app컴포넌트의 돔 데이터를 출력해준다.

```react
import React from "react";
import {MemoryRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import App from "./App";

describe("Header", () => {
	it('"How it works" 링크를 클릭하면 해당 컴포넌트가 보인다.', () => {
		render(
			<MemoryRouter>
				<App></App>
			</MemoryRouter>,
		);
		// 해당 컴포넌트에서 어떤 요소가 담겨있는지 확인할 수 있는 방법
		screen.debug();
	});
});

```

- `jest expect` 에서 자동완성 기능을 사용하고 싶다면, `root` 디렉토리에서 `jsconfig.json`생성 후

  ```json
  // in the jsconfig.json
  { "typeAcquisition": { "include": [ "jest" ] } }
  
  ```

  

### 랜더링 된 컴포넌트의 DOM에 접근하는 방법

- **getBy\*** 쿼리 (ex. `getByTestId`, `getByText`, `getByRole`): 이 함수들은 **동기적**(synchronous)이며 그 요소가 현재 DOM 안에 있는지 확인한다. 그렇지 않으면 에러를 발생시킨다.
- **findBy\*** 쿼리 (ex. `findByText`): 이 함수들은 **비동기**적(asynchronous)이다. 그 요소를 찾을 때까지 일정 시간(기본 5초)을 기다린다. 만약 그 시간이 지난 후에도 요소를 찾을 수 없으면 에러를 발생시킨다.
- **queryBy\*** 쿼리: 이 함수들은 getBy* 처럼 동기적이다. 하지만 요소를 찾을 수 없어도 에러를 발생시키지 않는다. 단지 `null` 값을 리턴한다.

### DOM 접근 전략 선택

reference: https://testing-library.com/docs/queries/about/#priority

1. 컴포넌트가 실행된 후, 바로 접근할 수 있는가?

   - 바로 접근할 수 있다면 `getBy*` 쿼리가 알맞다. ex) `Header`의 `How it works` 와 같이 `static`한 자원들

   - 바로 접근할 수 없다면, `findeBy*`쿼리를 이용한다. 비동기적으로 데이터를 fetch하거나 상태가 변경될때 사용한다.

     ex) input값에 데이터를 입력 후 search버튼을 눌러 데이터를 받아올 때,

2. 어떤 쿼리를 이용할 것인가?

   - 모든 사람에게 접근 가능한 쿼리는 높은 우선 순위를 가진다. 그 중에서, `getByRole`이 가장 알맞은 쿼리가 되어야 한다. `getByAltText` 또는 `getByTestId`는 오직 예외 상황에서만 사용되어야 한다. 그리고 가장 낮은 우선순위는 `getByTestId`다. **당신은 반드시 다른 선택의 여지가 없는 상황에서만 테스트 ID를 사용해야 한다**.
     1. `getByRole`
     2.  `getByAltText` 또는 `getByTestId`

3. 돔 접근 구현 예시

   - ```react
     import React from "react";
     import {MemoryRouter} from "react-router-dom";
     import {render, screen} from "@testing-library/react";
     import App from "./App";
     
     describe("Header", () => {
     	it('"How it works" 링크를 클릭하면 해당 컴포넌트가 보인다.', () => {
     		render(
     			<MemoryRouter>
     				<App></App>
     			</MemoryRouter>,
     		);
     		// 특정 돔에 접근하는 방법 1
             // role을 기준으로, 정규표현식으로 접근하는 방법
     		const link = screen.getByRole("link", {name: /how it/i});
     		link.click();
     
     		screen.debug();
     	});
     });
     
     
     ```

   - console

     ```html
     <body>
           <div>
             <header
               class="sc-AxjAm hXjNkZ"
             >
               <a
                 href="/"
               >
                 <svg
                   class="sc-AxirZ iCeOHL"
                 >
                   logo.svg
                 </svg>
               </a>
               <nav>
                 <a
                   class="sc-AxiKw ejNrOs"
                   href="/how-it-works"
                 >
                   How it works
                 </a>
                 <a
                   class="sc-AxiKw ejNrOs"
                   href="/about"
                 >
                   About
                 </a>
               </nav>
             </header>
             <main>
               <h1>
                 How it works
               </h1>
             </main>
           </div>
         </body>
     ```

     

### DOM 접근 후 상호작용 하기

- 방법's

  1. `@testing-library/react` 모듈이 export하는 `fireEvent.click` 함수를 사용한다.
  2. `@testing-library/user-event` 모듈이 export하는 `click` 함수를 사용한다.
  
  - 가능하면 `userEvent`를 이용하여 상호작용
  
  - ```react
    import React from "react";
    import {MemoryRouter} from "react-router-dom";
    import {render, screen} from "@testing-library/react";
    import userEvent from "@testing-library/user-event";
    import App from "./App";
    
    describe("Header", () => {
    	it('"How it works" 링크를 클릭하면 해당 컴포넌트가 보인다.', () => {
    		render(
    			<MemoryRouter>
    				<App></App>
    			</MemoryRouter>,
    		);
    		// 특정 돔에 접근하는 방법 1
    		// role을 기준으로, 정규표현식으로 접근하는 방법
    		const link = screen.getByRole("link", {name: /how it/i});
    		userEvent.click(link);
    		screen.debug();
    	});
    });
    
    ```
  
    


