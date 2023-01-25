import React from "react";

function DateString(props: { date: string }) {
  const dateString = React.useMemo(() => {
    return props.date ? new Date(props.date).toLocaleDateString() : "-";
  }, [props.date]);
  return <>{dateString}</>;
}

export default DateString;
