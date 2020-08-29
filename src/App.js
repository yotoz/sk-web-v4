import React, {
  useState,
  useEffect,
  useContext,
} from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import {
  fire,
  getFireDB,
  setMemo,
  firestorage,
  getImageURL,
  logIn,
  logOut,
  loginWithSessionPersistence,
  fastLogin,
  initializeFirebase,
  debug,
  getIdToken,
  FirebaseContext,
  addOnAuthChange,
} from './shared/Firebase.config';

import localStorage from './shared/LocalStorage';
import useLocalStorage from './shared/LocalStorage';

function App() {
  const [data, setData] = useState({ memo: [] });
  const { user, setUser } = useContext(FirebaseContext);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    initializeFirebase();
    addOnAuthChange(setUser);
    // if (token != null) {
    //   fastLogin(token);
    // }
    //firestorage();
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
        data.memo.length ? (
          <div>
            <p>title: {data.memo[0].title}</p>
            <p>desc: {data.memo[0].desc}</p>
            <div>
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
              logIn().then((resolve) => {
                getIdToken().then((idToekn) => {
                  setUser(idToekn);
                });
              });
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
