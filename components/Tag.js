import { useCallback, useState } from "react";
import { updateTag } from "../graphql/api";
import { existingPorts } from "../lib/ports";
import {
  guestbookEntry,
  guestbookEntryUserDetail,
  guestbookEntryUserDetailAvatar,
  guestbookEntryUserDetailAvatarImg,
  guestbookEntryUserDetailTimestamp,
  guestbookEntryUserDetailBiolink,
  guestbookEntryStory,
  guestbookEntryShare,
  guestbookEntryShareTwitterButton,
  guestbookEntryShareTwitterButtonLogo1,
  guestbookEntryShareTwitterButtonLogo2,
} from "../styles/guestbookentry";

function UpdateTagForm({ tagData, onUpdateTag }) {
  const [submitting, setSubmitting] = useState(false);
  const [startPort, setStartPort] = useState("HEL");
  const [destinationPort, setDestinationPort] = useState("TUR");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (startPort === destinationPort) {
      alert("Start port must be different than destination port");
      return;
    }

    setSubmitting(true);
    updateTag(tagData, {
      isInTour: true,
      startPort,
      destinationPort,
    })
      .then((data) => {
        setSubmitting(false);
        onUpdateTag(data.data.updateTag);
      })
      .catch((error) => {
        console.log(`boo :( ${error}`);
        alert("Something bad happened 🤷‍♀️");
        setSubmitting(false);
      });
  };

  const handleStartPort = useCallback(
    (event) => {
      setStartPort(event.target.value);
    },
    [setStartPort]
  );

  const handleDestinationPort = useCallback(
    (event) => {
      setDestinationPort(event.target.value);
    },
    [setDestinationPort]
  );

  if (tagData.isInTour) {
    return (
      <>
        <p>
          Start port: <b>{existingPorts[tagData.startPort]}</b>
        </p>
        <p>
          Destination port: <b>{existingPorts[tagData.destinationPort]}</b>
        </p>
      </>
    );
  }

  return (
    <>
      <h3>Tag not in tour. Create new tour</h3>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitting && "disabled"}>
          <label>
            Select starting port
            <select onChange={handleStartPort} value={startPort}>
              {Object.keys(existingPorts).map((portKey) => (
                <option key={portKey} value={portKey}>
                  {existingPorts[portKey]}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Select destination port
            <select onChange={handleDestinationPort} value={destinationPort}>
              {Object.keys(existingPorts).map((portKey) => (
                <option key={portKey} value={portKey}>
                  {existingPorts[portKey]}
                </option>
              ))}
            </select>
          </label>
          <br />
          <input type="submit" value="Submit" />
        </fieldset>
      </form>
    </>
  );
}

export default function Tag({ tagData, date, onUpdateTag }) {
  const jsonData = JSON.parse(tagData.jsonData);
  return (
    <>
      <div className={guestbookEntry.className}>
        <div className={guestbookEntryUserDetail.className}>
          <p style={{ fontSize: "18px" }}>
            <b>{tagData.identifier}</b>
          </p>
          <p style={{ fontSize: "12px" }}>
            Tag ID: <b>{tagData._id}</b>
          </p>
          <span className={guestbookEntryUserDetailTimestamp.className}>
            Created on {date.toDateString()}
          </span>
        </div>
        <div className={guestbookEntryStory.className}>
          <UpdateTagForm tagData={tagData} onUpdateTag={onUpdateTag} />
        </div>
      </div>
      {guestbookEntry.styles}
      {guestbookEntryShare.styles}
      {guestbookEntryShareTwitterButton.styles}
      {guestbookEntryShareTwitterButtonLogo1.styles}
      {guestbookEntryShareTwitterButtonLogo2.styles}
      {guestbookEntryStory.styles}
      {guestbookEntryUserDetail.styles}
      {guestbookEntryUserDetailAvatar.styles}
      {guestbookEntryUserDetailAvatarImg.styles}
      {guestbookEntryUserDetailBiolink.styles}
      {guestbookEntryUserDetailTimestamp.styles}
    </>
  );
}
