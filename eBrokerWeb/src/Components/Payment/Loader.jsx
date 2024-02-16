const Loader = (props) => {
  return (
      <>
          {props.screen !== undefined && props.screen === "full" ? (
              <div className={`loader-full-screen loader-container`} style={props.background === "none" ? { background: "none" } : {}}>
                  <div className="loader-box">
                      <span className="loader"></span>
                  </div>
              </div>
          ) : (
              <div
                  className={`loader-container`}
                  style={
                      props.background !== undefined
                          ? props.width !== undefined && props.height !== undefined
                              ? { width: props.width, height: props.height, background: props.background }
                              : {}
                          : props.width !== undefined && props.height !== undefined
                          ? { width: props.width, height: props.height, background: props.background }
                          : {}
                  }
              >
                  <div className="loader-box">
                      <span className="loader"></span>
                  </div>
              </div>
          )}
      </>
  );
};

export default Loader;
