import {
  footer,
  footerContent,
  footerColumn,
  footerColumnFirst,
  footerColumnFirstURL,
  footerColumnList,
  footerColumnListURL,
} from "../styles/footer.js";

export default function Footer(props) {
  return (
    <footer className={footer.className}>
      <div className={footerContent.className}>
        <p>Developed for ELEC-E8408 Project - Group 13</p>
      </div>
      {footerColumnListURL.styles}
      {footerColumnList.styles}
      {footerColumnFirstURL.styles}
      {footerColumnFirst.styles}
      {footerColumn.styles}
      {footerContent.styles}
      {footer.styles}
    </footer>
  );
}
