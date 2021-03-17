import { useCallback, useState } from "react";
import moment from "moment";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { updateTag } from "../graphql/api";
import { existingPorts, allowedPorts } from "../lib/ports";
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
  const [startPort, setStartPort] = useState(tagData.startPort ?? "HEL");
  const [destinationPort, setDestinationPort] = useState(
    tagData.destinationPort ?? "TUR"
  );
  const [departureTime, setDepartureTime] = useState(
    tagData.departureTime ? moment(tagData.departureTime) : null
  );

  // Contain array of objects with keys 'timestamp' and 'port'
  const jsonData = JSON.parse(tagData.jsonData);

  // The first item will be the newest one
  const sortedData = jsonData.sort((a, b) => b.timestamp - a.timestamp);
  const lastPort = sortedData.length > 0 ? sortedData[0].port : undefined;
  const [currentPort, setCurrentPort] = useState(lastPort);

  const allowedCurrentPorts = lastPort ? allowedPorts[lastPort] : [startPort];

  const handleUpdatingTag = (newTagData) => {
    setSubmitting(true);
    updateTag(tagData, newTagData)
      .then((data) => {
        setSubmitting(false);
        onUpdateTag(data.data.updateTag);
      })
      .catch((error) => {
        console.log(`Error when updating tag :( ${error}`);
        alert("Something bad happened 🤷‍♀️");
        setSubmitting(false);
      });
  };

  const handleSubmitNewTour = (event) => {
    event.preventDefault();
    if (startPort === destinationPort) {
      return alert("Start port must be different than destination port");
    }

    setSubmitting(true);
    handleUpdatingTag({
      isInTour: true,
      startPort,
      destinationPort,
    });
  };

  const handleUpdateTour = (event) => {
    event.preventDefault();

    const newJsonData = JSON.parse(tagData.jsonData);

    // If changing the currentPort
    if (lastPort !== currentPort) {
      newJsonData.push({
        port: currentPort,
        timestamp: moment().unix(),
      });
    }

    handleUpdatingTag({
      jsonData: JSON.stringify(newJsonData),
      departureTime: moment(departureTime),
    });
  };

  const handleDepartureTime = useCallback(
    (momentDate) => {
      if (momentDate) {
        setDepartureTime(momentDate);
      }
    },
    [setDepartureTime]
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
        <fieldset disabled={submitting && "disabled"}>
          <form onSubmit={handleUpdateTour}>
            <label>
              Update current port
              <br />
              <select
                onChange={(e) => setCurrentPort(e.target.value)}
                value={currentPort}
              >
                <option disabled selected value>
                  -- select an option --
                </option>
                {allowedCurrentPorts.map((portKey) => (
                  <option key={portKey} value={portKey}>
                    {existingPorts[portKey]}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <br />
            <label>
              Set departure time
              <DateTime value={departureTime} onChange={handleDepartureTime} />
            </label>
            <br />
            <input type="submit" value="Update tour" />
          </form>
        </fieldset>
      </>
    );
  }

  return (
    <>
      <h3>Tag not in tour. Create new tour</h3>
      <form onSubmit={handleSubmitNewTour}>
        <fieldset disabled={submitting && "disabled"}>
          <label>
            Select starting port
            <select
              onChange={(e) => setStartPort(e.target.value)}
              value={startPort}
            >
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
            <select
              onChange={(e) => setDestinationPort(e.target.value)}
              value={destinationPort}
            >
              {Object.keys(existingPorts).map((portKey) => (
                <option key={portKey} value={portKey}>
                  {existingPorts[portKey]}
                </option>
              ))}
            </select>
          </label>
          <br />
          <input type="submit" value="Create tour" />
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
