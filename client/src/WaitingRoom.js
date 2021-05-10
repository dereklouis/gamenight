import './styles/WaitingRoom.css';

const WaitingRoom = (props) => {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div id="waitingRoomContainer" className="flexColumn">
      <img
        src="/waitingRoom/waitingRoomSign.png"
        alt="waiting room sign"
        id="waitingRoomSign"
      />
      <div id="waitingAreaContainer">
        {arr.map((idx) => {
          if (props.fetchedUsers[idx]) {
            return (
              <div key={idx} className="waitingRoomChairContainer">
                <h3 className="waitingRoomName">
                  {props.fetchedUsers[idx].name}
                </h3>
                <img
                  src={`/waitingRoom/waitingDog${props.fetchedUsers[idx].photoID}.png`}
                  alt="dog"
                  className="waitingRoomSeatPhoto"
                />
              </div>
            );
          } else {
            return (
              <div key={idx} className="waitingRoomChairContainer">
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
