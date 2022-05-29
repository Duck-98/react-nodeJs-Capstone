import Head from "next/head";
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../store/configureStore";
import useSWR from "swr";
import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useEffect, useCallback, useState } from "react";
import Router from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const [followingsLimit, setFollowingsLimit] = useState(10);
  const [followersLimit, setFollowersLimit] = useState(10);
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher,
  );
  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher,
  );
  const { me } = useSelector((state) => state.user);
  /*
  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);
*/
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((followingsLimit) => {
      followingsLimit + 3;
    });
  }, []);
  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((followersLimit) => {
      followersLimit + 3;
    });
  }, []);
  /*  Hooks는 전부 다 실행되어야 함. 그렇기 때문에 return은 모든 hooks들이 실행되고 난 뒤에 있어야함. */

  if (!me) {
    return "내 정보 로딩중..";
  }
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return "팔로잉/팔로워 로딩 중 에러가 발생합니다.";
  }

  return (
    <>
      <Head>
        <title>Taxi-Pod | 프로필 </title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="팔로잉 목록"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="팔로워 목록"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      const cookie = req ? req.headers.cookie : "";
      axios.defaults.headers.Cookie = "";
      if (req && cookie) {
        // 서버에 쿠키가 있을 때만 포함됨.
        axios.defaults.headers.Cookie = cookie;
      }
      store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
      store.dispatch(END);
      await store.sagaTask.toPromise();
    },
);

export default Profile;
