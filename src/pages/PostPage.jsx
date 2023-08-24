import React, { useState } from 'react';
import './PostPage.css';
import dp from '../img/dp.jpg';

const PostPage = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [comments, setComments] = useState([]);
  const [replyTexts, setReplyTexts] = useState([]);

  // Hardcoded user information
  const hardcodedUser = { postAuthor: '@ianpedeglorio', commentAuthor1: '@yvonnewang', commentAuthor2: '@lopsiii', photo: dp };

  const handleAddPost = () => {
    if (postTitle.trim() !== '' && postText.trim() !== '') {
      const newPost = { id: comments.length, title: postTitle, text: postText, parentId: null, userId: hardcodedUser.id };
      setComments([...comments, newPost]);
      setPostTitle('');
      setPostText('');
    }
  };

  const handleAddComment = (parentId) => {
    const commentIndex = replyTexts.findIndex(reply => reply.id === parentId);
    if (commentIndex !== -1 && replyTexts[commentIndex].text.trim() !== '') {
      const newComment = { id: comments.length, text: replyTexts[commentIndex].text, parentId, userId: hardcodedUser.id };
      setComments([...comments, newComment]);
      setReplyTexts(replyTexts.filter(reply => reply.id !== parentId));
    }
  };

  const renderComments = (parentId = null, depth = 0) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => {
        return (
          <div key={comment.id} className={`comment depth-${depth}`}>
            <div className="user-info">
              <img src={hardcodedUser.photo} alt="User" />
              <span>
                {comment.parentId === null
                  ? hardcodedUser.postAuthor
                  : comment.id % 2 === 0
                  ? hardcodedUser.commentAuthor2
                  : hardcodedUser.commentAuthor1}
              </span>
            </div>
            <h2>{comment.title}</h2>
            <p>{comment.text}</p>
            <button className="reply-button" onClick={() => setReplyTexts([...replyTexts, { id: comment.id, text: '' }])}>Reply</button>
            {replyTexts.some(reply => reply.id === comment.id) && (
              <div className="reply-input">
                <input
                  type="text"
                  value={replyTexts.find(reply => reply.id === comment.id).text}
                  onChange={(e) => {
                    const updatedReplyTexts = replyTexts.map(reply =>
                      reply.id === comment.id ? { ...reply, text: e.target.value } : reply
                    );
                    setReplyTexts(updatedReplyTexts);
                  }}
                  placeholder="Enter your reply"
                />
                <button onClick={() => handleAddComment(comment.id)}>Add Reply</button>
              </div>
            )}
            {renderComments(comment.id, depth + 1)}
          </div>
        );
      });
  };

  return (
    <div>
      <h1>React Post App</h1>
      <div>
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Enter post title"
        />
        <input
          type="text"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Enter your post"
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>
      <div className="comments-container">
        {renderComments()}
      </div>
    </div>
  );
};

export default PostPage;
