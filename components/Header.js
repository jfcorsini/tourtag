import { headerTitle } from "../styles/header";

export default function Header(props) {
  return (
    <>
      <h1 className={headerTitle.className}>TourTag</h1>
      {headerTitle.styles}
    </>
  );
}
