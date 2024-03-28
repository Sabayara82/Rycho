import axios from "axios";
export async function fetchPosts(
  ids: string[] | string,
  token: string | null,
  setPosts: Function
) {
  const allOfThePosts = [];
  const idArray = Array.isArray(ids) ? ids : [ids]; // Ensure ids is always an array

  for (let p = 0; p < idArray.length; p++) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/feed/post/?spotifyId=${idArray[p]}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const { allPosts } = response.data;
      allOfThePosts.push(...allPosts);
    } catch (error) {
      console.error("Error fetching user's posts': ", error);
    }
  }
  // Now sort and set posts
  const sortedPosts = allOfThePosts.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Sort in descending order
  });
  setPosts(sortedPosts);
  
}

export async function goToUserPage(index: string) {
  window.location.href = `http://localhost:3000/profile/${index}`;
}

export async function fetchComments(
  posts: any[],
  token: string | null,
  setComments: Function
) {
  try {
    const commentsMap: { [postId: string]: any[] } = {}; // Define type annotation for commentsMap
    for (let i = 0; i < posts.length; i++) {
      const postId = posts[i]._id;
      const response = await axios.get(
        `http://localhost:3000/api/feed/comments/?postId=${postId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const { allComments } = response.data;
      commentsMap[postId] = allComments; // Assign comments to the post ID key in the comments map
    }

    setComments(commentsMap); // Set comments map to state
  } catch (error) {
    console.error("Error fetching posts' comments: ", error);
  }
}

export async function playPreview(
  audioPlayer: HTMLAudioElement | null,
  audioUrl: string
) {
  if (audioPlayer) {
    audioPlayer.addEventListener("error", (e) => {
      console.error("Error with audio playback:", e);
    });

    if (audioPlayer.src !== audioUrl) {
      audioPlayer.src = audioUrl;
      audioPlayer
        .play()
        .catch((e) => console.error("Error playing the audio:", e));
    } else {
      if (audioPlayer.paused) {
        audioPlayer
          .play()
          .catch((e) => console.error("Error playing the audio:", e));
      } else {
        audioPlayer.pause();
      }
    }
  }
}

export async function togglePostPlaying(
  setPostPlaying: Function,
  prevState: any,
  postId: string
) {
  setPostPlaying((prevState: { [x: string]: any }) => ({
    ...prevState,
    [postId]: !prevState[postId], // Toggle the boolean value for the given postId
  }));
}
