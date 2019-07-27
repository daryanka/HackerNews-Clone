import React from "react";
import { Link, withRouter } from "react-router-dom";
import { getDomain } from "../../utils/index";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import firebaseContext from "../../firebase/context";

function LinkItem(props) {
  const { firebase, user } = React.useContext(firebaseContext);

  function handleVote() {
    if (!user) {
      props.history.push("/login");
    } else {
      const voteRef = firebase.db.collection("links").doc(props.link.id);
      voteRef.get().then(doc => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...previousVotes, vote];
          voteRef.update({ votes: updatedVotes });
        }
      });
    }
  }

  function handleDeleteLink() {
    const linkRef = firebase.db.collection("links").doc(props.link.id);
    linkRef
      .delete()
      .then(() => {
        console.log(`Documte with ID ${props.link.id} deleted`);
      })
      .catch(() => {
        console.error("Error deleted link!");
      });
  }

  const posedByAuthUser = user && user.uid === props.link.postedBy.id;

  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {props.showCount && <span className="gray">{props.index} </span>}
        <div className="vote-button" onClick={handleVote}>
          ▲
        </div>
        <div className="ml1">
          <div>
            {props.link.description}{" "}
            <span className="link">({getDomain(props.link.url)})</span>
          </div>
          <div className="f6 lh-copy gray">
            {props.link.votes.length} votes by, {props.link.postedBy.name}{" "}
            {distanceInWordsToNow(props.link.created)}
            {"|"}
            <Link to={`/link/${props.link.id}`}>
              {props.link.comments.length > 0
                ? `${props.link.comments.length} comments`
                : "discuss"}
            </Link>
            {posedByAuthUser && (
              <>
                {"|"}
                <span className="delete-button" onClick={handleDeleteLink}>
                  Delete
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LinkItem);
