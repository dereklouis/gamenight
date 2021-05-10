import { useState } from 'react';
import axios from 'axios';

const Attending = (props) => {
  const setAttending = async (response) => {
    await axios.put(`/api/users/attending/${props.userNameLS}`, {
      answer: response,
    });
    props.updateAttending(response);
    props.loadData();
  };
  return (
    <>
      <p id="attending">Will you be attending Game Night tonight?</p>
      <div id="yesno">
        <button id="yes" onClick={() => setAttending('yes')}>
          YES
        </button>
        <button id="no" onClick={() => setAttending('no')}>
          NO
        </button>
      </div>
    </>
  );
};

export default Attending;
