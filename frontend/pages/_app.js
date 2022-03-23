import "antd/dist/antd.css";
import PropTypes from "prop-types";
import Head from "next/head";
import wrapper from "../store/configureStore";
import { Provider } from "react-redux";

const App = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Taxi-Pod </title>
      </Head>
      <Component />
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);
