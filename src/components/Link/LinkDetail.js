import React from "react";
import firebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

function LinkDetail(props) {
  const { firebase, user } = React.useContext(firebaseContext);
  const linkId = props.match.params.linkId;
  const [link, setLink] = React.useState(null);
  const [commentText, setCommentText] = React.useState();
  const [count, setCount] = React.useState(0);

  const linkRef = firebase.db.collection("links").doc(linkId);

  React.useEffect(() => {
    getLink();
  }, [count]);

  function getLink() {
    linkRef.get().then(doc => {
      setLink({
        ...doc.data(),
        id: doc.id
      });
    });
  }

  console.log(count);

  function handleAddComment() {
    if (!user) {
      props.history.push("/login");
    } else if (commentText) {
      linkRef.get().then(doc => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const comment = {
            postedBy: {
              id: user.uid,
              name: user.displayName
            },
            created: Date.now(),
            text: commentText
          };
          const updatedComments = [...previousComments, comment];
          linkRef.update({ comments: updatedComments });
          setLink(prev => ({
            ...prev,
            comment: updatedComments
          }));
          const countC = count + 1;
          setCount(countC);
          setCommentText("");
        }
      });
    }
  }

  return !link ? (
    <div>Loading</div>
  ) : (
    <div>
      <LinkItem showCount={false} link={link} />
      <textarea
        value={commentText}
        rows="6"
        cols="60"
        onChange={e => setCommentText(e.target.value)}
      />
      <div>
        <button className="button" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
      {link.comments.map((comment, index) => {
        return (
          <div key={index}>
            <p className="comment-author">
              {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
            </p>
            <p>{comment.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export default LinkDetail;
