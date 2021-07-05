import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App test', () => {
	beforeEach(() => {
		render(
			<MemoryRouter>
				<App></App>
			</MemoryRouter>,
		);
	});
	describe('Header', () => {
		test.each([
			{linkName: /how it/i, headingName: /how it works/i},
			{linkName: /about/i, headingName: /about/i},
		])('헤더 버튼 클릭 시 알맞은 페이지 노출된다. %s', ({linkName, headingName}) => {
			const link = screen.getByRole('link', {name: linkName});
			userEvent.click(link);
			expect(screen.getByRole('heading', {name: headingName})).toBeInTheDocument();
		});
		it('svg(홈 버튼)을 클릭하면 "홈 컴포넌트" 화면이 보인다.', () => {
			const link = screen.getByRole('link', {name: /logo.svg/i});
			userEvent.click(link);
			expect(screen.getByRole('heading', {name: /Find the top posts on Reddit/i}));
			// expect(screen.getByRole('textbox', {name: /r \//i}));
			// 저자는 라벨이 바람직하다고 한다. 우선순위는 공식문서를 보자.
			expect(screen.getByLabelText('r /'));
			expect(screen.getByRole('button', {name: /search/i}));
		});
	});

	describe('Form', () => {
		test('react 라고 인풋값에 입력하면 화면에 react가 보인다.', () => {
			const input = screen.getByLabelText('r /');
			userEvent.type(input, 'react');
			expect(input.value).toEqual('react');
		});
		test('전달된 인풋값을 가지고 search 버튼을 클릭했을때 로딩화면이 나타나는가?', () => {
			const input = screen.getByLabelText('r /');
			userEvent.type(input, 'react');
			const submitBtn = screen.getByRole('button', /search/i);
			userEvent.click(submitBtn);
			// 화면에 Is loading이라는 문구나 나타나는것을 확인하고 싶다.
			expect(screen.getByText(/is loading/i)).toBeInTheDocument();
		});

		//3. 로딩 후 api fetch가 잘 동작하여 원하는 값을 노출하는가?
		test('로딩 후 api fetch가 잘 동작하여 원하는 값을 노출하는가?', async () => {
			const input = screen.getByLabelText('r /');
			userEvent.type(input, 'react');
			const submitBtn = screen.getByRole('button', /search/i);
			userEvent.click(submitBtn);
			// 통합테스트에는 서버에 실제로 요청을 보내서는 안된다.
			// 1. api요청시간이 많이걸리기 때문에 개발환경과 퍼포먼스에 영향을 미친다.
			// 2.테스트 결과의 항상성을 보장할 수 없다. 즉 get요청의 경우 동적으로 변할 수 있고, post,delete,patch,put 등의 요청을 수시로 주고받으며 데이터가 바뀌기 때문이다.
			// 3. api요청을 컨트롤 할 수 없다.
			//  실제 api를 사용하면, api서버가 죽은 상황을 테스트 하거나, 특정 테스트에서 일부 서버의 오류상황을 재연할 수 없다.
			// 결국 api 요청에 대한 mocking이 필요하다.

			//            여기서 다시 시작
			//https://jkettmann.com/refactoring-and-debugging-a-react-test

			const numOfPosts = await screen.findByText(/number of/i);
			screen.debug();
		});

		//엣지 케이스
		//1. input값이 없을땐 아무 동작하지 않아야 한다.
		//2. 유효하지 않는 값이 들어간다면 별도의 처리가 필요하...ㄴ가?
	});
});
