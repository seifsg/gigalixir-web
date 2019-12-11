import React from "react";
import qs from "query-string";
import { connect } from "react-redux";

export const SuccessPage = (props: {
  msg: string;
  location: { search: string };
}) => {
  const { location } = props;
  const params = qs.parse(location.search);
  if (typeof params.msg === "string") {
    return <div>{params.msg}</div>;
  } else {
    return (
      <div>Oops, no message to show. Please contact help@gigalixir.com</div>
    );
  }
};

export default connect(
  null,
  {}
)(SuccessPage);
