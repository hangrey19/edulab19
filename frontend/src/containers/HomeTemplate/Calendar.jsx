import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import PickersDay from "@mui/lab/PickersDay";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isSameDay,
  format,
  parse,
  getDay,
} from "date-fns";
import { enUS } from "date-fns/locale";

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import {
  fetchAllCalendar,
} from "../../redux/modules/Calendar/action.js";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

function Calendar() {
  const dispatch = useDispatch();
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    dispatch(fetchAllCalendar());
  }, [dispatch]);

  const dataCalendar = useSelector(
    (state) => state.fetchAllCalendarReducer?.data
  );

  // Chuyển dữ liệu từ định dạng `events` cũ sang `react-big-calendar` format
  const convertOldEventsToNew = () => {
    const result = [];

    const days = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 0,
    };

    for (let [day, events] of Object.entries(sampleOldEvents)) {
      const dayOffset = days[day];
      events.forEach((event) => {
        const baseDate = startOfWeek(value); // Lấy ngày đầu tuần
        const start = moment(baseDate).add(dayOffset, "days");
        const startTime = moment(event.startTime);
        const endTime = moment(event.endTime);

        const startDate = start.clone().set({
          hour: startTime.hour(),
          minute: startTime.minute(),
        }).toDate();

        const endDate = start.clone().set({
          hour: endTime.hour(),
          minute: endTime.minute(),
        }).toDate();

        result.push({
          title: event.name,
          start: startDate,
          end: endDate,
          allDay: false,
        });
      });
    }

    return result;
  };

  const sampleOldEvents = {
    monday: [
      {
        id: 1,
        name: "BTVN",
        type: "custom",
        startTime: moment("2018-02-23T11:30:00"),
        endTime: moment("2018-02-23T13:30:00"),
      },
    ],
    wednesday: [
      {
        id: 7,
        name: "Ôn tập",
        type: "custom",
        startTime: moment("2018-02-23T13:00:00"),
        endTime: moment("2018-02-23T14:30:00"),
      },
      {
        id: 4,
        name: "Kiểm tra",
        type: "custom",
        startTime: moment("2018-02-22T15:00:00"),
        endTime: moment("2018-02-22T16:30:00"),
      },
    ],
    friday: [
      {
        id: 7,
        name: "Ôn tập",
        type: "error",
        startTime: moment("2018-02-23T11:30:00"),
        endTime: moment("2018-02-23T14:30:00"),
      },
      {
        id: 4,
        name: "Thi",
        type: "custom",
        startTime: moment("2018-02-22T14:30:00"),
        endTime: moment("2018-02-22T16:30:00"),
      },
    ],
    saturday: [
      {
        id: 7,
        name: "Bài tập ngắn",
        type: "custom",
        startTime: moment("2018-02-23T07:00:00"),
        endTime: moment("2018-02-23T09:30:00"),
      },
      {
        id: 4,
        name: "Kiểm tra",
        type: "custom",
        startTime: moment("2018-02-22T16:00:00"),
        endTime: moment("2018-02-22T17:30:00"),
      },
    ],
    tuesday: [],
    thursday: [],
    sunday: [],
  };

  const events = useMemo(() => convertOldEventsToNew(), [value]);

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    const start = startOfWeek(value);
    const end = endOfWeek(value);

    const dayIsBetween = isWithinInterval(date, { start, end });
    const isFirstDay = isSameDay(date, start);
    const isLastDay = isSameDay(date, end);

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <div className="calendar-container" style={{ display: "flex", gap: 20 }}>
      <div className="calendar-pick-week">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            label="Week picker"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderDay={renderWeekPickerDay}
            renderInput={(params) => <TextField {...params} />}
            inputFormat="'Tuần của' MMM d"
          />
        </LocalizationProvider>
      </div>
      <div className="calendar-big" style={{ flex: 1 }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          defaultView="week"
          views={["week", "day"]}
        />
      </div>
    </div>
  );
}

export default Calendar;
