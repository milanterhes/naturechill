"use client";

import { useEffect, useMemo, useState } from "react";
import { trpc } from "../utils/trpc";
import Calendar from "react-calendar";

// interface CalendarProps {
//   minDate: Date;
//   maxDate: Date;
//   tileDisabled: TileDisabledFunc;
// }

// const Calendar: React.FC<CalendarProps> = ({
//   maxDate,
//   minDate,
//   tileDisabled,
// }) => {
//   return (
//     <RCalendar
//       maxDate={maxDate}
//       minDate={minDate}
//       tileDisabled={tileDisabled}
//     />
//   );
// };

const CalendarWrapper = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });
  const [shouldDisplay, setShouldDisplay] = useState(false);

  useEffect(() => {
    setShouldDisplay(true);
  }, []);

  const { data: availableDates, status } =
    trpc.booking.getAvailableDates.useQuery(
      {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      },
      {
        refetchInterval: 1000 * 30, // 30 seconds
        refetchOnWindowFocus: false,
      }
    );

  // 3 months later
  const maxDate = useMemo(() => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 3);
    return date;
  }, [startDate]);

  // Prev Month
  const minDate = useMemo(() => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() - 1);
    return date;
  }, [startDate]);

  function tileDisabled({ date, view }: { date: Date; view: string }) {
    // if same day as today
    if (
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    ) {
      console.log("today");
      console.log(date);
      return true;
    }
    if (!availableDates) return false;
    if (view === "month") {
      return !availableDates.find((d) => d.getTime() === date.getTime());
    }
    return false;
  }

  if (!shouldDisplay) return null;

  return (
    <Calendar
      maxDate={maxDate}
      minDate={minDate}
      tileDisabled={tileDisabled}
      returnValue="range"
      selectRange
      onChange={console.log}
      onViewChange={console.log}
      className={"text-black"}
      value={[startDate, endDate]}
    />
  );
};

export default CalendarWrapper;
