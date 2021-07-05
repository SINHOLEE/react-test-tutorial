import React, {useState} from "react";
import Container from "../../components/Container";
import {Section, Headline, Status, TopPosts} from "./Home.style";
import Form from "./Form";

function Home() {
	const [posts, setPosts] = useState([]);
	const [status, setStatus] = useState("idle");

	const onSearch = async (subreddit) => {
		setStatus("loading");
		const url = `https://www.reddit.com/r/${subreddit}/top.json`;
		const response = await fetch(url);
		const {data} = await response.json();
		if (data?.children) {
			setPosts(data.children);
		}
		setStatus("resolved");
	};

	return (
		<Container>
			<div className="Home">
				<Section>
					<Headline>Find the top posts on Reddit</Headline>

					<Form onSearch={onSearch} />
				</Section>

				{status === "loading" && <Status>Is loading</Status>}
				{status === "resolved" && (
					<TopPosts>
						Number of top posts: {posts.length}
						{console.log(posts)}
					</TopPosts>
				)}
			</div>
		</Container>
	);
}

export default Home;
