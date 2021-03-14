import React from "react";
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

export default function Tag({ tagData, date }) {
  console.log("Inside tag component", tagData);
  const jsonData = JSON.parse(tagData.jsonData);
  return (
    <>
      <div className={guestbookEntry.className}>
        <div className={guestbookEntryUserDetail.className}>
          <span className={guestbookEntryUserDetailTimestamp.className}>
            Created on {date.toDateString()}
          </span>
        </div>
        <div className={guestbookEntryStory.className}>
          <p>
            Tag ID: <b>{tagData._id}</b>
          </p>
          <p>
            Tag identifier: <b>{tagData.identifier}</b>
          </p>
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
