import { useState, useEffect } from "react";
import { useTags, createTag } from "../graphql/api";
import Header from "./Header";
import GuestbookEntry from "./GuestbookEntry";
import GuestbookEntryDivider from "./GuestbookEntryDivider";
import {
  hero,
  heroContainer,
  heroForm,
  heroFormFieldset,
  heroFormTextArea,
  heroFormTwitterInput,
  heroFormSubmitButton,
  heroEntries,
} from "../styles/hero";

function getTags(data) {
  return data ? data.tags.data : [];
}

export default function Hero(props) {
  const { data, errorMessage } = useTags();
  const [entries, setEntries] = useState([]);
  const [tagIdentifier, setTagIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // TODO: Allow use to choose start and destination ports
  const startPort = "HEL";
  const destinationPort = "TUR";

  useEffect(() => {
    if (!entries.length) {
      setEntries(getTags(data));
    }
  }, [data, entries.length]);

  function handleSubmit(event) {
    event.preventDefault();
    if (tagIdentifier.trim().length === 0) {
      alert("Please provide a valid twitter handle :)");
      return;
    }
    setSubmitting(true);
    createTag(tagIdentifier, startPort, destinationPort)
      .then((data) => {
        entries.unshift(data.data.createTag);
        setTagIdentifier("");
        setEntries(entries);
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(`boo :( ${error}`);
        alert("Something bad happened 🤷‍♀️");
        setSubmitting(false);
      });
  }

  function handleTagIdentifier(event) {
    setTagIdentifier(event.target.value);
  }

  return (
    <div className={heroContainer.className}>
      <div className={hero.className}>
        <Header />
        <form className={heroForm.className} onSubmit={handleSubmit}>
          <fieldset
            className={heroFormFieldset.className}
            disabled={submitting && "disabled"}
          >
            <input
              className={heroFormTwitterInput.className}
              type="text"
              placeholder="Tag identifier"
              onChange={handleTagIdentifier}
              value={tagIdentifier}
            />
            <input
              className={heroFormSubmitButton.className}
              type="submit"
              value="Submit"
            />
          </fieldset>
        </form>
      </div>
      <div className={heroEntries.className}>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : !data ? (
          <p>Loading entries...</p>
        ) : (
          entries.map((entry, index, allEntries) => {
            const date = new Date(entry._ts / 1000);
            return (
              <div key={entry._id}>
                <GuestbookEntry
                  twitter_handle={entry.twitter_handle}
                  story={entry.story}
                  date={date}
                />
                {index < allEntries.length - 1 && <GuestbookEntryDivider />}
              </div>
            );
          })
        )}
      </div>
      {heroEntries.styles}
      {heroFormSubmitButton.styles}
      {heroFormTwitterInput.styles}
      {heroFormTextArea.styles}
      {heroFormFieldset.styles}
      {heroForm.styles}
      {heroContainer.styles}
      {hero.styles}
    </div>
  );
}
