import React from "react";
import useFormValidation from "../Auth/useFormValidation";
import validateCreateLink from "../Auth/validateCreateLink";
import { FirebaseContext } from "../../firebase";

const INITIAL_STATE = {
  description: "",
  url: ""
};

function CreateLink(props) {
  const { firebase, user } = React.useContext(FirebaseContext);
  const { handleSubmit, handleChange, errors, values } = useFormValidation(
    INITIAL_STATE,
    validateCreateLink,
    handleCreateLink
  );

  function handleCreateLink() {
    if (!user) {
      props.history.push("/login");
    } else {
      const { url, description } = values;
      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        votes: [],
        comments: [],
        created: Date.now()
      };

      firebase.db.collection("links").add(newLink);
      props.history.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-column mt3">
      <input
        onChange={handleChange}
        value={values.description}
        type="text"
        placeholder="A description for your link"
        name="description"
        className={errors.description && "error-input"}
      />
      {errors.description && <p className="error-text">{errors.description}</p>}
      <input
        className={errors.url && "error-input"}
        value={values.url}
        onChange={handleChange}
        type="url"
        placeholder="The URL for the link"
        name="url"
      />
      {errors.url && <p className="error-text">{errors.url}</p>}
      <button className="button" type="submit">
        submit
      </button>
    </form>
  );
}

export default CreateLink;
