import React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const [filter, setFilter] = React.useState("");
  const { firebase } = React.useContext(FirebaseContext);
  const [links, setLinks] = React.useState([]);
  const [filteredLinks, setFilteredLinks] = React.useState([]);

  React.useEffect(() => {
    getInitalLinks();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const query = filter.toLowerCase();
    const matchedlinks = links.filter(link => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(matchedlinks);
  }

  function getInitalLinks() {
    firebase.db
      .collection("links")
      .get()
      .then(snapshot => {
        const links = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        setLinks(links);
      });
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={e => setFilter(e.target.value)} />
          <button>Ok</button>
        </div>
      </form>
      {filteredLinks.map((link, index) => {
        return (
          <LinkItem key={link.id} showCount={false} link={link} index={index} />
        );
      })}
    </div>
  );
}

export default SearchLinks;
