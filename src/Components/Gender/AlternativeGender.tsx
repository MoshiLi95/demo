import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

import { EventI } from "../../Slices/DataSlice";

import { VerticalDivider } from "../Utility";
import Paragraph from "./ReactiveParagraph";
import ReactiveGraph from "./Graph";
import Stat from "./Stat";
import "./index.scss";

const Gender = () => {
  const [gender, setGender] = useState<"male" | "female" | "mix">("male");
  const { eventMajorList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);
  const [selectedEventVerbStart, setSelectedEventVerbStart] = useState<
    number | null
  >(null);

  //const [duplicatedEvent, setDuplicatedEvent] = useState<number[]>([]);

  useEffect(() => {
    let result: any = {};
    let eventList = JSON.parse(JSON.stringify(eventMajorList));
    eventList.forEach((item: EventI) => {
      if (!result[item.verbStartByteText]) {
        result[item.verbStartByteText] = { male: [], female: [], mix: [] };
      }

      if (item.gender === "male" || item.gender === "female") {
        result[item.verbStartByteText][item.gender].push(item);
      } else {
        result[item.verbStartByteText]["mix"].push(item);
      }
    });

    eventList = Object.keys(result)
      .filter((key) => {
        return result[key][gender].length >= 1;
      })
      .map((key) => {
        return result[key][gender];
      })
      .flat();

    setSelectedEvents(eventList);
  }, [gender, eventMajorList]);

  return (
    <div className="gender-container--alt">
      <p className="section--label">Gender Select</p>
      <div className="filter--container">
        <button
          className={`filter--btn ${
            gender === "male" ? "filter-btn__selected " : ""
          }`}
          onClick={(e) => {
            setGender("male");
            setSelectedEventVerbStart(null);
          }}
        >
          Male
        </button>
        <button
          className={`filter--btn ${
            gender === "female" ? "filter-btn__selected " : ""
          }`}
          onClick={(e) => {
            setGender("female");
            setSelectedEventVerbStart(null);
          }}
        >
          Female
        </button>
        <button
          className={`filter--btn ${
            gender === "mix" ? "filter-btn__selected " : ""
          }`}
          onClick={(e) => {
            setGender("mix");
            setSelectedEventVerbStart(null);
          }}
        >
          Mix
        </button>
      </div>
      <div className="gender-content">
        <Paragraph
          gender={gender}
          eventList={selectedEvents}
          selectedEventVerbStart={selectedEventVerbStart}
          setSelectedEventVerbStart={setSelectedEventVerbStart}
        />
        <ReactiveGraph
          eventList={selectedEvents}
          setSelectedEventVerbStart={setSelectedEventVerbStart}
        ></ReactiveGraph>
      </div>
      <div className="gender--stat">
        <Stat></Stat>
      </div>
    </div>
  );
};

export default Gender;
