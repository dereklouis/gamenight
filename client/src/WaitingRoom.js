import { useState, useEffect } from 'react';
import axios from 'axios';

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const WaitingRoom = () => {
  return (
    <div id="waitingRoomContainer" className="flexColumn">
      <img
        src="/waitingRoom/waitingRoomSign.png"
        alt="waiting room sign"
        id="waitingRoomSign"
      />
      <div id="waitingAreaContainer">
        {arr.map((chair) => {
          if (chair < 9) {
            return (
              <div key={chair} className="waitingRoomChairContainer">
                <h3 className="waitingRoomName">Name</h3>
                <img
                  src={`/waitingRoom/dog${
                    Math.floor(Math.random() * 12) + 1
                  }.png`}
                  alt="dog"
                  className="waitingRoomSeatPhoto"
                />
              </div>
            );
          } else {
            return (
              <div key={chair} className="waitingRoomChairContainer">
                <img
                  src="/waitingRoom/empty.png"
                  alt="dog"
                  className="waitingRoomSeatPhoto"
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default WaitingRoom;
