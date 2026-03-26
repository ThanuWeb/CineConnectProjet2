const STORAGE_KEY = "comments";

export function getComments() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getCommentsByFilm(imdbID) {
  return getComments().filter((comment) => comment.imdbID === imdbID);
}

export function addComment(imdbID, userId, username, content) {
  const comments = getComments();

  const newComment = {
    id: Date.now(),
    imdbID,
    userId,
    username,
    content,
    createdAt: new Date().toLocaleString(),
  };

  comments.push(newComment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  return comments;
}