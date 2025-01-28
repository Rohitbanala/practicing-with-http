const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");
const postList = document.querySelector("ul");
function sendingHttpReq(method, url, data) {
  // const promise = new Promise((resolve, reject) => {
  // const xhr = new XMLHttpRequest();
  // xhr.setRequestHeader("Content-Type", "application/json");
  //   xhr.open(method, url);
  //   xhr.responseType = "json";
  //   xhr.onload = function () {
  //     if (xhr.status >= 200 && xhr.status < 300) {
  //       resolve(xhr.response);
  //     } else {
  //       reject(new Error("something went wrong"));
  //     }
  //   };
  //   xhr.onerror = function () {
  //     reject(new Error("something went wrong"));
  //   };

  //   xhr.send(JSON.stringify(data));
  //   console.log(data);
  // });
  // return promise;
  return fetch(url, {
    method: method,
    body: data,
    // headers: { "Content-type": "application/json" },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        response.json().then((errData) => {
          console.log(errData);
        });
        throw new Error("something went wrong");
      }
    })
    .catch((error) => {
      throw new Error("something went wrong");
    });
}

async function fetchPosts() {
  try {
    const resData = await sendingHttpReq(
      "GET",
      "https://jsonplaceholder.typicode.com/posts"
    );
    const listOfPosts = resData;
    console.log(resData);
    for (const post of listOfPosts) {
      const postEl = document.importNode(postTemplate.content, true);
      postEl.querySelector("h2").textContent = post.title.toUpperCase();
      postEl.querySelector("li").id = post.id;
      postEl.querySelector("p").textContent = post.body;
      listElement.append(postEl);
    }
  } catch (error) {
    alert(error);
  }
}
async function createPost(title, content) {
  const postId = Math.random();
  const newPost = {
    title: title,
    body: content,
    userId: postId,
  };
  const fd = new FormData(form);
  fd.append("id", postId);
  await sendingHttpReq(
    "POST",
    "https://jsonplaceholder.typicode.com/posts",
    fd
  );
  console.log(newPost);
}
fetchButton.addEventListener("click", () => {
  fetchPosts();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector("#title").value;
  const enteredContent = event.currentTarget.querySelector("#content").value;
  createPost(enteredTitle, enteredContent);
});
postList.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const postId = event.target.closest("li").id;
    sendingHttpReq(
      "DELETE",
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});
