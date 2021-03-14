import { useState, useEffect, useCallback } from "react";
import { useTags, createTag } from "../graphql/api";
import Header from "./Header";
import Tag from "./Tag";
import TagDivider from "./TagDivider";
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
  return data ? data.tags.data.reverse() : [];
}

export default function Hero(props) {
  const { data, errorMessage } = useTags();
  const [tags, setTags] = useState([]);
  const [tagIdentifier, setTagIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onUpdateTag = useCallback(
    (updatedTag) => {
      const newTags = tags.map((t) => {
        if (t._id === updatedTag._id) {
          return updatedTag;
        }
        return t;
      });
      setTags(newTags);
    },
    [tags]
  );

  useEffect(() => {
    if (!tags.length) {
      setTags(getTags(data));
    }
  }, [data, tags.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (tagIdentifier.trim().length === 0) {
      alert("Please provide a valid twitter handle :)");
      return;
    }
    setSubmitting(true);
    createTag(tagIdentifier)
      .then((data) => {
        tags.unshift(data.data.createTag);
        setTagIdentifier("");
        setTags(tags);
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(`boo :( ${error}`);
        alert("Something bad happened 🤷‍♀️");
        setSubmitting(false);
      });
  };

  const handleTagIdentifier = useCallback(
    (event) => {
      setTagIdentifier(event.target.value);
    },
    [setTagIdentifier]
  );

  return (
    <div className={heroContainer.className}>
      <div className={hero.className}>
        <Header />
      </div>
      <div className={heroEntries.className}>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : !data ? (
          <p>Loading tags...</p>
        ) : (
          tags.map((tag, index) => {
            const date = new Date(tag._ts / 1000);
            return (
              <div key={tag._id}>
                <Tag tagData={tag} date={date} onUpdateTag={onUpdateTag} />
                <TagDivider />
              </div>
            );
          })
        )}
      </div>
      <div className={hero.className}>
        <h1> Create new tag</h1>
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
