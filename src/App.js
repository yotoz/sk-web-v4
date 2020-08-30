import React, {
  useState,
  useEffect,
  useContext,
} from 'react';
import './App.css';

import {
  fire,
  getFireDB,
  setMemo,
  firestorage,
  getImageURL,
  logIn,
  logOut,
  initializeFirebase,
  FirebaseContext,
  addOnAuthChange,
} from './shared/Firebase.config';

function App() {
  const [data, setData] = useState({ memo: [] });
  const { user, setUser } = useContext(FirebaseContext);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    initializeFirebase();
    addOnAuthChange(setUser);
  });

  useEffect(() => {
    fire().then(() => {
      getFireDB().then((res) => {
        setData({
          memo: res.val().memos,
        });
      });
    });
  }, [user]);

  const sendMemo = (title, desc) => {
    setMemo(title, desc);
  };

  const allLogout = () => {
    logOut();
    setUser(null);
    setImgSrc(null);
  };

  return (
    <div className="App">
      <h1>Schedule</h1>
      {user !== null ? (
        Object.keys(data.memo).length ? (
          <div>
            <div>
              <div>
                {Object.keys(data.memo).map((key) => {
                  const { desc, title } = data.memo[key];

                  return (
                    <div key={key}>
                      <hr />
                      <h2>{key}</h2>
                      <p>title: {title}</p>
                      <p>desc: {desc}</p>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  firestorage();
                  // sendMemo('test title', 'test desc');
                  getImageURL().then((result) => {
                    setImgSrc(result);
                  });
                }}
              >
                이미지 가져올 꺼임 ㅎ
              </button>
              <button onClick={allLogout}>
                로그아웃 할꺼임
              </button>
            </div>
            {imgSrc !== null ? (
              <img alt="test" src={imgSrc} />
            ) : undefined}
          </div>
        ) : (
          <p className="loading">LOADING</p>
        )
      ) : (
        <div>
          <button
            onClick={() => {
              logIn();
            }}
          >
            구글 로그인 할꺼임 ㅎㅎ
          </button>
          <p className="loading">wait login</p>
          <button onClick={allLogout}>
            로그아웃 할꺼임
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
